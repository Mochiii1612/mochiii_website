// The MCP catalog as this site's /mcp page reads it: the same files the
// Mochiii VS Code extension fetches (public/api/mcp/v1/), so the page shows
// exactly what the marketplace offers. scripts/mcp/catalog-rules.mjs is the
// format's source of truth; these types follow it.

export const CATALOG_URL = '/api/mcp/v1/catalog.json';

export type Tier = 'verified' | 'community';

export interface CatalogEnv {
  name: string;
  required: boolean;
  secret: boolean;
  description?: string;
}

export interface CatalogServer {
  id: string;
  name: string;
  description: string;
  publisher: string;
  namespace?: string;
  tier: Tier;
  categories: string[];
  homepage?: string;
  package: { registry: 'npm' | 'pypi' | 'oci'; identifier: string; version: string; url?: string };
  launch: { command: string; args: string[] };
  env: CatalogEnv[];
  cwd?: 'workspace';
}

export interface CatalogFile {
  schemaVersion: 1;
  generatedAt: string;
  community?: { path: string; count: number };
  servers: CatalogServer[];
}

async function getJson(url: string): Promise<CatalogFile> {
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${url} answered HTTP ${res.status}`);
  const doc = (await res.json()) as CatalogFile;
  if (doc?.schemaVersion !== 1 || !Array.isArray(doc.servers)) throw new Error(`${url} is not a version-1 catalog`);
  return doc;
}

export function loadCatalog(): Promise<CatalogFile> {
  return getJson(CATALOG_URL);
}

export function loadCommunity(catalog: CatalogFile): Promise<CatalogFile> {
  const path = catalog.community?.path ?? 'community.json';
  return getJson(new URL(path, new URL(CATALOG_URL, window.location.origin)).pathname);
}

/** The Mochiii extension's id: publisher.name from its package.json. */
export const EXTENSION_ID = 'MochiiiAIAgent.mochiii-vscode';

/**
 * vscodeInstallLink opens the server in Mochiii's marketplace inside VS Code.
 * It carries ONLY the id: the extension looks the server up in the catalog it
 * fetched itself and asks the user there, so a link -- which any page can
 * write -- cannot choose what runs.
 */
export function vscodeInstallLink(server: CatalogServer): string {
  return `vscode://${EXTENSION_ID}/mcp/install?id=${encodeURIComponent(server.id)}`;
}

function shellQuote(a: string): string {
  return /^[A-Za-z0-9@%+=:,./_-]+$/.test(a) ? a : `'${a.replace(/'/g, `'\\''`)}'`;
}

/** terminalCommand is the same server, added from Mochiii's terminal client. */
export function terminalCommand(server: CatalogServer): string {
  const env = server.env.flatMap((e) => ['--env', e.name]);
  const where = server.cwd === 'workspace' ? ['--in-project'] : [];
  return ['/mcp-server', 'add', server.id, ...env, ...where, server.launch.command, ...server.launch.args].map(shellQuote).join(' ');
}

export function commandLine(server: CatalogServer): string {
  return [server.launch.command, ...server.launch.args].map(shellQuote).join(' ');
}

export const RUNTIME: Record<CatalogServer['package']['registry'], string> = {
  npm: 'Node.js (npx)',
  pypi: 'uv (uvx)',
  oci: 'Docker',
};

export function matches(server: CatalogServer, query: string): boolean {
  if (!query) return true;
  const hay = `${server.name} ${server.id} ${server.publisher} ${server.namespace ?? ''} ${server.description} ${server.package.identifier}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}
