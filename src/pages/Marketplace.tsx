import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, Users, Package, Copy, Check, ExternalLink, KeyRound, Puzzle, Lock, TriangleAlert } from 'lucide-react';
import {
  type CatalogFile,
  type CatalogServer,
  type Tier,
  RUNTIME,
  commandLine,
  loadCatalog,
  loadCommunity,
  matches,
  terminalCommand,
  vscodeInstallLink,
} from '../mcp/catalog';
import '../Marketplace.css';

const PAGE = 48;

type TierFilter = Tier | 'all';

const CATEGORY_LABEL: Record<string, string> = {
  'developer-tools': 'Developer tools',
  docs: 'Docs',
  search: 'Search',
  browser: 'Browser',
  data: 'Data',
  cloud: 'Cloud',
  productivity: 'Productivity',
  communication: 'Communication',
  observability: 'Observability',
  security: 'Security',
  ai: 'AI',
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="mkt-btn mkt-btn-ghost"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      aria-label={label}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? 'Copied' : 'Terminal'}</span>
    </button>
  );
}

function ServerCard({ server }: { server: CatalogServer }) {
  const verified = server.tier === 'verified';
  return (
    <article className="mkt-card glass-panel">
      <header className="mkt-card-head">
        <div className="mkt-card-title">
          <h3>{server.name}</h3>
          <span className="mkt-publisher">{server.publisher}</span>
        </div>
        <span className={`mkt-badge ${verified ? 'mkt-badge-verified' : 'mkt-badge-community'}`}>
          {verified ? <ShieldCheck size={13} /> : <Users size={13} />}
          {verified ? 'Verified' : 'Community'}
        </span>
      </header>

      <p className="mkt-desc">{server.description}</p>

      {server.categories.length > 0 && (
        <div className="mkt-tags">
          {server.categories.map((c) => (
            <span key={c} className="mkt-tag">
              {CATEGORY_LABEL[c] ?? c}
            </span>
          ))}
        </div>
      )}

      <div className="mkt-meta">
        <span>
          <Package size={13} /> {server.package.registry} · {server.package.identifier} {server.package.version}
        </span>
        <span>Needs {RUNTIME[server.package.registry]}</span>
      </div>

      {server.env.length > 0 && (
        <ul className="mkt-env" aria-label="Variables it reads">
          {server.env.map((e) => (
            <li key={e.name} title={e.description ?? ''}>
              {e.secret ? <KeyRound size={12} /> : null}
              <code>{e.name}</code>
              {e.required ? <span className="mkt-env-req">required</span> : null}
            </li>
          ))}
        </ul>
      )}

      <code className="mkt-cmd" title="Exactly what runs">
        {commandLine(server)}
      </code>

      {!verified && server.namespace && (
        <p className="mkt-provenance">
          From the official MCP Registry as <code>{server.namespace}</code>. Not reviewed by Mochiii.
        </p>
      )}

      <footer className="mkt-actions">
        <a className="mkt-btn mkt-btn-primary" href={vscodeInstallLink(server)}>
          <Puzzle size={14} />
          <span>Open in VS Code</span>
        </a>
        <CopyButton text={terminalCommand(server)} label={`Copy the terminal command that adds ${server.name}`} />
        {(server.homepage ?? server.package.url) && (
          <a className="mkt-btn mkt-btn-ghost" href={server.homepage ?? server.package.url} target="_blank" rel="noreferrer noopener">
            <ExternalLink size={14} />
            <span>{server.homepage ? 'Homepage' : 'Package'}</span>
          </a>
        )}
      </footer>
    </article>
  );
}

export default function Marketplace() {
  const [catalog, setCatalog] = useState<CatalogFile | null>(null);
  const [community, setCommunity] = useState<CatalogServer[] | null>(null);
  const [error, setError] = useState('');
  const [communityError, setCommunityError] = useState('');
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<TierFilter>('verified');
  const [category, setCategory] = useState('');
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    loadCatalog().then(setCatalog, (err: Error) => setError(err.message));
  }, []);

  // The community tier is thousands of entries: fetched only when asked for.
  const wantCommunity = tier !== 'verified';
  useEffect(() => {
    if (!wantCommunity || !catalog || community || communityError) return;
    loadCommunity(catalog).then(
      (doc) => setCommunity(doc.servers),
      (err: Error) => setCommunityError(err.message),
    );
  }, [wantCommunity, catalog, community, communityError]);

  useEffect(() => setShown(PAGE), [query, tier, category]);

  const verified = useMemo(() => catalog?.servers ?? [], [catalog]);
  const categories = useMemo(() => [...new Set(verified.flatMap((s) => s.categories))].sort(), [verified]);

  const results = useMemo(() => {
    const pool = tier === 'verified' ? verified : tier === 'community' ? community ?? [] : [...verified, ...(community ?? [])];
    return pool.filter((s) => matches(s, query) && (!category || s.categories.includes(category)));
  }, [tier, verified, community, query, category]);

  const communityCount = catalog?.community?.count ?? 0;
  const loadingCommunity = wantCommunity && !community && !communityError;

  return (
    <div className="mkt-page">
      <section className="mkt-hero">
        <div className="container">
          <h1 className="mkt-title">
            MCP <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="mkt-subtitle">
            Servers you can give Mochiii's agent: search, browsers, databases, clouds and more. Add one from VS Code in a click —
            Mochiii shows you exactly what will run and asks you to type its name before anything is added.
          </p>
        </div>
      </section>

      <div className="container mkt-body">
        <div className="mkt-safety">
          <div>
            <Lock size={18} />
            <p>
              <strong>Runs with your privileges.</strong> An MCP server is an ordinary program on your machine. Mochiii cannot
              confine it — so it asks you first.
            </p>
          </div>
          <div>
            <ShieldCheck size={18} />
            <p>
              <strong>Every tool call asks.</strong> Each tool a server offers waits for your yes, and every call is in the audit
              log.
            </p>
          </div>
          <div>
            <TriangleAlert size={18} />
            <p>
              <strong>Verified vs. Community.</strong> Verified servers are official ones Mochiii chose. Community servers come from
              the official MCP Registry and are not reviewed.
            </p>
          </div>
        </div>

        <div className="mkt-controls">
          <label className="mkt-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search servers, publishers, packages…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search MCP servers"
            />
          </label>
          <div className="mkt-tabs" role="tablist" aria-label="Which servers">
            {(
              [
                ['verified', `Verified (${verified.length})`],
                ['community', `Community (${communityCount.toLocaleString()})`],
                ['all', 'All'],
              ] as [TierFilter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tier === value}
                className={`mkt-tab ${tier === value ? 'active' : ''}`}
                onClick={() => setTier(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {tier !== 'community' && categories.length > 0 && (
          <div className="mkt-cats">
            <button type="button" className={`mkt-cat ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>
              All categories
            </button>
            {categories.map((c) => (
              <button key={c} type="button" className={`mkt-cat ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                {CATEGORY_LABEL[c] ?? c}
              </button>
            ))}
          </div>
        )}

        {tier !== 'verified' && (
          <p className="mkt-note">
            Community servers are imported automatically from the official MCP Registry, whose publishers verified their names — but
            nobody at Mochiii has read their code. Check the package before you add one.
          </p>
        )}

        {error && <div className="mkt-error">The catalog could not be loaded: {error}</div>}
        {communityError && <div className="mkt-error">The community list could not be loaded: {communityError}</div>}
        {!catalog && !error && <div className="mkt-loading">Loading the catalog…</div>}
        {loadingCommunity && <div className="mkt-loading">Loading {communityCount.toLocaleString()} community servers…</div>}

        {catalog && !loadingCommunity && (
          <>
            <p className="mkt-count" aria-live="polite">
              {results.length.toLocaleString()} server{results.length === 1 ? '' : 's'}
            </p>
            <div className="mkt-grid">
              {results.slice(0, shown).map((s) => (
                <ServerCard key={s.id} server={s} />
              ))}
            </div>
            {results.length > shown && (
              <div className="mkt-more">
                <button type="button" className="btn btn-secondary" onClick={() => setShown((n) => n + PAGE)}>
                  Show more ({(results.length - shown).toLocaleString()} left)
                </button>
              </div>
            )}
          </>
        )}

        {catalog && (
          <p className="mkt-footer-note">
            Catalog generated {new Date(catalog.generatedAt).toLocaleDateString()} ·{' '}
            <a className="inline-link" href="/api/mcp/v1/catalog.json">
              catalog.json
            </a>{' '}
            ·{' '}
            <a className="inline-link" href="/api/mcp/v1/catalog.schema.json">
              schema
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
