#!/usr/bin/env node
// Fails the build when the committed MCP catalog breaks a rule in
// catalog-rules.mjs, or lists a verified server nobody has started. Runs first
// in `npm run build`, which is what Cloudflare runs, so a catalog that would
// offer an install the daemon refuses -- or one that carries a value where only
// a name belongs, or a verified pin with no passing handshake -- never deploys.

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMMUNITY_FILE, validateCatalog } from './catalog-rules.mjs';
import { HANDSHAKES, launchKey } from './handshake.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIR = resolve(ROOT, 'public', 'api', 'mcp', 'v1');

async function read(file) {
  try {
    return JSON.parse(await readFile(resolve(DIR, file), 'utf8'));
  } catch (err) {
    console.error(`mcp catalog: ${file} is not readable JSON: ${err.message}`);
    process.exit(1);
  }
}

const doc = await read('catalog.json');
const ids = new Set();
const errs = validateCatalog(doc, { tier: 'verified', taken: ids });
let communityCount = 0;
if (doc.community) {
  const community = await read(COMMUNITY_FILE);
  errs.push(...validateCatalog(community, { tier: 'community', taken: ids }));
  communityCount = community.servers?.length ?? 0;
  if (communityCount !== doc.community.count)
    errs.push(`catalog.json says ${doc.community.count} community servers; ${COMMUNITY_FILE} holds ${communityCount}`);
}
if (!doc.servers?.length) errs.push('there are no verified servers; the marketplace opens on that list');

// "Verified" is a claim that this exact launch line was started and listed its
// tools (scripts/mcp/handshake.mjs). A new pin without a new record fails here.
let handshakes = {};
try {
  handshakes = JSON.parse(await readFile(HANDSHAKES, 'utf8')).servers ?? {};
} catch {
  // missing: every verified entry is reported below
}
for (const s of doc.servers ?? []) {
  const h = handshakes[s.id];
  if (!h || !h.ok || h.launch !== launchKey(s))
    errs.push(`${s.id}: no passing handshake for ${s.launch.command} ${s.launch.args.join(' ')}; run npm run mcp:handshake -- ${s.id}`);
}
if (errs.length) {
  console.error(`mcp catalog: ${errs.length} problem(s):\n${errs.slice(0, 40).join('\n')}`);
  process.exit(1);
}
console.log(`mcp catalog: ${doc.servers.length} verified, ${communityCount} community -- ok`);
