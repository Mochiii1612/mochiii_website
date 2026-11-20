import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Search, ShieldCheck, Package, Copy, Check, ExternalLink, KeyRound, Puzzle, Lock, X } from 'lucide-react';
import {
  type CatalogFile,
  type CatalogServer,
  RUNTIME,
  loadCatalog,
  matches,
  terminalCommand,
  vscodeInstallLink,
} from '../mcp/catalog';
import { logoFor } from '../mcp/logos';
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
      <span>{copied ? 'Copied' : 'Copy for terminal'}</span>
    </button>
  );
}

function LogoTile({ server, size }: { server: CatalogServer; size: 'card' | 'dialog' }) {
  const src = logoFor(server.id);
  const [failed, setFailed] = useState(false);
  return (
    <span className={`mkt-logo mkt-logo-${size}`} aria-hidden="true">
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="mkt-logo-letter">{server.name.charAt(0)}</span>
      )}
    </span>
  );
}

function ServerCard({ server, onOpen }: { server: CatalogServer; onOpen: (el: HTMLButtonElement) => void }) {
  return (
    <button
      type="button"
      className="mkt-card glass-panel"
      aria-haspopup="dialog"
      onClick={(e) => onOpen(e.currentTarget)}
    >
      <span className="mkt-card-head">
        <LogoTile server={server} size="card" />
        <span className="mkt-card-title">
          <span className="mkt-card-name">
            {server.name}
            <ShieldCheck size={15} className="mkt-card-check" aria-label="Verified" />
          </span>
          <span className="mkt-publisher">{server.publisher}</span>
        </span>
      </span>

      <span className="mkt-desc mkt-desc-clamp">{server.description}</span>

      {server.categories.length > 0 && (
        <span className="mkt-tags">
          {server.categories.map((c) => (
            <span key={c} className="mkt-tag">
              {CATEGORY_LABEL[c] ?? c}
            </span>
          ))}
        </span>
      )}
    </button>
  );
}

/**
 * A container image is pinned by digest (`name@sha256:…`). The dialog shows the
 * name and version, and keeps the digest behind "Details".
 */
function splitDigest(identifier: string): { name: string; digest: string | null } {
  const at = identifier.indexOf('@sha256:');
  return at < 0 ? { name: identifier, digest: null } : { name: identifier.slice(0, at), digest: identifier.slice(at + 1) };
}

/** The site links to no github.com page, so a server whose homepage is on GitHub links to its package page instead, or to nothing. */
function isGitHub(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return host === 'github.com' || host.endsWith('.github.com');
  } catch {
    return false;
  }
}

function outsideLink(server: CatalogServer): { url: string; label: string } | null {
  if (server.homepage && !isGitHub(server.homepage)) return { url: server.homepage, label: 'Homepage' };
  if (server.package.url && !isGitHub(server.package.url)) return { url: server.package.url, label: 'Package' };
  return null;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

function ServerDialog({ server, onClose }: { server: CatalogServer; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `mkt-dialog-title-${server.id}`;
  const cmdId = `mkt-dialog-cmd-${server.id}`;
  const pkg = splitDigest(server.package.identifier);
  const outLink = outsideLink(server);

  // The page behind does not scroll while the dialog is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !panelRef.current) return;
    // Focus stays inside the dialog.
    const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      className="mkt-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="mkt-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
      >
        <button ref={closeRef} type="button" className="mkt-modal-close" aria-label="Close" onClick={onClose}>
          <X size={18} />
        </button>

        <header className="mkt-modal-head">
          <LogoTile server={server} size="dialog" />
          <div className="mkt-card-title">
            <h2 id={titleId}>{server.name}</h2>
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
            <Package size={13} /> {server.package.registry} · {pkg.name} {server.package.version}
          </span>
          <span>Needs {RUNTIME[server.package.registry]}</span>
        </div>
        {pkg.digest && (
          <details className="mkt-details">
            <summary>Details</summary>
            <p>Image digest</p>
            <code className="mkt-digest">{pkg.digest}</code>
          </details>
        )}

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

        <div className="mkt-cmd-block">
          <span className="mkt-cmd-label" id={cmdId}>
            Paste into Mochiii's terminal app
          </span>
          <code className="mkt-cmd" aria-labelledby={cmdId} tabIndex={0}>
            {terminalCommand(server)}
          </code>
        </div>

        <footer className="mkt-actions">
          <CopyButton text={terminalCommand(server)} label={`Copy the terminal command that adds ${server.name}`} />
          <a className="mkt-btn mkt-btn-quiet mkt-vscode-btn" href={vscodeInstallLink(server)}>
            <Puzzle size={14} />
            <span>Open in VS Code</span>
          </a>
          {outLink && (
            <a className="mkt-link" href={outLink.url} target="_blank" rel="noreferrer noopener">
              {outLink.label}
              <ExternalLink size={12} />
            </a>
          )}
        </footer>
      </div>
    </div>,
    document.body,
  );
}

export default function Marketplace() {
  const [catalog, setCatalog] = useState<CatalogFile | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<CatalogServer | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeDialog = () => {
    setSelected(null);
    // Focus goes back to the card that opened the dialog.
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

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
            Servers you can give Mochiii's agent. Mochiii shows you what will run, and you type the server's name before
            anything is added.
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
              <strong>Verified servers.</strong> Each server here has been started and its tools checked with Mochiii.
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
                <ServerCard
                  key={s.id}
                  server={s}
                  onOpen={(el) => {
                    triggerRef.current = el;
                    setSelected(s);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {selected && <ServerDialog server={selected} onClose={closeDialog} />}

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
            <br />
            Logos are trademarks of their owners. Git logo by Jason Long, CC BY 3.0. Angular logo by the
            Angular team at Google,{' '}
            <a className="inline-link" href="https://creativecommons.org/licenses/by/4.0/" rel="noreferrer">
              CC BY 4.0
            </a>
            , unmodified. Logos only identify each server; no partnership or endorsement is implied.
          </p>
        )}
      </div>
    </div>
  );
}
