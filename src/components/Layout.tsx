import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import InstallMenu from './InstallMenu';
import { INSTALL_ITEMS } from '../installItems';
import SocialLinks from './SocialLinks';
import { DOCS_URL } from '../site.config';
import { usePageMeta } from '../pageMeta';
import lotusMark from '../assets/lotus-mark.png';

interface LayoutProps {
  children: ReactNode;
}

/** The top navigation, in order. Docs is another site, opened in this tab. */
const NAV: ReadonlyArray<{ label: string; to?: string; href?: string }> = [
  { label: 'Product', to: '/' },
  { label: 'MCP Marketplace', to: '/mcp' },
  { label: 'Docs', href: DOCS_URL },
  { label: 'FAQ', to: '/faq' },
  { label: 'Support', to: '/support' },
];

function Brand() {
  return (
    <Link to="/" className="nav-brand" aria-label="Mochiii (beta), home">
      <img src={lotusMark} alt="" width={32} height={32} className="brand-mark" />
      <span className="brand-name">Mochiii</span>
      <span className="beta-pill">Beta</span>
    </Link>
  );
}

function NavItems({ className }: { className: string }) {
  return (
    <>
      {NAV.map((item) =>
        item.href ? (
          <a key={item.label} href={item.href} className={className}>
            {item.label}
          </a>
        ) : (
          <NavLink key={item.label} to={item.to!} end className={({ isActive }) => `${className}${isActive ? ' active' : ''}`}>
            {item.label}
          </NavLink>
        ),
      )}
    </>
  );
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [panelOpen, setPanelOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  usePageMeta();

  // In-page links like /#install need a scroll after the route renders, including
  // when arriving from another route (the browser's own hash scroll runs before
  // React has mounted the target).
  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  // The phone menu closes on a new page, on Escape, and on a tap outside the bar.
  useEffect(() => setPanelOpen(false), [location.pathname, location.hash]);
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanelOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setPanelOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [panelOpen]);

  return (
    <div className="app-container">
      {/* Background & single hero glow */}
      <div className="grid-background" />
      <div className="glow-orb hero-orb" />

      <nav className="nav-float" ref={barRef} aria-label="Main">
        <div className="nav-inner">
          <Brand />

          {/* Wide screens: the links and the Install menu */}
          <div className="nav-links">
            <NavItems className="nav-link" />
            <InstallMenu />
          </div>

          {/* Phones: Install and a menu button, on the same line as the logo */}
          <div className="nav-phone">
            <Link to="/#install" className="nav-cta nav-cta-phone">
              Install
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="nav-menu-btn"
              aria-expanded={panelOpen}
              aria-controls="nav-panel"
              aria-label={panelOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setPanelOpen((o) => !o)}
            >
              {panelOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {panelOpen && (
          <div id="nav-panel" className="nav-panel">
            <NavItems className="nav-panel-link" />
            <div className="nav-panel-install">
              <span className="nav-panel-heading">Install</span>
              {INSTALL_ITEMS.map((item) =>
                'href' in item ? (
                  <a key={item.key} href={item.href} className="nav-panel-link">
                    {item.label} <span className="nav-panel-detail">{item.detail}</span>
                  </a>
                ) : (
                  <Link key={item.key} to={item.to} className="nav-panel-link">
                    {item.label} <span className="nav-panel-detail">{item.detail}</span>
                  </Link>
                ),
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      {children}

      <footer className="footer container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={lotusMark} alt="" width={22} height={22} />
            <span>Mochiii: an AI coding agent that knows your codebase</span>
          </div>
          <div className="footer-links">
            <Link to="/#install" className="footer-link">Install</Link>
            <Link to="/mcp" className="footer-link">MCP Marketplace</Link>
            <a href={DOCS_URL} className="footer-link">Docs</a>
            <Link to="/faq" className="footer-link">FAQ</Link>
            <Link to="/support" className="footer-link">Support</Link>
          </div>
          <div className="footer-end">
            <SocialLinks />
            <div className="footer-copy">© 2026 Mochiii</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
