import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Zap, ArrowRight } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

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
            <a href="/#features" className="nav-link">Architecture</a>
            <a href="/#pipeline" className="nav-link">5-Gate Pipeline</a>
            <a href="/#demo" className="nav-link">Live Demo</a>
            <Link 
              to="/support" 
              className={`nav-link ${location.pathname === '/support' ? 'active' : ''}`}
            >
              Support
            </Link>
            <a href="https://github.com/Rav-2007/codeterminal-core" target="_blank" rel="noreferrer" className="nav-cta">
              <Zap size={14} />
              <span>GitHub</span>
              <ArrowRight size={14} className="cta-arrow" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="footer container">
        <div className="footer-content">
          <div className="footer-brand">
            <Terminal size={20} className="text-gradient" />
            <span>Mochiii Security-First Agentic Suite</span>
          </div>
          <div className="footer-links">
            <Link to="/support" className="footer-link">Support</Link>
            <a href="https://github.com/Rav-2007/codeterminal-core" target="_blank" rel="noreferrer" className="footer-link">GitHub</a>
          </div>
          <div className="footer-copy">
            © 2026 Mochiii Core Project. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
