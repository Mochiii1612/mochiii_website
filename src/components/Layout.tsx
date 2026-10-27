import { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, ArrowRight } from 'lucide-react';
import { REPO_URL } from '../site.config';
import Waitlist from './Waitlist';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

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

  return (
    <div className="app-container">
      {/* Background & single hero glow */}
      <div className="grid-background" />
      <div className="glow-orb hero-orb" />

      {/* Navigation */}
      <nav className="nav-float">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <div className="brand-icon">
              <Terminal size={18} />
            </div>
            <span className="brand-name">Mochiii</span>
          </Link>
          <div className="nav-links">
            <Link to="/#features" className="nav-link">Features</Link>
            <Link to="/#edits" className="nav-link">Edits</Link>
            <Link to="/#models" className="nav-link">Models</Link>
            <Link
              to="/mcp"
              className={`nav-link ${location.pathname === '/mcp' ? 'active' : ''}`}
            >
              MCP Marketplace
            </Link>
            <Link
              to="/support"
              className={`nav-link ${location.pathname === '/support' ? 'active' : ''}`}
            >
              Support
            </Link>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="nav-link">GitHub</a>
            <Link to="/#install" className="nav-cta">
              <span>Install</span>
              <ArrowRight size={14} className="cta-arrow" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      <Waitlist />

      {/* Footer */}
      <footer className="footer container">
        <div className="footer-content">
          <div className="footer-brand">
            <Terminal size={20} className="text-gradient" />
            <span>Mochiii: an AI coding agent that knows your codebase</span>
          </div>
          <div className="footer-links">
            <Link to="/#install" className="footer-link">Install</Link>
            <Link to="/mcp" className="footer-link">MCP Marketplace</Link>
            <Link to="/support" className="footer-link">Support</Link>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
          </div>
          <div className="footer-copy">
            © 2026 Mochiii Core Project. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
