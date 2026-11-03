import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, Package, Copy, Check, ExternalLink, KeyRound, Puzzle, Lock } from 'lucide-react';
import {
  type CatalogFile,
  type CatalogServer,
  RUNTIME,
  commandLine,
  loadCatalog,
  matches,
  terminalCommand,
  vscodeInstallLink,
} from '../mcp/catalog';
import '../Marketplace.css';

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
      className="mkt-btn mkt-btn-primary"
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
  return (
    <article className="mkt-card glass-panel">
      <header className="mkt-card-head">
        <div className="mkt-card-title">
          <h3>{server.name}</h3>
          <span className="mkt-publisher">{server.publisher}</span>
        </div>
        <span className="mkt-badge mkt-badge-verified">
          <ShieldCheck size={13} />
          Verified
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

      <footer className="mkt-actions">
        <CopyButton text={terminalCommand(server)} label={`Copy the terminal command that adds ${server.name}`} />
        <a className="mkt-btn mkt-btn-quiet" href={vscodeInstallLink(server)}>
          <Puzzle size={14} />
          <span>Open in VS Code</span>
        </a>
        {(server.homepage ?? server.package.url) && (
          <a className="mkt-link" href={server.homepage ?? server.package.url} target="_blank" rel="noreferrer noopener">
            {server.homepage ? 'Homepage' : 'Package'}
            <ExternalLink size={12} />
          </a>
        )}
      </footer>
    </article>
  );
}

export default function Marketplace() {
  const [catalog, setCatalog] = useState<CatalogFile | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadCatalog().then(setCatalog, (err: Error) => setError(err.message));
  }, []);

  // Only the verified servers are shown here. The community list stays in the
  // catalog's data for the VS Code extension, and this page never fetches it.
  const verified = useMemo(() => (catalog?.servers ?? []).filter((s) => s.tier === 'verified'), [catalog]);
  const categories = useMemo(() => [...new Set(verified.flatMap((s) => s.categories))].sort(), [verified]);

  const results = useMemo(
    () => verified.filter((s) => matches(s, query) && (!category || s.categories.includes(category))),
    [verified, query, category],
  );

  return (
    <div className="mkt-page">
      <section className="mkt-hero">
        <div className="container">
          <h1 className="mkt-title">
            MCP <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="mkt-subtitle">
            Servers you can give Mochiii's agent: search, browsers, databases, clouds and more. Add one from Mochiii's terminal app or from VS Code —
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
            <ShieldCheck size={18} />
            <p>
              <strong>Verified servers.</strong> Each server here is an official one Mochiii chose.
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
        </div>

        {categories.length > 0 && (
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

        {error && <div className="mkt-error">The catalog could not be loaded: {error}</div>}
        {!catalog && !error && <div className="mkt-loading">Loading the catalog…</div>}

        {catalog && (
          <>
            <p className="mkt-count" aria-live="polite">
              {results.length.toLocaleString()} server{results.length === 1 ? '' : 's'}
            </p>
            <div className="mkt-grid">
              {results.map((s) => (
                <ServerCard key={s.id} server={s} />
              ))}
            </div>
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
