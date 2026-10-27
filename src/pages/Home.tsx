import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Eye, FileCode, Lock, Save, Sparkles } from 'lucide-react';
import { useReveal } from '../hooks';
import InstallTabs from '../components/InstallTabs';
import ProviderLogos from '../components/ProviderLogos';
import { PROVIDERS } from '../site.config';

/** Drop-in `<div>` replacement that fades/slides into view on scroll. */
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal${isVisible ? ' reveal-visible' : ''}${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

const features = [
  {
    title: 'Knows your codebase',
    body: 'Your project is indexed and searched on your own computer, so answers come from your code.',
  },
  {
    title: 'Safer edits',
    body: 'Every change is checked and backed up before it lands, and you can undo a whole run.',
  },
  {
    title: 'Agent mode',
    body: 'Off by default. When you turn it on, every tool call waits for your approval.',
  },
  {
    title: 'Any model',
    body: `${PROVIDERS.length} providers, or a model server running on your own computer.`,
  },
  {
    title: 'Terminal and VS Code',
    body: 'The same agent in your terminal and in a VS Code extension.',
  },
  {
    title: 'Plan before you edit',
    body: 'Plan mode reads your code and proposes changes without touching a file.',
  },
];

const gates = [
  { label: 'Path safety', icon: <Lock size={22} />, body: 'Edits stay inside your workspace. Credential and startup files are refused.' },
  { label: 'Exact match', icon: <Eye size={22} />, body: 'A change must match exactly one place in the file, or it is rejected.' },
  { label: 'Syntax check', icon: <FileCode size={22} />, body: 'Go files are parsed. TypeScript, JavaScript and Python are checked for balance.' },
  { label: 'Confirm', icon: <CheckCircle size={22} />, body: 'Approve each edit yourself, or let auto mode apply them with the rest of the checks.' },
  { label: 'Backup', icon: <Save size={22} />, body: 'Files are copied aside before they change, so a run can be undone.' },
];

const goodToKnow = [
  {
    title: 'VS Code starts in auto mode',
    body: 'Edits apply as they arrive, still checked and undoable. Switch to manual in settings to approve each one.',
  },
  {
    title: 'Platform support varies',
    body: 'The VS Code extension is for Linux x64 and Windows x64. Other platforms use the terminal app.',
  },
  {
    title: 'Syntax checking is limited',
    body: 'Go is fully parsed. Other languages get a lighter check or none.',
  },
  {
    title: 'Binaries are not code-signed',
    body: 'Installers verify checksums. Windows may show a SmartScreen warning.',
  },
  {
    title: 'Proprietary licence',
    body: 'Mochiii is not open source.',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero: copy and install on the left, the 3D lotus splat on the right (unchanged) */}
      <header id="install" className="hero container">
        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-badge animate-fade">
              <Sparkles size={14} />
              <span>Terminal app + VS Code extension</span>
            </div>

            <h1 className="hero-title">
              An AI coding agent
              <br />
              that <span className="text-gradient">knows your codebase.</span>
            </h1>

            <p className="hero-sub">
              Mochiii indexes your project on your own machine, checks every edit before it lands, and lets
              you undo it.
            </p>

            <InstallTabs idPrefix="hero" />
          </div>

          {/* Staged 3D Gaussian Splat Viewer: the hero's visual, right side */}
          <div className="hero-stage">
            <div className="hero-stage-glow" aria-hidden="true" />
            <div className="splat-container">
              <iframe src="/spz-viewer/index.html" title="3D Splat Viewer" className="splat-iframe" />
            </div>
          </div>
        </div>
      </header>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="section-tight container">
        <Reveal className="section-header">
          <h2>What is Mochiii?</h2>
          <p className="text-secondary">
            An AI coding agent for your terminal and VS Code, built around your own codebase.
          </p>
        </Reveal>

        <Reveal className="features-list">
          {features.map((f) => (
            <div key={f.title} className="feature-row">
              <div className="feature-row-heading">
                <span className="feature-dot" aria-hidden="true" />
                <h3>{f.title}</h3>
              </div>
              <p>{f.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ═══ EDIT SAFETY ═══ */}
      <section id="edits" className="gates-section container">
        <Reveal className="section-header">
          <h2>Every edit passes five checks.</h2>
        </Reveal>

        <Reveal className="gates-grid gates-grid--five">
          {gates.map((gate, idx) => (
            <div key={gate.label} className="gate-card glass-panel">
              <span className="gate-number">{String(idx + 1).padStart(2, '0')}</span>
              <div className="gate-icon-wrap">{gate.icon}</div>
              <h3>{gate.label}</h3>
              <p>{gate.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ═══ MODELS ═══ */}
      <section id="models" className="section-tight container">
        <Reveal className="section-header">
          <h2>Bring your own model.</h2>
          <p className="text-secondary">{PROVIDERS.length} providers with your own key, or a model running on your own computer.</p>
        </Reveal>

        <Reveal>
          <ProviderLogos />
        </Reveal>
      </section>

      {/* ═══ PRIVACY ═══ */}
      <section id="privacy" className="section-tight container">
        <Reveal className="section-header">
          <h2>Built for privacy.</h2>
          <p className="text-secondary">
            Your codebase is indexed, embedded and searched on your own computer. Only your prompt, with the
            code it needs, goes to the model provider you choose. Use a local model and it goes nowhere. Your
            API keys stay on your computer, and known secret patterns are scrubbed from prompts before they
            are sent.
          </p>
        </Reveal>
      </section>

      {/* ═══ GOOD TO KNOW ═══ */}
      <section id="limits" className="section-tight container">
        <Reveal className="section-header">
          <h2>Good to know.</h2>
        </Reveal>

        <Reveal className="limits">
          {goodToKnow.map((item) => (
            <div key={item.title} className="limit">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ═══ CLOSING CTA ═══ */}
      <section className="final-cta-section">
        <Reveal className="container final-cta-inner">
          <h2>Ready to try it?</h2>
          <div className="final-cta-actions">
            <a href="#install" className="btn btn-primary final-cta-btn">
              Install <ArrowRight size={16} />
            </a>
            <Link to="/support" className="btn btn-secondary final-cta-btn">
              Support
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
