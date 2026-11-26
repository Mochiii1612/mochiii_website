import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Eye,
  FileCode,
  Gauge,
  Lock,
  Paperclip,
  Save,
  Users,
  History,
  Monitor,
  Terminal,
} from 'lucide-react';
import { useReveal } from '../hooks';
import CopyCommand from '../components/CopyCommand';
import HeroLotus from '../components/HeroLotus';
import ProviderLogos from '../components/ProviderLogos';
import {
  DOCS_URL,
  INSTALL_COMMAND,
  MARKETPLACE_URL,
  NODE_REQUIREMENT,
  PLATFORMS,
  PROVIDERS,
  VERSIONS,
  VSCODE_INSTALL_COMMAND,
} from '../site.config';
import shotCodebase from '../assets/shots/feature-codebase.webp';
import shotReview from '../assets/shots/feature-review.webp';
import shotTasks from '../assets/shots/feature-tasks.webp';
import shotTools from '../assets/shots/feature-tools.webp';

/** Drop-in `<div>` replacement that fades/slides into view on scroll. */
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal${isVisible ? ' reveal-visible' : ''}${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

const MCP_VERIFIED = __MCP_VERIFIED_COUNT__;

const gates = [
  { label: 'Path safety', icon: <Lock size={22} />, body: 'Edits stay inside your workspace. Credential and startup files are refused.' },
  { label: 'Exact match', icon: <Eye size={22} />, body: 'A change must match exactly one place in the file, or it is rejected.' },
  { label: 'Syntax check', icon: <FileCode size={22} />, body: 'Go files are parsed. TypeScript, JavaScript and Python are checked for balance.' },
  { label: 'Confirm', icon: <CheckCircle size={22} />, body: 'In Manual and in the terminal app, each edit waits for you. Auto, and the terminal\'s /auto, apply it without asking.' },
  { label: 'Backup', icon: <Save size={22} />, body: 'Files are copied aside before they change, so a run can be undone.' },
];

const smallFeatures = [
  {
    icon: <BookOpen size={18} />,
    title: 'Rules that stick',
    body: (
      <>
        <code>/remember tests here run with make check</code> saves a rule for the project, and every later chat follows
        it.
      </>
    ),
  },
  {
    icon: <Gauge size={18} />,
    title: 'Spending limits',
    body: (
      <>
        <code>/usage</code> shows tokens and cost from your provider's own bill. When a session or a day reaches its
        limit (<code>/budget</code>), Mochiii stops and asks before going on.
      </>
    ),
  },
  {
    icon: <Paperclip size={18} />,
    title: 'Files in VS Code',
    body: <>Attach PDFs (scanned ones too), Word, Excel, PowerPoint and images. They are read on your machine.</>,
  },
  {
    icon: <Users size={18} />,
    title: 'A team on one question',
    body: (
      <>
        <code>/team</code>: a researcher and a coder work on your question together.
      </>
    ),
  },
  {
    icon: <History size={18} />,
    title: 'Keep and reopen chats',
    body: (
      <>
        Each launch of the terminal app starts a new chat. <code>/save</code> keeps one, and <code>/resume</code> reopens
        it.
      </>
    ),
  },
];

function Shot({ src, alt, w, h, className = '' }: { src: string; alt: string; w: number; h: number; className?: string }) {
  return (
    <div className={`shot ${className}`}>
      <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
    </div>
  );
}

function FeatureBlock({
  id,
  title,
  children,
  shot,
  flip = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  shot: ReactNode;
  flip?: boolean;
}) {
  return (
    <section id={id} className="feature-block container" aria-labelledby={`${id}-title`}>
      <Reveal className={`feature-block-inner${flip ? ' flip' : ''}`}>
        <div className="feature-block-copy">
          <h2 id={`${id}-title`}>{title}</h2>
          {children}
        </div>
        <div className="feature-block-shot">{shot}</div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <header className="hero container">
        <div className="hero-layout">
          <div className="hero-copy">
            <div className="hero-badge animate-fade">
              <span>Beta · Terminal app + VS Code extension</span>
            </div>

            <h1 className="hero-title">
              An AI coding agent
              <br />
              that <span className="text-gradient">knows your codebase.</span>
            </h1>

            <p className="hero-sub">
              Mochiii reads your project, answers questions about it, writes and fixes code, runs your tests, and works
              through long tasks.
            </p>

            <div className="hero-actions">
              <a href={MARKETPLACE_URL} className="btn btn-primary">
                <Monitor size={16} aria-hidden="true" />
                Install for VS Code
              </a>
              <Link to="/#install-npm" className="btn btn-secondary">
                <Terminal size={16} aria-hidden="true" />
                Terminal app
              </Link>
            </div>
          </div>

          <HeroLotus />
        </div>
      </header>

      {/* ═══ PROOF STRIP ═══ */}
      <section className="proof-strip container" aria-label="Mochiii at a glance">
        <ul>
          <li>VS Code + terminal</li>
          <li>{PROVIDERS.length} model providers or a local model</li>
          <li>
            <Link to="/mcp">{MCP_VERIFIED} verified MCP servers</Link>
          </li>
        </ul>
      </section>

      {/* ═══ FOUR FEATURE BLOCKS ═══ */}
      <FeatureBlock
        id="codebase"
        title="Knows your codebase"
        shot={
          <Shot
            src={shotCodebase}
            w={1100}
            h={558}
            alt="The terminal app answering how an order total is worked out, step by step, and listing the four files involved."
          />
        }
      >
        <p>
          Mochiii indexes your project on your machine and finds the code that matters for each question. The index
          updates as you save, so answers match the code you have now.
        </p>
      </FeatureBlock>

      <FeatureBlock
        id="edits"
        title="Auto, Manual or Plan"
        flip
        shot={
          <Shot
            src={shotReview}
            w={1100}
            h={721}
            alt="An edit to src/checkout.js shown as a diff in the terminal app, waiting for y apply, n skip or q cancel remaining."
          />
        }
      >
        <p>
          In VS Code a new chat starts in <strong>Auto</strong>: full access inside the project. After a one-time
          warning it edits files, runs commands and tests, installs the project's packages and uses local git without
          asking. It still asks when it recognises going outside the project, sending something out (like{' '}
          <code>git push</code>) or wiping data. Commands are not sandboxed and that check can miss some, so use Auto
          only in projects you trust.
        </p>
        <p>
          <strong>Manual</strong>: every edit waits for your Apply. <strong>Plan</strong>: Mochiii reads your code and
          writes a plan, with no edits, no commands and no network.
        </p>
        <p>
          In the terminal app, each change shows up as a diff: apply or skip it, and an applied change can be undone in
          one step. <code>/auto</code> (or <code>ctrl+space</code>) says yes for you to almost everything until you turn
          it off; it is off every time Mochiii starts.
        </p>
      </FeatureBlock>

      <section className="gates-section container" aria-labelledby="gates-title">
        <Reveal className="section-header">
          <h2 id="gates-title">Every edit passes five checks.</h2>
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

      <FeatureBlock
        id="tasks"
        title="Long tasks and specs"
        shot={
          <Shot
            src={shotTasks}
            w={1100}
            h={335}
            alt="The terminal app's command menu with /fix typed: find and fix a bug, a long task."
          />
        }
      >
        <p>
          <code>/debug</code>, <code>/fix</code> and <code>/refactor</code> handle work that is too big for one reply.
          Mochiii reproduces the problem, fixes it at the root, and finishes only when the build or tests pass.{' '}
          <code>/hunt</code> looks for real bugs and proves each one with a failing run.
        </p>
        <p>
          <code>/spec</code> writes down what you want built. <code>/spec build</code> builds it tests-first, and{' '}
          <code>/spec check</code> grades the result against the spec.
        </p>
        <p className="feature-block-note">
          Every task has a time and spend budget, and you can pause it and pick it up later. Long tasks and specs need
          agent mode, so a model that can use tools.
        </p>
      </FeatureBlock>

      <FeatureBlock
        id="tools"
        title="Tools: agent mode, MCP and GitHub"
        flip
        shot={
          <Shot
            src={shotTools}
            w={592}
            h={664}
            className="shot-narrow"
            alt="The MCP Marketplace inside VS Code: 49 verified servers, with Filesystem and Git cards and their Add buttons."
          />
        }
      >
        <p>
          <strong>Agent mode.</strong> Mochiii can read files, search, run commands and tests, and look things up on the
          web, and an answer that used the web lists the pages it read. In the terminal app it is on with a provider's
          key, and a model on your computer gets tools only after <code>/agent on</code>; a change to a file or a
          command waits for your approval unless <code>/auto</code> is on. In VS Code, Auto works without asking inside
          the project, and Manual asks first.
        </p>
        <p>
          <strong>MCP servers.</strong> <code>/mcp</code> opens a panel of your servers: paste the JSON from a server's
          setup page, or pick one of the {MCP_VERIFIED} in the <Link to="/mcp" className="inline-link">MCP Marketplace</Link>.
        </p>
        <p>
          <strong>GitHub.</strong> Read issues and pull requests, and see why CI failed, without leaving the chat:{' '}
          <code>/issue 104</code>, <code>/pr 31 log</code>.
        </p>
      </FeatureBlock>

      {/* ═══ SMALLER FEATURES ═══ */}
      <section className="section-tight container" aria-labelledby="more-title">
        <Reveal className="section-header">
          <h2 id="more-title">And the small things.</h2>
        </Reveal>
        <Reveal className="small-grid">
          {smallFeatures.map((f) => (
            <div key={f.title} className="small-card">
              <div className="small-card-head">
                <span className="small-card-icon" aria-hidden="true">{f.icon}</span>
                <h3>{f.title}</h3>
              </div>
              <p>{f.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ═══ ANY MODEL ═══ */}
      <section id="models" className="section-tight container" aria-labelledby="models-title">
        <Reveal className="section-header">
          <h2 id="models-title">Works with any model.</h2>
          <p className="text-secondary">
            {PROVIDERS.length} providers with your own key, or a model server on your computer: Ollama, LM Studio,
            llama.cpp or vLLM, with no key.
          </p>
        </Reveal>
        <Reveal>
          <ProviderLogos />
        </Reveal>
      </section>

      {/* ═══ WHERE YOUR CODE GOES ═══ */}
      <section id="your-code" className="section-tight container" aria-labelledby="code-title">
        <Reveal className="section-header">
          <h2 id="code-title">Where your code goes.</h2>
          <p className="text-secondary">What reaches a model provider depends on the model you pick.</p>
        </Reveal>
        <Reveal className="code-facts">
          <ul>
            <li>Your code is indexed and searched on your own machine. Nothing is uploaded to build the index.</li>
            <li>
              Your question, and the parts of your code that answer it, go only to the model provider you chose. Text that
              looks like an API key is masked before it leaves.
            </li>
            <li>Keys are stored on your machine, readable only by you, and sent only to the provider that issued them.</li>
            <li>Nothing on your machine listens on the network.</li>
          </ul>
        </Reveal>
      </section>

      {/* ═══ INSTALL + PLATFORMS ═══ */}
      <section id="install" className="section-tight container" aria-labelledby="install-title">
        <Reveal className="section-header">
          <h2 id="install-title">Install.</h2>
        </Reveal>
        <Reveal className="install-options">
          <div className="install-box" id="install-vscode">
            <div className="install-box-label">
              <Monitor size={13} aria-hidden="true" />
              <span>VS Code extension</span>
            </div>
            <div className="install-box-body">
              <a href={MARKETPLACE_URL} className="btn btn-primary install-box-btn">
                Install from the VS Code Marketplace
              </a>
              <p className="install-or">or from a terminal:</p>
            </div>
            <CopyCommand command={VSCODE_INSTALL_COMMAND} label="Copy the VS Code install command" />
          </div>

          <div className="install-box" id="install-npm">
            <div className="install-box-label">
              <Terminal size={13} aria-hidden="true" />
              <span>Terminal app, with npm</span>
            </div>
            <div className="install-box-body">
              <p className="install-or">The same command on every system. {NODE_REQUIREMENT}</p>
            </div>
            <CopyCommand command={INSTALL_COMMAND} label="Copy the npm install command" />
            <div className="install-box-footer install-note">
              <span>
                Then run <code>mochiii</code> in a project folder.
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal className="platforms">
          <p>{PLATFORMS.terminal}</p>
          <p>
            {PLATFORMS.vscode} {PLATFORMS.note}
          </p>
          <p>
            Using both? VS Code extension {VERSIONS.extension} works with terminal app {VERSIONS.terminal} or later.
            Update the terminal app first.
          </p>
        </Reveal>
      </section>

      {/* ═══ CLOSING CTA ═══ */}
      <section className="final-cta-section">
        <Reveal className="container final-cta-inner">
          <h2>Ready to try it?</h2>
          <div className="final-cta-actions">
            <a href={MARKETPLACE_URL} className="btn btn-primary final-cta-btn">
              Install for VS Code <ArrowRight size={16} />
            </a>
            <Link to="/#install-npm" className="btn btn-secondary final-cta-btn">
              Terminal app
            </Link>
          </div>
          <a href={DOCS_URL} className="inline-link final-cta-docs">Read the docs</a>
        </Reveal>
      </section>
    </>
  );
}
