#!/usr/bin/env node
// Fails the build when the committed MCP catalog breaks a rule in
// catalog-rules.mjs. Runs first in `npm run build`, which is what Vercel runs,
// so a catalog that would offer an install the daemon refuses -- or one that
// carries a value where only a name belongs -- never deploys.

import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMMUNITY_FILE, validateCatalog } from './catalog-rules.mjs';

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
if (errs.length) {
  console.error(`mcp catalog: ${errs.length} problem(s):\n${errs.slice(0, 40).join('\n')}`);
  process.exit(1);
}
console.log(`mcp catalog: ${doc.servers.length} verified, ${communityCount} community -- ok`);
