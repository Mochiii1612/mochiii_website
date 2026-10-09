import { useState, type ReactNode } from 'react';
import {
  ShieldCheck,
  Terminal,
  Lock,
  ChevronRight,
  CheckCircle,
  FileCode,
  Eye,
  Save,
  Copy,
  Check,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import './App.css';
import './engine.css';
import './architecture.css';
import './motion.css';
import { useReveal } from './hooks';

/** Drop-in `<div>` replacement that fades/slides into view on scroll. */
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal${isVisible ? ' reveal-visible' : ''}${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

type DemoTab = 'ask' | 'ground' | 'propose' | 'confirm';

const demoTabs: { id: DemoTab; label: string }[] = [
  { id: 'ask', label: 'Ask' },
  { id: 'ground', label: 'Ground' },
  { id: 'propose', label: 'Propose' },
  { id: 'confirm', label: 'Confirm' }
];

function App() {
  const [copied, setCopied] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState<DemoTab>('ask');
  const activeIndex = demoTabs.findIndex((t) => t.id === activeDemoTab);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('code --install-extension codeterminal-vscode-0.0.1.vsix');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pipelineSteps = [
    { id: 'path', label: 'Path Safety', desc: 'Refuses out-of-workspace escapes & secret files', icon: <Lock size={22} /> },
    { id: 'match', label: 'Exact Match', desc: 'Fails on ambiguous or missing SEARCH text', icon: <Eye size={22} /> },
    { id: 'syntax', label: 'Syntax Check', desc: 'Ensures edits parse cleanly post-edit', icon: <FileCode size={22} /> },
    { id: 'confirm', label: 'Human Confirm', desc: 'Requires explicit confirmation for every change', icon: <CheckCircle size={22} /> },
    { id: 'backup', label: 'Pre-Edit Backup', desc: 'Snapshots every file locally before it touches it, so any change is instantly reversible', icon: <Save size={22} /> }
  ];

  return (
    <div className="app-container">
      {/* Background & single hero glow */}
      <div className="grid-background" />
      <div className="glow-orb hero-orb" />

      {/* Navigation */}
      <nav className="nav-float">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="brand-icon">
              <Terminal size={18} />
            </div>
            <span className="brand-name">Mochiii</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Architecture</a>
            <a href="#pipeline" className="nav-link">5-Gate Pipeline</a>
            <a href="#demo" className="nav-link">Live Demo</a>
            <a href="https://github.com/Rav-2007/codeterminal-core" target="_blank" rel="noreferrer" className="nav-cta">
              <Zap size={14} />
              <span>GitHub</span>
              <ArrowRight size={14} className="cta-arrow" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero — two-column: copy left, 3D lotus splat right */}
      <header className="hero container">
        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-badge animate-fade">
              <Sparkles size={14} />
              <span>Zero Data Retention • Local Indexing • 5-Gate Confinement</span>
            </div>

            <h1 className="hero-title">
              The AI coding agent<br />
              <span className="text-gradient">that never uploads your code.</span>
            </h1>

            <p className="hero-sub">
              Mochiii indexes your codebase entirely on-device and routes every prompt through
              Zero Data Retention. Every AI-proposed edit passes five safety gates before it
              touches a single file.
            </p>

            <div className="install-box">
              <div className="install-box-label">
                <Terminal size={13} /> Install once, run anywhere
              </div>
              <div className="install-box-terminal">
                <code>$ code --install-extension codeterminal-vscode-0.0.1.vsix</code>
                <button className="install-box-copy" onClick={copyInstallCommand} aria-label="Copy install command">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
              <div className="install-box-footer">
                <span>Works on macOS, Windows, Linux.</span>
                <a href="https://github.com/Rav-2007/codeterminal-core" target="_blank" rel="noreferrer">
                  View source <ChevronRight size={13} />
                </a>
              </div>
            </div>
          </div>

          {/* Staged 3D Gaussian Splat Viewer — the hero's dramatic visual, right side */}
          <div className="hero-stage">
            <div className="hero-stage-glow" aria-hidden="true" />
            <div className="splat-container">
              <iframe
                src="/spz-viewer/index.html"
                title="3D Splat Viewer"
                className="splat-iframe"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Demo — click-driven tabs */}
      <section id="demo" className="demo-section container">
        <Reveal className="section-header">
          <h2>Interactive Experience</h2>
          <p className="text-secondary">Watch Mochiii inspect code, enforce safety gates, and present native diffs.</p>
        </Reveal>

        <Reveal>
          <div className="demo-tabs" role="tablist" aria-label="Interactive demo steps">
            {demoTabs.map((tab, idx) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeDemoTab === tab.id}
                className={`demo-tab ${activeDemoTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveDemoTab(tab.id)}
              >
                <span className="demo-tab-num">{String(idx + 1).padStart(2, '0')}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="interactive-window modern-dark-ide">
            <div className="window-header dark-header">
              <div className="window-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="window-title">VS Code · Mochiii Extension</div>
              <div className="window-status dark-status">
                <Zap size={13} className="status-icon" />
                <span>Grounded · 12 Chunks</span>
              </div>
            </div>

            <div className="window-body dark-body">
              <div className="chat-bubble user-bubble dark-user-bubble">
                <div className="bubble-content">
                  <span className="prompt-slash">/refactor</span> Optimize vector database lookup for hybrid search
                </div>
              </div>

              {activeIndex >= 1 && (
                <div className="chat-bubble assistant-bubble dark-assistant-bubble animate-slide-up">
                  <div className="bubble-role">
                    <Terminal size={14} /> Mochiii Assistant
                  </div>
                  <div className="bubble-content">
                    <p className="thinking-text">Analyzing local codebase index... Grounded in <code>daemon/rerank.go</code></p>

                    {activeIndex >= 2 && (
                      <div className="code-box dark-code-box animate-slide-up">
                        <div className="code-header dark-code-header">
                          <span>daemon/rerank.go</span>
                          <span className="code-action">Proposed Edit</span>
                        </div>
                        <pre>
                          <code>
                            <span className="code-comment">{'// + RRF-fused FTS5 & semantic search query'}</span><br/>
                            <span className="code-deleted">{'- res, err := fts.Query("SELECT * FROM chunks WHERE text LIKE ?", query)'}</span><br/>
                            <span className="code-added">{'+ res, err := fts.Query("SELECT snippet(chunks, 0, \'[\', \']\', \'...\', 64) FROM fts_chunks WHERE chunks MATCH ?", query)'}</span>
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {activeIndex >= 3 && (
                    <div className="native-diff-preview dark-diff-preview animate-slide-up">
                      <div className="diff-status">
                        <ShieldCheck size={18} className="text-success" />
                        <span>5-Gate Safety Check Passed</span>
                      </div>
                      <button className="diff-btn pulse-btn">Review Native Diff</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Features — borderless list, deliberately not another card grid */}
      <section id="features" className="features-section container">
        <Reveal className="section-header">
          <span className="section-eyebrow">Security Model</span>
          <h2>Engineered for Security & Speed</h2>
          <p className="text-secondary">Designed for regulated industries and zero-trust engineering environments.</p>
        </Reveal>

        <Reveal className="features-list">
          <div className="feature-row">
            <div className="feature-row-heading">
              <span className="feature-dot" aria-hidden="true" />
              <h3>Hybrid On-Device Indexing</h3>
            </div>
            <p>Retrieval powered by on-device ONNX embeddings (BGE-small, 384d) and SQLite FTS5. Ranked via Reciprocal Rank Fusion (RRF). Your source code never leaves your local hardware.</p>
          </div>

          <div className="feature-row">
            <div className="feature-row-heading">
              <span className="feature-dot" aria-hidden="true" />
              <h3>Zero Data Retention (ZDR)</h3>
            </div>
            <p>Managed proxy mode enforces mathematically rigorous zero-data-retention routing before your prompt reaches upstream AI providers. Your intellectual property is never stored or used for model training.</p>
          </div>

          <div className="feature-row">
            <div className="feature-row-heading">
              <span className="feature-dot" aria-hidden="true" />
              <h3>5-Gate Safety Pipeline</h3>
            </div>
            <p>We refuse auto-apply. Every AI proposal passes through path safety, exact matching, and syntactical validity gates before being presented for your explicit confirmation.</p>
          </div>

          <div className="feature-row">
            <div className="feature-row-heading">
              <span className="feature-dot" aria-hidden="true" />
              <h3>Local Unix Socket IPC</h3>
            </div>
            <p>Architected with Go-powered background daemons using OS-level kernel peer authentication. No TCP surface area and zero network listeners ensure maximum isolation.</p>
          </div>
        </Reveal>
      </section>

      {/* ═══ END-TO-END ARCHITECTURE ═══ */}
      <section id="architecture" className="architecture-section container">
        <Reveal className="section-header">
          <h2>End-to-End Architecture</h2>
          <p className="text-secondary">A transparent look at how your codebase stays entirely local while securely leveraging cloud-tier LLMs.</p>
        </Reveal>

        <Reveal className="arch-diagram">
          <div className="arch-cards">
            <div className="arch-card zone-local">
              <div className="arch-card-head">
                <h3>Your machine</h3>
                <span>On-device, air-gapped</span>
              </div>
              <div className="arch-card-body">
                <div className="arch-box box-local">
                  <strong>Interfaces</strong>
                  <span>VS Code + CLI</span>
                </div>
                <div className="arch-box box-local">
                  <strong>Local daemon</strong>
                  <span>Secrets scrubbed</span>
                </div>
              </div>
            </div>

            <div className="arch-card zone-cloud">
              <div className="arch-card-head">
                <h3>Mochiii cloud</h3>
                <span>Managed proxy</span>
              </div>
              <div className="arch-card-body">
                <div className="arch-box box-cloud">
                  <strong>Gateway</strong>
                  <span>No payload logging</span>
                </div>
              </div>
            </div>

            <div className="arch-card zone-provider">
              <div className="arch-card-head">
                <h3>Model provider</h3>
                <span>Third party</span>
              </div>
              <div className="arch-card-body">
                <div className="arch-box box-provider">
                  <strong>Inference</strong>
                  <span>Anonymized only</span>
                </div>
              </div>
            </div>
          </div>

          <div className="arch-rails" aria-hidden="true">
            <span className="arch-stub" />
            <span className="arch-stub" />
            <span className="arch-stub" />
            <span className="arch-bus" />
            <span className="arch-rail-label turn">Anonymized turn</span>
            <span className="arch-rail-label zdr">ZDR forward</span>
          </div>

          <div className="arch-stream">
            <span>Tokens streamed live, never written to disk</span>
          </div>
        </Reveal>
      </section>

      {/* ═══ FIVE SAFETY GATES ═══ */}
      <section id="pipeline" className="gates-section container">
        <Reveal className="section-header">
          <h2>Every Edit Passes Five Gates First</h2>
          <p className="text-secondary">No auto-apply. Every AI-proposed change clears all five, in order, before it touches a file.</p>
        </Reveal>

        <Reveal className="gates-grid">
          {pipelineSteps.map((step, idx) => (
            <div key={step.id} className="gate-card glass-panel">
              <span className="gate-number">{String(idx + 1).padStart(2, '0')}</span>
              <div className="gate-icon-wrap">{step.icon}</div>
              <h3>{step.label}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ═══ CLOSING CTA ═══ */}
      <section className="final-cta-section">
        <Reveal className="container final-cta-inner">
          <h2>Try Mochiii before you trust your next AI edit.</h2>
          <p>Free to install. No account, no telemetry, nothing uploaded.</p>
          <a
            href="https://github.com/Rav-2007/codeterminal-core"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary final-cta-btn"
          >
            Get the extension <ArrowRight size={16} />
          </a>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="footer container">
        <div className="footer-content">
          <div className="footer-brand">
            <Terminal size={20} className="text-gradient" />
            <span>Mochiii Security-First Agentic Suite</span>
          </div>
          <div className="footer-copy">
            © 2026 Mochiii Core Project. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
