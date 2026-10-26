#!/usr/bin/env node
// Starts every verified server in catalog.json -- the exact pinned launch line
// the catalog states -- completes an MCP initialize and tools/list against it,
// and records how each fared in mcp/handshakes.json.
//
//   npm run mcp:handshake               # every verified entry
//   npm run mcp:handshake -- github     # just these ids (the rest are kept)
//
// THIS IS WHAT "VERIFIED" MEANS. The marketplace tells a user the verified tier
// was chosen and reviewed; an entry nobody has started is not reviewed, it is a
// guess. check-catalog.mjs refuses a verified entry with no passing record for
// its exact launch line, so bumping a version without running this fails the
// build instead of shipping an untried pin.
//
// RUN BY A PERSON, like mcp:sync: it downloads and runs third-party code. It
// launches the way the Mochiii daemon does (daemon/mcp ServerEnv): PATH and
// HOME and nothing else of this shell's environment, plus the variables the
// entry declares. A required variable gets a placeholder, not a real key --
// the handshake proves the package starts and lists its tools, not that the
// account behind a key works. Which placeholders were given is recorded.

import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const CATALOG = resolve(ROOT, 'public', 'api', 'mcp', 'v1', 'catalog.json');
export const HANDSHAKES = resolve(ROOT, 'mcp', 'handshakes.json');
const TIMEOUT_MS = 240_000; // a first npx/uvx/docker run downloads the package
const PROTOCOL = '2025-06-18';
export const PLACEHOLDER = 'mochiii-handshake-placeholder';

// launchKey is what a record is bound to: the program and every argument. A
// record for 1.2.0 says nothing about 1.2.1, or about the same version started
// with different flags.
export function launchKey(server) {
  return JSON.stringify([server.launch.command, ...server.launch.args, server.cwd ?? '']);
}

// A workspace like the one a user opens: a git repository with a file in it,
// so the servers that start in the project (filesystem, git, eslint) have one.
async function makeWorkspace(base) {
  const ws = join(base, 'workspace');
  await mkdir(ws, { recursive: true });
  await writeFile(join(ws, 'README.md'), '# handshake workspace\n');
  await writeFile(join(ws, 'index.js'), 'export const x = 1;\n');
  await new Promise((ok, fail) => {
    const p = spawn('git', ['init', '-q', ws], { stdio: 'ignore' });
    p.on('exit', (c) => (c === 0 ? ok() : fail(new Error('git init failed'))));
  });
  return ws;
}

function handshake(server, cwd) {
  return new Promise((done) => {
    const env = { PATH: process.env.PATH, HOME: process.env.HOME };
    // MCP_HANDSHAKE_<NAME> in this shell gives a variable a real value -- a
    // throwaway local database for postgres, say. Only the name is recorded.
    const placeholders = [];
    const given = [];
    for (const e of server.env) {
      const real = process.env[`MCP_HANDSHAKE_${e.name}`];
      if (real !== undefined) {
        env[e.name] = real;
        given.push(e.name);
      } else if (e.required) {
        env[e.name] = PLACEHOLDER;
        placeholders.push(e.name);
      }
    }
    const started = Date.now();
    // A group of its own: npx and uvx start the server as a child of theirs,
    // and stopping only the launcher would leave the server running.
    const child = spawn(server.launch.command, server.launch.args, { cwd, env, stdio: ['pipe', 'pipe', 'pipe'], detached: true });
    const kill = (sig) => {
      try {
        process.kill(-child.pid, sig);
      } catch {
        // already gone
      }
    };
    let stdout = '';
    let stderr = '';
    let finished = false;
    const finish = (result) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      kill('SIGTERM');
      setTimeout(() => kill('SIGKILL'), 3000).unref();
      done({ ...result, placeholders, given, seconds: Math.round((Date.now() - started) / 1000) });
    };
    const timer = setTimeout(() => finish({ ok: false, error: `no answer in ${TIMEOUT_MS / 1000}s` }), TIMEOUT_MS);
    const send = (msg) => child.stdin.write(`${JSON.stringify(msg)}\n`);
    child.stdin.on('error', () => {}); // a server that exits early; 'exit' says so
    child.on('error', (err) => finish({ ok: false, error: err.message }));
    child.on('exit', (code) => finish({ ok: false, error: `exited with ${code} before listing tools: ${stderr.trim().slice(-300)}` }));
    child.stderr.on('data', (d) => (stderr = (stderr + d).slice(-4000)));
    child.stdout.on('data', (d) => {
      stdout += d;
      let nl;
      while ((nl = stdout.indexOf('\n')) >= 0) {
        const line = stdout.slice(0, nl).trim();
        stdout = stdout.slice(nl + 1);
        let msg;
        try {
          msg = JSON.parse(line);
        } catch {
          continue; // a server that logs to stdout; the daemon skips such lines too
        }
        if (msg.id === 1) {
          if (msg.error) return finish({ ok: false, error: `initialize: ${msg.error.message}` });
          send({ jsonrpc: '2.0', method: 'notifications/initialized' });
          send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
        } else if (msg.id === 2) {
          if (msg.error) return finish({ ok: false, error: `tools/list: ${msg.error.message}` });
          const tools = (msg.result?.tools ?? []).map((t) => t.name);
          return finish({ ok: tools.length > 0, tools, ...(tools.length ? {} : { error: 'listed no tools' }) });
        }
      }
    });
    send({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: PROTOCOL, capabilities: {}, clientInfo: { name: 'mochiii-catalog-handshake', version: '1' } },
    });
  });
}

async function save(records) {
  const sorted = Object.fromEntries(Object.entries(records).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(
    HANDSHAKES,
    `${JSON.stringify(
      {
        '//': 'Written by `npm run mcp:handshake`: each verified server started from its exact launch line, and what tools/list returned. check-catalog.mjs refuses a verified entry without a passing record here.',
        protocolVersion: PROTOCOL,
        runtime: { node: process.version, platform: `${process.platform}-${process.arch}` },
        servers: sorted,
      },
      null,
      2,
    )}\n`,
  );
}

async function main() {
  const only = process.argv.slice(2);
  const catalog = JSON.parse(await readFile(CATALOG, 'utf8'));
  let records = {};
  try {
    records = JSON.parse(await readFile(HANDSHAKES, 'utf8')).servers ?? {};
  } catch {
    // none yet
  }
  const base = await mkdtemp(join(tmpdir(), 'mochiii-handshake-'));
  const ws = await makeWorkspace(base);
  let failed = 0;
  try {
    for (const server of catalog.servers) {
      if (only.length && !only.includes(server.id)) continue;
      // A private folder per server, as the daemon gives one; the workspace for cwd "workspace".
      const cwd = server.cwd === 'workspace' ? ws : await mkdtemp(join(base, `${server.id}-`));
      process.stderr.write(`${server.id}: ${[server.launch.command, ...server.launch.args].join(' ')} ... `);
      const r = await handshake(server, cwd);
      process.stderr.write(r.ok ? `ok, ${r.tools.length} tools (${r.seconds}s)\n` : `FAILED: ${r.error}\n`);
      if (!r.ok) failed++;
      records[server.id] = {
        launch: launchKey(server),
        ok: r.ok,
        at: new Date().toISOString(),
        seconds: r.seconds,
        ...(r.ok ? { tools: r.tools } : { error: r.error }),
        ...(r.placeholders.length ? { placeholders: r.placeholders } : {}),
        ...(r.given.length ? { given: r.given } : {}),
      };
      await save(records); // after each, so an interrupted run keeps what it learned
    }
  } finally {
    await rm(base, { recursive: true, force: true });
  }
  if (failed) {
    console.error(`${failed} server(s) did not complete the handshake; they cannot stay in the verified tier`);
    process.exit(1);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
