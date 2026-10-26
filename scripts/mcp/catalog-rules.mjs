// The rules every entry in the MCP catalog must meet, in one place.
//
// The catalog at /api/mcp/v1/catalog.json is read by the Mochiii VS Code
// extension's marketplace and by this site's /mcp page. An entry names a
// program that a user's Mochiii daemon will run with their full privileges once
// they acknowledge it, so these rules mirror the daemon's own
// (codeterminal-core: daemon/mcpuser.go validateUserServer, daemon/mcp/mcp.go
// ValidateServerName and ForbiddenEnvNames). An entry the daemon would refuse is
// refused here first, so the marketplace never offers an install that cannot
// succeed.
//
// The extension validates the catalog again when it fetches it: this file keeps
// the site honest, it does not make the feed trusted.

export const SCHEMA_VERSION = 1;

export const TIERS = ['verified', 'community'];

// The launchers a catalog entry may name. A catalog that could name any program
// would be a way to run anything; these three resolve a published, versioned
// package and nothing else.
export const LAUNCHERS = {
  npm: 'npx',
  pypi: 'uvx',
  oci: 'docker',
};

export const CATEGORIES = [
  'developer-tools',
  'docs',
  'search',
  'browser',
  'data',
  'cloud',
  'productivity',
  'communication',
  'observability',
  'security',
  'ai',
];

// daemon/mcp/mcp.go ForbiddenEnvNames: Mochiii's own inference credentials are
// never passed to a server, whatever a config asks.
export const FORBIDDEN_ENV_NAMES = ['OPENROUTER_API_KEY', 'MOCHIII_API_KEY', 'MOCHIII_PROXY_KEY'];

const MAX_ID = 32; // daemon/mcpuser.go maxUserServerName
const MAX_NAME = 80;
const MAX_DESCRIPTION = 400;
const MAX_PUBLISHER = 80;
const MAX_ARGS = 32;
const MAX_ARG = 512;
const MAX_ENV = 24;
const MAX_ENV_NAME = 128; // clients/vscode/src/mcpCatalog.ts validEnvName, daemon mcpEnvNamePattern
const MAX_CATEGORIES = 10; // clients/vscode/src/mcpCatalog.ts checkServer

// C0/C1 controls, and the bidi overrides and isolates that let text display in
// an order other than the one it is stored in. Either can make a description
// say something other than what it holds.
// oxlint-disable-next-line no-control-regex -- matching control characters is the point: to refuse them
const UNSAFE_TEXT = /[\u0000-\u001f\u007f-\u009f‎‏‪-‮⁦-⁩]/;

export function isSafeText(s) {
  return typeof s === 'string' && !UNSAFE_TEXT.test(s);
}

// cleanText makes registry-supplied prose safe to show: unsafe characters out,
// whitespace runs collapsed. Used when importing, never to excuse an entry the
// validator would refuse.
export function cleanText(s) {
  if (typeof s !== 'string') return '';
  return s.replace(new RegExp(UNSAFE_TEXT.source, 'g'), ' ').replace(/\s+/g, ' ').trim();
}

// daemon/mcpuser.go validateUserServerName, plus mcp.ValidateServerName.
export function validServerId(id) {
  return (
    typeof id === 'string' &&
    id.length > 0 &&
    id.length <= MAX_ID &&
    /^[a-z0-9][a-z0-9_-]*$/.test(id) &&
    !id.includes('__') &&
    id !== 'builtin'
  );
}

export function validEnvName(name) {
  return (
    typeof name === 'string' &&
    name.length <= MAX_ENV_NAME &&
    /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) &&
    !FORBIDDEN_ENV_NAMES.some((f) => f.toLowerCase() === name.toLowerCase()) &&
    !looksLikeKey(name)
  );
}

// looksLikeKey is daemon/mcpenv.go envNameLooksLikeKey: a "name" that is more
// likely a pasted key. The daemon refuses it at add, so an entry carrying one
// would be a card whose Add always fails.
export function looksLikeKey(name) {
  if (/^(sbp_|gh[pousr]_|github_pat_|glpat_|sk_live_|sk_test_|rk_live_|pk_live_|AKIA[0-9A-Z]{12})/.test(name)) return true;
  return (name.match(/[A-Za-z0-9]{16,}/g) ?? []).some((run) => /[0-9]/.test(run) && /[A-Za-z]/.test(run));
}

// templateVars is daemon/mcpexpand.go templateVars: the ${VAR} (or
// ${VAR:-default}) references in an argument, which the daemon expands.
export function templateVars(text) {
  return [...text.matchAll(/\$\{([A-Za-z_][A-Za-z0-9_]*)(:-([^}]*))?\}/g)].map((m) => m[1]);
}

// An exact version: no range, no tag. "latest" would let whoever publishes the
// package next decide what this entry runs.
export function exactVersion(v) {
  return typeof v === 'string' && /^[0-9A-Za-z][0-9A-Za-z.+_-]*$/.test(v) && v.toLowerCase() !== 'latest' && v.length <= 64;
}

function httpsUrl(u) {
  try {
    return new URL(u).protocol === 'https:';
  } catch {
    return false;
  }
}

// expectedLaunch is the one command line an entry's package may produce. The
// catalog states it explicitly (so a reader sees exactly what runs), and this
// checks the statement against the package rather than trusting it.
export function expectedLaunch(pkg, env) {
  const { registry, identifier, version } = pkg;
  switch (registry) {
    case 'npm':
      return { command: 'npx', args: ['-y', `${identifier}@${version}`] };
    case 'pypi':
      return { command: 'uvx', args: [`${identifier}@${version}`] };
    case 'oci': {
      const image = ociImage(identifier, version);
      const flags = env.flatMap((e) => ['-e', e.name]);
      return { command: 'docker', args: ['run', '-i', '--rm', ...flags, image] };
    }
  }
  return null;
}

// ociImage pins an image to its version unless the identifier already carries
// a tag or digest.
export function ociImage(identifier, version) {
  const lastSegment = identifier.split('/').pop() ?? '';
  return lastSegment.includes(':') || identifier.includes('@') ? identifier : `${identifier}:${version}`;
}

// validateServer returns the list of reasons an entry is not acceptable; empty
// means it is. extraArgs lets an entry carry fixed arguments after the package
// (e.g. a positional mode flag a registry entry declares).
export function validateServer(s) {
  const errs = [];
  const at = (m) => errs.push(`${s?.id ?? '(no id)'}: ${m}`);
  if (!s || typeof s !== 'object') return ['an entry is not an object'];

  if (!validServerId(s.id)) at(`id must be 1-${MAX_ID} of a-z 0-9 - _, start with a letter or digit, no "__", not "builtin"`);
  if (!isSafeText(s.name) || !s.name || s.name.length > MAX_NAME) at(`name must be 1-${MAX_NAME} plain characters`);
  if (!isSafeText(s.description) || !s.description || s.description.length > MAX_DESCRIPTION)
    at(`description must be 1-${MAX_DESCRIPTION} plain characters`);
  if (!isSafeText(s.publisher) || !s.publisher || s.publisher.length > MAX_PUBLISHER)
    at(`publisher must be 1-${MAX_PUBLISHER} plain characters`);
  if (s.namespace !== undefined && (!isSafeText(s.namespace) || !s.namespace || s.namespace.length > 200))
    at('namespace must be 1-200 plain characters');
  if (!TIERS.includes(s.tier)) at(`tier must be one of ${TIERS.join(', ')}`);
  if (!Array.isArray(s.categories) || s.categories.length > MAX_CATEGORIES || s.categories.some((c) => !CATEGORIES.includes(c)))
    at(`categories must be at most ${MAX_CATEGORIES}, from: ${CATEGORIES.join(', ')}`);
  if (s.homepage !== undefined && !httpsUrl(s.homepage)) at('homepage must be an https URL');

  const pkg = s.package;
  if (!pkg || !LAUNCHERS[pkg.registry]) {
    at(`package.registry must be one of ${Object.keys(LAUNCHERS).join(', ')}`);
    return errs;
  }
  if (typeof pkg.identifier !== 'string' || !/^[A-Za-z0-9@][A-Za-z0-9@/._:+-]*$/.test(pkg.identifier) || pkg.identifier.length > 200)
    at('package.identifier is not a package name');
  if (!exactVersion(pkg.version)) at('package.version must be an exact version, not a range or "latest"');
  if (pkg.url !== undefined && !httpsUrl(pkg.url)) at('package.url must be an https URL');

  const env = s.env;
  if (!Array.isArray(env) || env.length > MAX_ENV) {
    at(`env must be a list of at most ${MAX_ENV}`);
  } else {
    const seen = new Set();
    for (const e of env) {
      if (!e || !validEnvName(e.name)) at(`env name ${JSON.stringify(e?.name)} is not a variable name Mochiii will pass`);
      else if (seen.has(e.name)) at(`env name ${e.name} is listed twice`);
      else seen.add(e.name);
      if (typeof e?.required !== 'boolean' || typeof e?.secret !== 'boolean') at(`env ${e?.name}: required and secret must be booleans`);
      if (e?.description !== undefined && (!isSafeText(e.description) || !e.description || e.description.length > 300))
        at(`env ${e?.name}: description is not plain text`);
      if ('value' in (e ?? {})) at(`env ${e?.name}: a catalog never carries a value, only a name`);
    }
  }

  const launch = s.launch;
  if (!launch || launch.command !== LAUNCHERS[pkg.registry] || !Array.isArray(launch.args)) {
    at(`launch.command must be ${LAUNCHERS[pkg.registry]} for a ${pkg.registry} package`);
  } else {
    if (launch.args.length > MAX_ARGS) at(`launch has more than ${MAX_ARGS} arguments`);
    for (const a of launch.args) {
      // oxlint-disable-next-line no-control-regex -- a NUL or newline in an argument is refused, not matched by accident
      if (typeof a !== 'string' || !a || a.length > MAX_ARG || /[\u0000\n\r]/.test(a)) at('launch has an argument no program takes');
      // daemon/mcpexpand.go validateTemplates: ${OPENROUTER_API_KEY} in an
      // argument would hand the server Mochiii's own credential; refused at add.
      else if (templateVars(a).some((v) => FORBIDDEN_ENV_NAMES.some((f) => f.toLowerCase() === v.toLowerCase())))
        at('launch names one of Mochiii\'s own credentials in a ${...} template');
    }
    const want = Array.isArray(env) ? expectedLaunch(pkg, env) : null;
    if (want) {
      const prefix = launch.args.slice(0, want.args.length);
      if (JSON.stringify(prefix) !== JSON.stringify(want.args))
        at(`launch must start ${want.command} ${want.args.join(' ')} -- what the package names, pinned`);
    }
  }
  if (s.cwd !== undefined && s.cwd !== 'workspace') at('cwd is either absent (a private folder) or "workspace"');
  return errs;
}

// THE CATALOG IS TWO FILES. catalog.json holds the verified tier -- what the
// marketplace opens on -- and a pointer to community.json, the thousands of
// unreviewed registry imports, which a client fetches only when someone asks to
// see them. Opening the marketplace costs kilobytes, not megabytes.
export const COMMUNITY_FILE = 'community.json';

// validateCatalog checks one file: shape, every entry, its tier, unique ids.
// taken carries ids across the two files, which share one namespace.
export function validateCatalog(doc, { tier = 'verified', taken = new Set() } = {}) {
  const errs = [];
  if (!doc || doc.schemaVersion !== SCHEMA_VERSION) return [`schemaVersion must be ${SCHEMA_VERSION}`];
  if (typeof doc.generatedAt !== 'string' || Number.isNaN(Date.parse(doc.generatedAt))) errs.push('generatedAt is not a date');
  if (!Array.isArray(doc.servers)) return [...errs, 'servers is not a list'];
  if (tier === 'verified') {
    const c = doc.community;
    if (c !== undefined && (c.path !== COMMUNITY_FILE || !Number.isInteger(c.count) || c.count < 0))
      errs.push(`community must be { path: "${COMMUNITY_FILE}", count: <n> }`);
  }
  for (const s of doc.servers) {
    errs.push(...validateServer(s));
    if (s?.tier !== tier) errs.push(`${s?.id}: a ${s?.tier} entry in the ${tier} file`);
    if (taken.has(s?.id)) errs.push(`${s.id}: id is used twice`);
    taken.add(s?.id);
  }
  return errs;
}
