import { Link } from 'react-router-dom';
import { HelpCircle, Shield, MessageSquare, Heart, Code } from 'lucide-react';
import '../Support.css';

export default function Support() {
  return (
    <div className="support-page">
      <div className="support-hero">
        <div className="container">
          <h1 className="support-title">
            Support <span className="text-gradient">& Help</span>
          </h1>
          <p className="support-subtitle">
            Self-serve first, then a human. Clear docs, searchable issues, and troubleshooting steps you can run yourself. When that's not enough, we're here.
          </p>
        </div>
      </div>

      <div className="support-content container">
        {/* Getting Started */}
        <section className="support-section">
          <div className="section-icon">
            <HelpCircle size={24} />
          </div>
          <h2>Getting Started & Installation</h2>
          <p>
            Install commands are on the <Link to="/#install" className="inline-link">home page</Link>. Then run <code>mochiii</code> in a project folder.
          </p>
          
          <div className="info-box warning-box">
            <h3>Real friction to expect:</h3>
            <ul>
              <li>
                The VS Code Marketplace listing can trail the terminal app, so a newer feature may not be in the extension yet.
              </li>
              <li>
                <strong>Windows users:</strong> first run triggers SmartScreen's "Windows protected your PC" warning because the binaries are not Authenticode-signed. Click "More info" → "Run anyway."
              </li>
              <li>
                <strong>The VS Code extension ships for Linux x64 and Windows x64 only.</strong> Apple silicon macs and Linux arm64 get the terminal app.
              </li>
            </ul>
          </div>

          <div className="info-box">
            <p>
              <strong>Where your data goes:</strong> Your codebase is indexed and embedded on your machine. API keys are stored in OS secret storage or a 0600 credentials file, never in the daemon's environment. The daemon takes requests over a local socket, not a network port. The only outbound traffic is the prompt sent to your model provider, or, in agent mode, one prompt per approved step. With a model running on your own computer, nothing leaves it.
            </p>
          </div>
        </section>

        {/* Troubleshooting & FAQ */}
        <section className="support-section">
          <div className="section-icon">
            <MessageSquare size={24} />
          </div>
          <h2>Troubleshooting & FAQ</h2>
          
          <div className="faq-list">
            <details className="faq-item">
              <summary>The daemon won't start, or the panel says it can't connect.</summary>
              <div className="faq-answer">
                <p>Check that the background daemon process is running. On Linux, run <code>ps aux | grep mochiii-daemon</code>. On Windows, check Task Manager. If it's not running, restart VS Code or launch the daemon manually from the command palette (<code>Mochiii: Start Daemon</code>). Check the Output panel (View → Output → Mochiii) for startup errors.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>How do I connect my API key?</summary>
              <div className="faq-answer">
                <p>In the chat panel, type <code>/connect</code> and follow the prompts. Mochiii supports ~17 providers: OpenRouter, Groq, NVIDIA, Anthropic, Google Gemini, xAI, Together, Fireworks, Cerebras, Hugging Face, and more. Keys are stored on your machine in OS secret storage (Linux keyring, Windows Credential Manager) or a 0600 file. They are handed to the daemon on stdin, never stored in its environment.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Can I use a local model like Ollama or LM Studio?</summary>
              <div className="faq-answer">
                <p>Yes. Set <code>mochiii.apiBase</code> to your local server's URL (e.g., <code>http://localhost:11434/v1</code> for Ollama) and <code>mochiii.model</code> to the model name. Restart the daemon. No API key is required for local servers.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>What is agent mode (MCP) and why does it ask for approval?</summary>
              <div className="faq-answer">
                <p>Agent mode lets Mochiii call tools — built-in confined tools (file edits, terminal commands) and optional third-party MCP servers. It is <strong>off by default</strong>. Built-in tools run confined. Third-party MCP servers run unconfined and require per-call approval. Enable it in settings (<code>mochiii.agentMode: true</code>) and restart the daemon.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>My attachments (PDF, Word, images) aren't reading.</summary>
              <div className="faq-answer">
                <p>Attachments are read on-machine using local libraries. Check the Output panel for parsing errors. Supported formats: PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), and images. Corrupted files or missing dependencies (e.g., missing native libraries on Linux) will cause silent failures. File a bug if a valid file won't read.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Why is the chat shared between the editor and the terminal?</summary>
              <div className="faq-answer">
                <p>The VS Code extension and the chat TUI (terminal client) both connect to the same background daemon. One daemon = one chat per workspace. If you open the TUI and the editor in the same workspace, you'll see the same conversation. This is by design. Use <code>/bookmark</code> to mark important points in long threads.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>I sent a message and nothing happened.</summary>
              <div className="faq-answer">
                <p>Check the daemon is running. Check the Output panel for errors. If you just connected a new provider, restart the daemon. If the model provider is down, you'll see a timeout or HTTP error in the Output panel.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>How do I clear or restart a conversation?</summary>
              <div className="faq-answer">
                <p>Type <code>/clear</code> to reset the current chat. Use <code>/compact</code> to summarise and compress a long thread without losing context. Bookmarks (use <code>/bookmark</code>) survive compaction.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>The diff preview won't apply my edits.</summary>
              <div className="faq-answer">
                <p>Mochiii uses an edit-safety engine to prevent conflicts. If the file changed on disk after the edit was proposed, the apply will fail. Review the diff carefully. If it looks wrong, reject it and ask Mochiii to regenerate. Check the Output panel for conflict details.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Where are my chat logs stored?</summary>
              <div className="faq-answer">
                <p>Chat history is stored in the daemon's working directory on your machine. Logs may contain file paths but <strong>never contain API keys</strong> (those are scrubbed). Check <a href="#" className="inline-link">[[docs URL]]</a> for the exact path.</p>
              </div>
            </details>
          </div>
        </section>

        {/* Report a Bug */}
        <section className="support-section">
          <div className="section-icon">
            <Code size={24} />
          </div>
          <h2>Report a Bug</h2>
          <p>
            File a GitHub Issue at <a href="https://github.com/Rav-2007/codeterminal-core/issues" target="_blank" rel="noreferrer" className="inline-link">github.com/Rav-2007/codeterminal-core/issues</a>.
          </p>
          
          <div className="checklist">
            <h3>Include:</h3>
            <ul>
              <li>OS and version (e.g., Ubuntu 22.04, Windows 11)</li>
              <li>Client (VS Code extension, TUI, or CLI)</li>
              <li>Steps to reproduce</li>
              <li>What you expected</li>
              <li>What happened instead</li>
              <li>Relevant logs from the Output panel (View → Output → Mochiii)</li>
            </ul>
          </div>

          <div className="info-box">
            <p><strong>Note:</strong> logs may contain file paths from your workspace. They never contain API keys (those are scrubbed). Redact anything sensitive before posting.</p>
          </div>
        </section>

        {/* Security Issues */}
        <section className="support-section">
          <div className="section-icon">
            <Shield size={24} />
          </div>
          <h2>Report a Security Issue</h2>
          
          <div className="info-box warning-box">
            <p><strong>Do NOT open a public GitHub Issue for security vulnerabilities.</strong></p>
          </div>

          <p>
            Mochiii is security-first: API keys are never stored in the daemon's environment, credentials are scrubbed from logs, and the daemon takes requests over a local socket, not a network port. If you find a vulnerability that bypasses these protections, report it privately to <strong>[[private security contact]]</strong>.
          </p>

          <div className="checklist">
            <h3>Include:</h3>
            <ul>
              <li>A description of the vulnerability</li>
              <li>Steps to reproduce</li>
              <li>Impact (what data is exposed, what actions are possible)</li>
              <li>Any proof-of-concept code (do not publish it publicly)</li>
            </ul>
          </div>

          <p className="text-secondary">
            We will acknowledge your report within [[typical security response time]] and keep you updated as we investigate and fix it.
          </p>
        </section>

        {/* Feature Requests */}
        <section className="support-section">
          <div className="section-icon">
            <MessageSquare size={24} />
          </div>
          <h2>Feature Requests</h2>
          <p>
            Suggest features by opening a GitHub Issue at <a href="https://github.com/Rav-2007/codeterminal-core/issues" target="_blank" rel="noreferrer" className="inline-link">github.com/Rav-2007/codeterminal-core/issues</a>. Tag it "enhancement" or "feature request."
          </p>
          <p className="text-secondary">
            <strong>How priorities are decided:</strong> [[how priorities are decided: community vote / maintainer discretion / roadmap]]. Local-first, privacy, and edit safety are core principles and will not be compromised.
          </p>
        </section>

        {/* System Requirements */}
        <section className="support-section">
          <div className="section-icon">
            <HelpCircle size={24} />
          </div>
          <h2>System Requirements & Supported Platforms</h2>
          
          <div className="info-grid">
            <div>
              <h3>Platforms</h3>
              <ul>
                <li>Linux x64: extension and terminal app</li>
                <li>Windows x64: extension and terminal app</li>
                <li>Apple silicon macOS, Linux arm64: terminal app only</li>
              </ul>
            </div>
            
            <div>
              <h3>Dependencies</h3>
              <ul>
                <li>VS Code version [[minimum VS Code version]]</li>
                <li>A model provider (API key for OpenRouter, Anthropic, etc.) <strong>or</strong> a local model server (Ollama, LM Studio)</li>
              </ul>
            </div>
          </div>

          <p className="text-secondary">
            <strong>Hardware:</strong> the daemon indexes your codebase on your machine. Larger workspaces (&gt;10k files) will use more RAM. Embedding generation happens locally. Expect 1–4 GB RAM usage for typical projects.
          </p>
        </section>

        {/* Contact */}
        <section className="support-section">
          <div className="section-icon">
            <MessageSquare size={24} />
          </div>
          <h2>Contact & What to Expect</h2>
          
          <div className="contact-box">
            <h3>Support channels:</h3>
            <ul>
              <li>GitHub Issues: <a href="https://github.com/Rav-2007/codeterminal-core/issues" target="_blank" rel="noreferrer" className="inline-link">github.com/Rav-2007/codeterminal-core/issues</a></li>
              <li>[[community link or "none yet"]]</li>
            </ul>
          </div>

          <p className="text-secondary">
            <strong>Response time:</strong> [[typical response time]]. Mochiii is maintained by [[maintained by: solo / team]]. We respond to critical bugs and security issues first.
          </p>

          <div className="info-box">
            <p><strong>No SLA.</strong> The Mochiii source is readable on GitHub under a proprietary licence. We do our best. If you need guaranteed support or enterprise features, [[enterprise contact or "not available yet"]].</p>
          </div>
        </section>

        {/* Our Supporters */}
        <section className="support-section supporters-section">
          <div className="section-icon">
            <Heart size={24} />
          </div>
          <h2>Our Supporters</h2>
          <p>Mochiii is made possible by the support of our community. Special thanks to:</p>
          
          <div className="supporters-grid">
            <div className="supporter-card glass-panel">
              <h3>Sponsors</h3>
              <p>Support us on <a href="https://github.com/sponsors/Rav-2007" target="_blank" rel="noreferrer" className="inline-link">GitHub Sponsors</a></p>
            </div>

            <div className="supporter-card glass-panel">
              <h3>Contributors</h3>
              <p>See the full list at <a href="https://github.com/Rav-2007/codeterminal-core/graphs/contributors" target="_blank" rel="noreferrer" className="inline-link">GitHub</a></p>
            </div>

            <div className="supporter-card glass-panel">
              <h3>Community</h3>
              <ul>
                <li>Everyone who files bug reports and suggests features</li>
                <li>Early adopters who trust Mochiii despite the rough edges</li>
                <li>Privacy advocates who believe local-first AI tooling is worth building</li>
              </ul>
            </div>
          </div>

          <div className="cta-box">
            <h3>Support Mochiii's Development</h3>
            <p>If you'd like to support the project, consider:</p>
            <ul>
              <li>Sponsoring on <a href="https://github.com/sponsors/Rav-2007" target="_blank" rel="noreferrer" className="inline-link">GitHub</a></li>
              <li>Contributing code or documentation</li>
              <li>Spreading the word to developers who value privacy and local control</li>
            </ul>
          </div>
        </section>

        {/* Helpful Links */}
        <section className="support-section links-section">
          <h2>Helpful Links</h2>
          <div className="links-grid">
            <a href="https://github.com/Rav-2007/codeterminal-core" target="_blank" rel="noreferrer" className="link-card">
              <Code size={20} />
              <span>Repository</span>
            </a>
            <a href="#" className="link-card">
              <HelpCircle size={20} />
              <span>Documentation</span>
            </a>
            <a href="#" className="link-card">
              <MessageSquare size={20} />
              <span>Changelog</span>
            </a>
            <a href="https://github.com/Rav-2007/codeterminal-core/releases" target="_blank" rel="noreferrer" className="link-card">
              <Code size={20} />
              <span>Releases</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
