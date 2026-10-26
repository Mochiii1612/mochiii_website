#!/usr/bin/env node
// Rebuilds public/api/mcp/v1/catalog.json: the servers in mcp/curated.json
// (tier "verified", exactly as pinned there), then every other server in the official MCP Registry that
// Mochiii can launch as it stands (tier "community").
//
//   npm run mcp:sync                          # fetch the registry and rebuild
//   npm run mcp:sync -- --save-cache reg.json # ...and keep what was fetched
//   npm run mcp:sync -- --cache reg.json      # rebuild from a saved fetch
//
// RUN BY A PERSON, NEVER BY THE BUILD. The registry is somebody else's data, and
// this file decides which programs the marketplace offers to run. A sync is a
// diff a maintainer reads and commits -- including every version bump of a
// verified server -- not something that changes on its own at deploy time.
// `npm run build` only validates what was committed (check-catalog.mjs).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  SCHEMA_VERSION,
  cleanText,
  exactVersion,
  expectedLaunch,
  validEnvName,
  validServerId,
  validateCatalog,
  validateServer,
  COMMUNITY_FILE,
} from './catalog-rules.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CURATED = resolve(ROOT, 'mcp', 'curated.json');
const OUT_DIR = resolve(ROOT, 'public', 'api', 'mcp', 'v1');
const OUT = resolve(OUT_DIR, 'catalog.json');
const OUT_COMMUNITY = resolve(OUT_DIR, COMMUNITY_FILE);
const REGISTRY = 'https://registry.modelcontextprotocol.io';
const REGISTRY_SERVERS = `${REGISTRY}/v0.1/servers`;
const OFFICIAL = 'io.modelcontextprotocol.registry/official';

// Which package a server is offered through, when it has several: the one with
// the least to install first. npx needs Node, uvx needs uv, docker a daemon.
const PREFERENCE = ['npm', 'pypi', 'oci'];

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function fetchRegistry() {
  const servers = [];
  let cursor;
  for (let page = 1; ; page++) {
    const url = new URL(REGISTRY_SERVERS);
    url.searchParams.set('version', 'latest');
    url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('cursor', cursor);
    let body;
    for (let attempt = 1; ; attempt++) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(90_000), headers: { accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        body = await res.json();
        break;
      } catch (err) {
        if (attempt === 5) throw new Error(`registry page ${page}: ${err.message}`);
        await new Promise((r) => setTimeout(r, 3000 * attempt));
      }
    }
    servers.push(...(body.servers ?? []));
    process.stderr.write(`\rregistry: ${servers.length} servers`);
    cursor = body.metadata?.nextCursor;
    if (!cursor) break;
  }
  process.stderr.write('\n');
  return servers;
}

// userInput says whether an argument list needs something only the user can
// supply -- a path, a port, an account. Those servers cannot be one-click.
// A required argument with no value and no default needs input, except a named
// one with no value hint either: that is a bare flag, given by its name alone.
function userInput(args) {
  return (args ?? []).some((a) => {
    const v = a.value ?? a.default;
    if (typeof v === 'string' && v.includes('{')) return true;
    if (a.isRequired !== true || v !== undefined) return false;
    return a.type !== 'named' || a.valueHint !== undefined;
  });
}

// fixedArgs are the arguments a package declares as required or with a fixed
// value, in order, each with its value or else its default. Optional arguments
// with neither are left to the server's own default.
function fixedArgs(args) {
  const out = [];
  for (const a of args ?? []) {
    const v = typeof a.value === 'string' ? a.value : a.isRequired && typeof a.default === 'string' ? a.default : undefined;
    if (a.type === 'positional' && v !== undefined) out.push(v);
    if (a.type === 'named' && typeof a.name === 'string' && (a.isRequired || v !== undefined)) {
      out.push(a.name);
      if (v !== undefined) out.push(v);
    }
  }
  return out;
}

function publisherOf(registryName) {
  const ns = registryName.split('/')[0] ?? '';
  const gh = ns.match(/^io\.github\.(.+)$/);
  if (gh) return gh[1];
  return ns.split('.').reverse().join('.');
}

function idFrom(registryName) {
  const tail = (registryName.split('/').pop() ?? '').toLowerCase();
  let id = tail.replace(/[^a-z0-9_-]+/g, '-').replace(/_{2,}/g, '_').replace(/-{2,}/g, '-');
  id = id.replace(/^[^a-z0-9]+/, '').replace(/-?(mcp-server|mcp)$/, '').replace(/^(mcp-server-|mcp-)/, '');
  id = id.replace(/[-_]+$/, '');
  return id.slice(0, 32).replace(/[-_]+$/, '') || 'server';
}

function titleFrom(registryName) {
  return (registryName.split('/').pop() ?? registryName).replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function packageUrl(pkg) {
  if (pkg.registry === 'npm') return `https://www.npmjs.com/package/${pkg.identifier}/v/${pkg.version}`;
  if (pkg.registry === 'pypi') return `https://pypi.org/project/${pkg.identifier}/${pkg.version}/`;
  return undefined;
}

function httpsOrUndefined(u) {
  try {
    return new URL(u).protocol === 'https:' ? u : undefined;
  } catch {
    return undefined;
  }
}

// ociVersion is an image's version: the registry's own field, or else the tag
// the identifier carries (ghcr.io/github/github-mcp-server:2.0.2 has no
// separate version -- the tag is the pin).
function ociVersion(pkg) {
  if (pkg.version) return pkg.version;
  const last = (pkg.identifier ?? '').split('/').pop() ?? '';
  const tag = last.includes(':') ? last.slice(last.lastIndexOf(':') + 1) : '';
  return tag || undefined;
}

// fromRegistry maps one registry entry to a catalog entry, or says why not.
//
// opts.env replaces the variables the registry declares. A curated entry uses
// it where the registry hands a credential over in a way Mochiii does not --
// GitHub's image takes its token as `-e GITHUB_PERSONAL_ACCESS_TOKEN={token}`,
// a value typed into the command line, where Mochiii passes the variable by
// NAME. With it, the registry's runtime arguments (where such placeholders
// live) are not consulted: the launch line is built here regardless.
export function fromRegistry(entry, opts = {}) {
  const s = entry.server ?? {};
  const meta = entry._meta?.[OFFICIAL] ?? {};
  if (meta.status && meta.status !== 'active') return { skip: `status ${meta.status}` };
  const stdio = (s.packages ?? []).filter((p) => p.transport?.type === 'stdio');
  if (stdio.length === 0) return { skip: s.remotes?.length ? 'remote only (Mochiii runs stdio servers)' : 'no stdio package' };
  const pkg = PREFERENCE.map((r) => stdio.find((p) => p.registryType === r)).find(Boolean);
  if (!pkg) return { skip: `package type Mochiii cannot launch (${[...new Set(stdio.map((p) => p.registryType))].join(', ')})` };
  const version = pkg.registryType === 'oci' ? ociVersion(pkg) : pkg.version;
  if (!exactVersion(version)) return { skip: 'no exact version' };
  if (userInput(pkg.packageArguments) || (!opts.env && userInput(pkg.runtimeArguments)))
    return { skip: 'needs arguments of your own' };

  const env = [];
  for (const ev of opts.env ?? pkg.environmentVariables ?? []) {
    if (typeof ev.value === 'string') return { skip: 'needs an environment value set for it' };
    if (!validEnvName(ev.name)) return { skip: 'asks for a variable Mochiii will not pass' };
    if (env.some((e) => e.name === ev.name)) continue;
    const description = cleanText(ev.description ?? '').slice(0, 300);
    env.push({
      name: ev.name,
      required: ev.isRequired === true || ev.required === true,
      secret: ev.isSecret === true || ev.secret === true,
      ...(description ? { description } : {}),
    });
  }
  if (env.length > 24) return { skip: 'asks for too many variables' };

  const registry = pkg.registryType;
  const identifier = pkg.identifier;
  if (typeof identifier !== 'string' || !/^[A-Za-z0-9@][A-Za-z0-9@/._:+-]*$/.test(identifier)) return { skip: 'package name is not plain' };
  const pinned = { registry, identifier, version };
  const url = packageUrl(pinned);
  const launch = expectedLaunch(pinned, env);
  launch.args.push(...fixedArgs(pkg.packageArguments));

  const description = cleanText(s.description ?? '').slice(0, 400);
  const name = cleanText(s.title ?? '').slice(0, 80) || titleFrom(s.name);
  if (!description) return { skip: 'no description' };
  const homepage = httpsOrUndefined(s.websiteUrl) ?? httpsOrUndefined(s.repository?.url);
  return {
    server: {
      id: idFrom(s.name),
      name,
      description,
      publisher: cleanText(publisherOf(s.name)).slice(0, 80) || 'unknown',
      namespace: s.name,
      tier: 'community',
      categories: [],
      ...(homepage ? { homepage } : {}),
      package: { ...pinned, ...(url ? { url } : {}) },
      launch,
      env,
    },
  };
}

// curatedServer is a verified entry, exactly as curated.json pins it: the
// package and version a person chose and started (npm run mcp:handshake), the
// arguments after it, the variables it reads. Nothing here comes from the
// registry -- a sync that moved a verified pin would ship a version nobody
// had tried. The registry only says, below, when a newer version exists.
function curatedServer(c) {
  const pkg = { ...c.package };
  const env = c.env ?? [];
  const launch = expectedLaunch(pkg, env);
  if (!launch) throw new Error(`curated ${c.id}: package.registry ${pkg.registry} is not one Mochiii launches`);
  launch.args.push(...(c.args ?? []));
  const url = packageUrl(pkg);
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    publisher: c.publisher,
    ...(c.namespace ? { namespace: c.namespace } : {}),
    tier: 'verified',
    categories: c.categories ?? [],
    ...(c.homepage ? { homepage: c.homepage } : {}),
    package: { ...pkg, ...(url ? { url } : {}) },
    launch,
    env,
    ...(c.cwd ? { cwd: c.cwd } : {}),
  };
}

// serialize writes one server per line: small to serve, and a sync's diff reads
// as the list of servers that changed.
function serialize(doc) {
  const head = JSON.stringify({ ...doc, servers: [] }).replace(/"servers":\[\]\}$/, '"servers":[\n');
  return `${head}${doc.servers.map((s) => JSON.stringify(s)).join(',\n')}\n]}\n`;
}

// uniqueId keeps ids distinct: the derived one, then with the publisher, then numbered.
function uniqueId(server, taken) {
  const base = server.id;
  const candidates = [base, `${base}-${server.publisher.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`];
  for (const c of candidates) {
    const id = c.slice(0, 32).replace(/[-_]+$/, '');
    if (validServerId(id) && !taken.has(id)) return id;
  }
  for (let n = 2; ; n++) {
    const id = `${base.slice(0, 28).replace(/[-_]+$/, '')}-${n}`;
    if (validServerId(id) && !taken.has(id)) return id;
  }
}

async function main() {
  const cachePath = argValue('--cache');
  const saveCache = argValue('--save-cache');
  const registry = cachePath ? JSON.parse(await readFile(cachePath, 'utf8')) : await fetchRegistry();
  if (saveCache) await writeFile(saveCache, JSON.stringify(registry));
  const byName = new Map(registry.map((e) => [e.server?.name, e]));
  const curated = JSON.parse(await readFile(CURATED, 'utf8')).servers;

  const taken = new Set();
  const out = [];
  const newer = [];
  for (const c of curated) {
    const server = curatedServer(c);
    taken.add(server.id);
    out.push(server);
    const latest = c.namespace ? byName.get(c.namespace)?.server?.version : undefined;
    if (latest && latest !== c.package.version) newer.push(`  ${c.id}: pinned at ${c.package.version}, the registry has ${latest}`);
  }
  if (newer.length) {
    console.log('verified servers with a newer version in the registry (bump in mcp/curated.json, then npm run mcp:handshake):');
    console.log(newer.join('\n'));
  }

  const curatedNames = new Set(curated.map((c) => c.namespace).filter(Boolean));
  const verifiedPackages = new Set(out.map((s) => `${s.package.registry}:${s.package.identifier}`));
  const skipped = new Map();
  const skip = (reason) => skipped.set(reason, (skipped.get(reason) ?? 0) + 1);
  const community = [];
  for (const entry of registry) {
    if (curatedNames.has(entry.server?.name)) continue;
    const mapped = fromRegistry(entry);
    if (mapped.skip) {
      skip(mapped.skip);
      continue;
    }
    // Somebody else's listing of a package Mochiii already offers as verified:
    // two cards for one program, one of them unreviewed, helps nobody.
    if (verifiedPackages.has(`${mapped.server.package.registry}:${mapped.server.package.identifier}`)) {
      skip('same package as a verified entry');
      continue;
    }
    // A community entry that breaks a rule is left out and counted; a verified
    // one that does fails the sync (validateCatalog below), because a person
    // chose it and should see why it no longer fits.
    if (validateServer({ ...mapped.server, id: 'probe' }).length > 0) {
      skip('breaks a catalog rule (too many arguments or variables, or text that is not plain)');
      continue;
    }
    // Kept shorter than a verified entry's: there are thousands, and the card
    // shows the variable's name and whether it is a secret first.
    for (const e of mapped.server.env) {
      if (e.description && e.description.length > 120) e.description = e.description.slice(0, 119).trimEnd() + '…';
    }
    community.push(mapped.server);
  }
  community.sort((a, b) => a.namespace.localeCompare(b.namespace));
  for (const server of community) {
    server.id = uniqueId(server, taken);
    taken.add(server.id);
  }

  const generatedAt = new Date().toISOString();
  const doc = {
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    sources: [
      { id: 'mochiii-curated', name: 'Reviewed by Mochiii', url: 'https://www.mochiii.in/mcp' },
      { id: 'mcp-registry', name: 'Official MCP Registry', url: REGISTRY },
    ],
    community: { path: COMMUNITY_FILE, count: community.length },
    servers: out,
  };
  const communityDoc = { schemaVersion: SCHEMA_VERSION, generatedAt, servers: community };
  const ids = new Set();
  const errs = [...validateCatalog(doc, { tier: 'verified', taken: ids }), ...validateCatalog(communityDoc, { tier: 'community', taken: ids })];
  if (errs.length) {
    console.error(`the rebuilt catalog is not valid:\n${errs.slice(0, 40).join('\n')}`);
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT, serialize(doc));
  await writeFile(OUT_COMMUNITY, serialize(communityDoc));
  console.log(`registry: ${registry.length} servers -> catalog: ${out.length} verified, ${community.length} community`);
  for (const [reason, n] of [...skipped].sort((a, b) => b[1] - a[1])) console.log(`  skipped ${String(n).padStart(6)}  ${reason}`);
}

// Run when invoked, not when imported (a test, or a one-off look at the data).
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
