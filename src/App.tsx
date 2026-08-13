import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Database, 
  Lock, 
  ChevronRight,
  GitPullRequest,
  CheckCircle,
  FileCode,
  Eye,
  Save,
  Cpu,
  Copy,
  Check,
  Zap,
  Sparkles,
  Play,
  RotateCcw,
  ArrowDown,
  ArrowUp,
  Pause,
  Activity,
  RefreshCw,
  CircleDashed,
  AlertCircle,
  ArrowRight,
  Shield
} from 'lucide-react';
import './App.css';
import './engine.css';

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(['Initializing safety daemon...']);
  const [isPlaying, setIsPlaying] = useState(true);
  const [expandedGate, setExpandedGate] = useState<number | null>(null);
  const [hoveredGate, setHoveredGate] = useState<number | null>(null);
  
  const [copied, setCopied] = useState(false);
  const [demoState, setDemoState] = useState<'prompt' | 'grounding' | 'edit' | 'diff'>('prompt');

  const overallProgress = Math.min(100, Math.round(((activeStep + (activeStep < 5 ? stepProgress / 100 : 0)) / 5) * 100));

  useEffect(() => {
    if (!isPlaying || activeStep >= 5) return;
    const interval = setInterval(() => {
      setStepProgress(prev => {
        let next = prev + 2.8;
        if (next >= 100) {
           setActiveStep(s => {
             const nextStep = s + 1;
             setLogs(l => {
                const stepName = pipelineSteps[s]?.label || 'Verification';
                const arr = [...l, `✓ ${stepName} verified`, nextStep < 5 ? `Initiating ${pipelineSteps[nextStep]?.label || 'next gate'}...` : `All gates passed. System verified.`];
                return arr.slice(-5);
             });
             return nextStep;
           });
           return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, activeStep]);

  useEffect(() => {
    const states: ('prompt' | 'grounding' | 'edit' | 'diff')[] = ['prompt', 'grounding', 'edit', 'diff'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % states.length;
      setDemoState(states[idx]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('code --install-extension codeterminal-vscode-0.0.1.vsix');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pipelineSteps = [
    { id: 'path', label: 'Path Safety', desc: 'Refuses out-of-workspace escapes & secret files', icon: <Lock size={20} />, shortStatus: 'Confined', diagnostics: { 'Files Scanned': '12', 'Path Violations': '0', 'Workspace Depth': '4 levels', 'Secret Files': 'Blocked' } },
    { id: 'match', label: 'Exact Match', desc: 'Fails on ambiguous or missing SEARCH text', icon: <Eye size={20} />, shortStatus: '100%', diagnostics: { 'Target Anchors': '1', 'Match Confidence': '100%', 'Fuzzy Fallback': 'Disabled', 'Ambiguity': 'None' } },
    { id: 'syntax', label: 'Syntax Check', desc: 'Ensures .go edits parse cleanly post-edit', icon: <FileCode size={20} />, shortStatus: 'Valid', diagnostics: { 'AST Nodes': '1,284', 'Files Parsed': '18', 'Syntax Errors': '0', 'Warnings': '2' } },
    { id: 'confirm', label: 'Human Confirm', desc: 'Requires explicit \'y\' for every change', icon: <CheckCircle size={20} />, shortStatus: 'Approved', diagnostics: { 'Pending Reviews': '0', 'Auto-apply': 'Disabled', 'Approval Mode': 'Explicit', 'Timeout': '∞' } },
    { id: 'backup', label: 'Pre-Edit Backup', desc: 'Snapshots to .codeterminal/backups/ for undo', icon: <Save size={20} />, shortStatus: 'Ready', diagnostics: { 'Snapshot Size': '24 KB', 'Location': 'Local Disk', 'Compression': 'None', 'Restore': 'Instant' } }
  ];

  return (
    <div className="app-container">
      {/* Background Orbs & Grids */}
      <div className="grid-background" />
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />

      {/* Navigation */}
      <nav className="nav-float">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="brand-icon">
              <Terminal size={18} />
            </div>
            <span className="brand-name">Mochiii</span>
            <span className="brand-ver">v0.0.1</span>
            <span className="brand-status"><span className="status-ping" /> Active</span>
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

      {/* Hero Section */}
      <header className="hero container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge animate-fade">
              <Sparkles size={14} />
              <span>Zero Data Retention • Local Indexing • 5-Gate Confinement</span>
            </div>
            
            <h1 className="hero-title">
              Cloud-Tier Intelligence.<br />
              <span className="text-gradient">Cryptographic Local Privacy.</span>
            </h1>
            
            <p className="hero-sub">
              Mochiii pairs high-performance AI reasoning with an air-tight local daemon. 
              Your codebase is indexed on-device and protected by mathematical Zero Data Retention.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={copyInstallCommand}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Command Copied!' : 'Copy Install Command'}</span>
              </button>
              <a href="https://github.com/Rav-2007/codeterminal-core" target="_blank" rel="noreferrer" className="btn btn-secondary">
                View Source Code
                <ChevronRight size={18} />
              </a>
            </div>
          </div>

          {/* 3D Gaussian Splat Viewer */}
          <div className="splat-container">
            <iframe 
              src="/spz-viewer/index.html" 
              title="3D Splat Viewer"
              className="splat-iframe"
            />
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="hero-stats glass-panel">
          <div className="stat-item">
            <span className="stat-value text-gradient-success">0 Bytes</span>
            <span className="stat-label">Code Uploaded to Cloud</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">5 Gates</span>
            <span className="stat-label">Safety Pipeline</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">&lt; 1 ms</span>
            <span className="stat-label">Local IPC Latency</span>
          </div>
        </div>
      </header>

      {/* Interactive Demo Simulation */}
      <section id="demo" className="demo-section container">
        <div className="section-header">
          <h2>Interactive Experience</h2>
          <p className="text-secondary">Watch Mochiii inspect code, enforce safety gates, and present native diffs.</p>
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

            {demoState !== 'prompt' && (
              <div className="chat-bubble assistant-bubble dark-assistant-bubble animate-slide-up">
                <div className="bubble-role">
                  <Terminal size={14} /> Mochiii Assistant
                </div>
                <div className="bubble-content">
                  <p className="thinking-text">Analyzing local codebase index... Grounded in <code>daemon/rerank.go</code></p>
                  
                  <div className="code-box dark-code-box">
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
                </div>

                {demoState === 'diff' && (
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
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section container">
        <div className="section-header">
          <h2>Engineered for Security & Speed</h2>
          <p className="text-secondary">Designed for regulated industries and zero-trust engineering environments.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Database size={28} />
            </div>
            <h3>Hybrid On-Device Indexing</h3>
            <p>Retrieval powered by on-device ONNX embeddings (BGE-small, 384d) and SQLite FTS5. Ranked via Reciprocal Rank Fusion (RRF). Your source code never leaves your local hardware.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={28} />
            </div>
            <h3>Zero Data Retention (ZDR)</h3>
            <p>Managed proxy mode enforces mathematically rigorous zero-data-retention routing before your prompt reaches upstream AI providers. Your intellectual property is never stored or used for model training.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <GitPullRequest size={28} />
            </div>
            <h3>5-Gate Safety Pipeline</h3>
            <p>We refuse auto-apply. Every AI proposal passes through path safety, exact matching, and syntactical validity gates before being presented for your explicit confirmation.</p>
          </div>

          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Cpu size={28} />
            </div>
            <h3>Local Unix Socket IPC</h3>
            <p>Architected with Go-powered background daemons using OS-level kernel peer authentication. No TCP surface area and zero network listeners ensure maximum isolation.</p>
          </div>
        </div>
      </section>

      {/* Architecture Flow Diagram */}
      <section id="architecture" className="architecture-section container">
        <div className="section-header">
          <h2>End-to-End Architecture</h2>
          <p className="text-secondary">A transparent look at how your codebase stays entirely local while securely leveraging cloud-tier LLMs.</p>
        </div>

        <div className="modern-flow-container">
          <svg className="flow-svg-bg" viewBox="0 0 100 1000" preserveAspectRatio="none">
            <path d="M50,0 L50,1000" stroke="rgba(255, 71, 133, 0.15)" strokeWidth="2" fill="none" />
            <path d="M50,0 L50,1000" stroke="url(#gradient-glow)" strokeWidth="3" fill="none" className="animated-flow-line" />
            <defs>
              <linearGradient id="gradient-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 71, 133, 0.8)" />
                <stop offset="50%" stopColor="rgba(244, 63, 94, 0.8)" />
                <stop offset="100%" stopColor="rgba(0, 255, 136, 0.8)" />
              </linearGradient>
            </defs>
          </svg>

          <div className="modern-flow-nodes">
            {/* Node 1 */}
            <div className="modern-node">
              <div className="node-icon"><Terminal size={28} /></div>
              <div className="node-content">
                <h4>Client Interfaces</h4>
                <p>VS Code Extension · Terminal UI (TUI) · Scriptable CLI</p>
              </div>
            </div>

            <div className="flow-badge">Local IPC Handshake & Prompt Request</div>

            {/* Node 2 */}
            <div className="modern-node highlight">
              <div className="node-icon"><Cpu size={28} /></div>
              <div className="node-content">
                <h4>Local Daemon <span className="tag-pill">On Your Machine</span></h4>
                <div className="node-tags">
                  <span>Hybrid Retrieve</span>
                  <span>Secret Scrub</span>
                  <span>Context Wrap</span>
                  <span>Stream Info</span>
                </div>
              </div>
            </div>

            <div className="flow-badge">Anonymized Inference Turn (Agent Mode: 1 per step)</div>

            {/* Node 3 */}
            <div className="modern-node">
              <div className="node-icon"><ShieldCheck size={28} /></div>
              <div className="node-content">
                <h4>Managed Proxy (Mochiii Gateway)</h4>
                <p>Authenticates Mochiii identity, manages quotas, and enforces strict Zero Data Retention (ZDR) routing.</p>
              </div>
            </div>

            <div className="flow-badge success-badge">SSE Tokens Streamed Unbuffered</div>

            {/* Node 4 */}
            <div className="modern-node">
              <div className="node-icon"><Database size={28} /></div>
              <div className="node-content">
                <h4>Model Provider</h4>
                <p>OpenRouter / OpenAI Compatible Endpoints</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FUTURISTIC SAFE EDIT ENGINE ═══ */}
      <section id="pipeline" className="engine-section container">
        
        {/* Ambient glow behind the engine */}
        <div className="engine-ambient-glow" />

        <div className="engine-surface">
          
          {/* ── TOP BAR: System identifier + online status ── */}
          <div className="engine-topbar">
            <div className="engine-id">
              <Shield size={14} />
              <span>SYSTEM / SAFETY-05</span>
            </div>
            <div className="engine-online">
              <span className={`online-dot ${activeStep >= 5 ? 'dot-verified' : (isPlaying ? 'dot-active' : 'dot-paused')}`}></span>
              <span>{activeStep >= 5 ? 'ENGINE VERIFIED' : (isPlaying ? 'SAFETY ENGINE ONLINE' : 'ENGINE PAUSED')}</span>
            </div>
          </div>

          {/* ── HERO STATUS: Radial progress + telemetry ── */}
          <div className="engine-hero">
            <div className="hero-radial-area">
              <div className="radial-ring-container">
                <svg viewBox="0 0 120 120" className="radial-svg">
                  {/* Tick marks */}
                  {Array.from({ length: 40 }).map((_, i) => {
                    const angle = (i / 40) * 360 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const r1 = 54, r2 = 57;
                    return (
                      <line
                        key={i}
                        x1={60 + r1 * Math.cos(rad)} y1={60 + r1 * Math.sin(rad)}
                        x2={60 + r2 * Math.cos(rad)} y2={60 + r2 * Math.sin(rad)}
                        stroke={i < (overallProgress / 100) * 40 ? '#FF3F72' : '#FFE4EC'}
                        strokeWidth="0.8"
                        strokeLinecap="round"
                      />
                    );
                  })}
                  {/* Background track */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="#FFE4EC" strokeWidth="2" />
                  {/* Progress arc */}
                  <circle
                    cx="60" cy="60" r="48"
                    fill="none"
                    stroke="url(#pinkGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${overallProgress * 3.015}, 301.5`}
                    transform="rotate(-90 60 60)"
                    className="progress-arc"
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF3F72" />
                      <stop offset="100%" stopColor="#FFDCE7" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center text */}
                <div className="radial-center">
                  <div className="radial-pct">{overallProgress}%</div>
                  <div className="radial-label">{activeStep >= 5 ? 'VERIFIED' : 'VERIFYING'}</div>
                </div>
                {/* Outer glow ring */}
                <div className={`radial-glow ${activeStep >= 5 ? 'glow-verified' : ''}`} />
              </div>
              <div className="hero-gate-count">{Math.min(activeStep, 5)} / 5 safety gates passed</div>
            </div>

            {/* Telemetry sidebar */}
            <div className="engine-telemetry">
              <div className="telemetry-title">SYSTEM TELEMETRY</div>
              <div className="telemetry-row"><span className="tele-key">ENGINE</span><span className="tele-val">{isPlaying ? 'ACTIVE' : 'PAUSED'}</span></div>
              <div className="telemetry-row"><span className="tele-key">GATES</span><span className="tele-val">{Math.min(activeStep, 5)} / 5</span></div>
              <div className="telemetry-row"><span className="tele-key">ESCAPES</span><span className="tele-val tele-zero">0</span></div>
              <div className="telemetry-row"><span className="tele-key">ERRORS</span><span className="tele-val tele-zero">0</span></div>
              <div className="telemetry-row"><span className="tele-key">MATCH</span><span className="tele-val">100%</span></div>
              <div className="telemetry-row"><span className="tele-key">LATENCY</span><span className="tele-val">0.8ms</span></div>
            </div>
          </div>

          {/* ── PIPELINE RAIL ── */}
          <div className="engine-pipeline">
            <div className="pipeline-rail">
              {pipelineSteps.map((step, idx) => {
                const status = idx < activeStep ? 'completed' : (idx === activeStep && activeStep < 5 ? 'active' : (activeStep >= 5 ? 'completed' : 'upcoming'));
                return (
                  <div key={step.id} className="pipeline-node-wrap">
                    <div
                      className={`pipeline-node ${status} ${expandedGate === idx ? 'expanded' : ''} ${hoveredGate === idx ? 'hovered' : ''}`}
                      onClick={() => { setExpandedGate(expandedGate === idx ? null : idx); setIsPlaying(false); }}
                      onMouseEnter={() => setHoveredGate(idx)}
                      onMouseLeave={() => setHoveredGate(null)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${step.label}: ${status}`}
                    >
                      <div className="node-icon-ring">
                        {status === 'completed' ? <Check size={16} /> : (status === 'active' ? <RefreshCw size={14} className="spin-icon" /> : <CircleDashed size={14} />)}
                      </div>
                      <div className="node-info">
                        <span className="node-name">{step.label}</span>
                        <span className="node-status-text">
                          {status === 'completed' ? step.shortStatus : (status === 'active' ? `${Math.round(stepProgress)}%` : 'Pending')}
                        </span>
                      </div>
                    </div>
                    {/* Connector */}
                    {idx < pipelineSteps.length - 1 && (
                      <div className={`pipeline-connector ${status === 'completed' ? 'conn-done' : (status === 'active' ? 'conn-active' : 'conn-pending')}`}>
                        <div className="connector-track" />
                        {status === 'active' && <div className="connector-energy" style={{ width: `${stepProgress}%` }} />}
                        {status === 'completed' && <div className="connector-energy" style={{ width: '100%' }} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── EXPANDED GATE DIAGNOSTICS ── */}
          {expandedGate !== null && (
            <div className="gate-diagnostic-panel">
              <div className="diag-header">
                <div className="diag-icon-wrap">{pipelineSteps[expandedGate].icon}</div>
                <div>
                  <h3>{pipelineSteps[expandedGate].label}</h3>
                  <p>{pipelineSteps[expandedGate].desc}</p>
                </div>
                <button className="diag-close" onClick={() => setExpandedGate(null)} aria-label="Close diagnostics">×</button>
              </div>
              <div className="diag-grid">
                {Object.entries(pipelineSteps[expandedGate].diagnostics).map(([k, v]) => (
                  <div key={k} className="diag-cell">
                    <span className="diag-key">{k}</span>
                    <span className="diag-val">{v}</span>
                  </div>
                ))}
              </div>
              <div className="diag-verdict">
                <Check size={14} />
                <span>Safe to proceed</span>
              </div>
            </div>
          )}

          {/* ── HOVER TOOLTIP ── */}
          {hoveredGate !== null && expandedGate !== hoveredGate && (
            <div className="gate-tooltip" style={{ left: `${(hoveredGate / 4) * 80 + 10}%` }}>
              <strong>{pipelineSteps[hoveredGate].label}</strong>
              <span>{pipelineSteps[hoveredGate].desc}</span>
            </div>
          )}

          {/* ── ACTIVE ENGINE PANEL / COMPLETION STATE ── */}
          {activeStep < 5 ? (
            <div className="engine-active-area">
              <div className="active-main">
                <div className="active-head">
                  <div className="active-icon-wrap">{pipelineSteps[activeStep].icon}</div>
                  <div>
                    <h3>{pipelineSteps[activeStep].label}</h3>
                    <p>{pipelineSteps[activeStep].desc}</p>
                  </div>
                </div>
                <div className="active-progress-wrap">
                  <div className="active-scanning-label">
                    <span>Analyzing</span>
                    <span className="scanning-dots">
                      <span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span>
                    </span>
                  </div>
                  <div className="active-bar">
                    <div className="active-bar-fill" style={{ width: `${stepProgress}%` }} />
                  </div>
                  <div className="active-bar-meta">
                    <span>{Math.round(stepProgress)}% complete</span>
                    <span className="meta-mono">Gate {activeStep + 1} of 5</span>
                  </div>
                </div>
              </div>

              <div className="engine-live-feed">
                <div className="feed-title"><Activity size={12} /> LIVE VERIFICATION</div>
                <div className="feed-entries">
                  {logs.map((log, i) => (
                    <div key={i} className={`feed-entry ${log.startsWith('✓') ? 'entry-done' : 'entry-pending'}`}>
                      <span className="entry-dot" />
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="engine-verified-area">
              <div className="verified-badge">
                <div className="verified-icon"><Check size={28} /></div>
                <div>
                  <h3>ENVIRONMENT VERIFIED</h3>
                  <p>Safety engine completed all validation layers. The operation is securely confined and ready to proceed.</p>
                </div>
              </div>

              <div className="verified-grid">
                {pipelineSteps.map((step) => (
                  <div key={step.id} className="verified-cell">
                    <div className="vcell-icon">{step.icon}</div>
                    <div className="vcell-info">
                      <span className="vcell-name">{step.label}</span>
                      <span className="vcell-status">{step.shortStatus}</span>
                    </div>
                    <Check size={14} className="vcell-check" />
                  </div>
                ))}
              </div>

              <div className="verified-actions">
                <button className="btn-secondary" onClick={() => { setActiveStep(0); setStepProgress(0); setExpandedGate(null); setLogs(['Restarting safety engine...']); setIsPlaying(true); }}>
                  Restart Validation
                </button>
                <button className="btn-primary">
                  <Check size={16} />
                  <span>Apply Edits Safely</span>
                  <ArrowRight size={16} className="btn-arrow" />
                </button>
              </div>
            </div>
          )}

          {/* ── ENGINE CONTROLS ── */}
          <div className="engine-controls">
            <div className="ctrl-meta">
              <span className="meta-mono">STATUS / {activeStep >= 5 ? 'NOMINAL' : (isPlaying ? 'SCANNING' : 'HALTED')}</span>
            </div>
            <button className={`ctrl-pause ${!isPlaying ? 'ctrl-paused' : ''}`} onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause Engine' : 'Resume Engine'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer container">
        <div className="footer-content">
          <div className="footer-brand">
            <Terminal size={20} className="text-gradient" />
            <span>Mochiii Security-First Agentic Suite</span>
          </div>
          <div className="footer-copy">
            © 2026 Mochiii Core Project. Built with Go, TypeScript & React.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
