import { Link } from 'react-router-dom';
import { HelpCircle, Shield, MessageSquare, Heart, Code, Puzzle } from 'lucide-react';
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
            Clear docs and troubleshooting steps you can run yourself. The sections below cover installation,
            MCP servers, and what to include in a bug or security report.
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
                <strong>The VS Code extension ships for Linux x64 and Windows x64 only.</strong> Apple silicon macs and Linux arm64 get the terminal app; Windows on ARM runs the terminal app's x64 build under Windows' own emulation.
              </li>
              <li>
                Mochiii is not code-signed, so installers verify the download against the release's checksums instead. Since the installers download with <code>curl</code> and PowerShell rather than a browser, Windows SmartScreen and macOS Gatekeeper do not flag the install.
              </li>
            </ul>
          </div>

          <div className="info-box">
            <p>
              <strong>Where your data goes:</strong> your codebase is indexed and searched on your own machine. With a local model, your prompt stays on your computer. With an API key, your prompt and the code it needs go to that provider. Keys are stored in a file in <code>~/.mochiii</code>, readable only by you, never checked into a project. The daemon takes requests over a local socket, not a network port — nothing on your machine listens for incoming connections. In agent mode, a server you add can reach the internet only once you turn on <code>/web</code>.
            </p>
          </div>
        </section>

        {/* MCP servers */}
        <section className="support-section">
          <div className="section-icon">
            <Puzzle size={24} />
          </div>
          <h2>MCP Servers & Agent Mode</h2>
          <p>
            Agent mode is <strong>off by default</strong>. Turning it on takes a <code>models.json</code> of your
            own with its <code>mcp</code> block set to <code>enabled: true</code> — <code>models.agent.json</code> in
            the repository is a worked example. Point <code>mochiii.configPath</code> (VS Code) or the terminal
            app's config at that file's absolute path, then restart the daemon.
          </p>
          <p>
            Built-in tools — file edits, search, running commands — are confined by the same checks that gate
            every edit. An MCP server you add is an ordinary program running with your full access, not
            sandboxed, so each one needs <code>acknowledged_unconfined: true</code> before it can run, and every
            tool call still waits for your approval.
          </p>

          <div className="info-box">
            <p>
              <strong>Adding a server:</strong> use Customize → MCP → Marketplace in VS Code, the <code>/mcp</code>{' '}
              panel in the terminal app, or <code>/mcp-server add &lt;name&gt; &lt;command&gt;</code>. Mochiii shows
              exactly what will run and asks you to type the server's name before anything is added.
            </p>
          </div>

          <div className="info-grid">
            <div>
              <h3>What a server needs</h3>
              <ul>
                <li>Most <a href="/mcp" className="inline-link">verified servers</a> run with Node.js (<code>npx</code>) and need nothing extra installed.</li>
                <li>A few need <code>uv</code> (<code>uvx</code>) installed — Fetch, Git and Redis in the current catalog.</li>
                <li>A few need Docker running — GitHub and Terraform in the current catalog.</li>
                <li>Some ask for a key or a sign-in right after you add them; one that needs neither starts straight away.</li>
              </ul>
            </div>
            <div>
              <h3>Good to know</h3>
              <ul>
                <li>The chat shows at most 24 tools across all your servers at once. When a server's tools don't fit, Mochiii reaches the rest with <code>find_tools</code> automatically — that's expected, not a sign of a broken server.</li>
                <li>A server with many tools (a database or GitHub server, for example) is only partly on the menu for an ordinary question; asking about it by name brings more of its tools in.</li>
              </ul>
            </div>
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
                <p><strong>Cause:</strong> Mochiii's background service for this folder isn't running.</p>
                <p><strong>Fix:</strong> On Linux, check with <code>ps aux | grep mochiii-daemon</code>; on Windows, check Task Manager. In VS Code, run <strong>Mochiii: Restart Daemon</strong> from the Command Palette, then <strong>Mochiii: Show Daemon Log</strong> if it still won't connect. In the terminal app, check the log in your state directory (<code>~/.local/state/mochiii</code> on macOS/Linux, <code>%LOCALAPPDATA%\mochiii</code> on Windows).</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>An MCP server won't start.</summary>
              <div className="faq-answer">
                <p><strong>Cause:</strong> most often a missing runtime — the server needs <code>uv</code> or Docker installed and on your <code>PATH</code>, or it's missing a required key.</p>
                <p><strong>Fix:</strong> the add attempt, and the <code>/mcp</code> panel or <strong>Mochiii: Show MCP Tools</strong>, say what the server still needs and whether it started. Install the missing runtime, or set the key with <code>/mcp-server key</code> (terminal) or <strong>Set Key for MCP Server…</strong> (VS Code), then try again.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>How do I connect my API key?</summary>
              <div className="faq-answer">
                <p>Type <code>/connect</code> in the chat, or run <strong>Mochiii: Set API Key</strong> in VS Code. Mochiii supports 17 providers — OpenRouter, OpenAI, Anthropic, Google Gemini, NVIDIA, Groq, DeepSeek, xAI, Mistral, Together, Fireworks, Cerebras, Moonshot, Hugging Face, SambaNova, DashScope and Z.ai — and can usually tell which one from the key itself. The key is stored in a file in <code>~/.mochiii</code>, readable only by you, and used at once with no restart.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Can I use a local model like Ollama or LM Studio?</summary>
              <div className="faq-answer">
                <p>Yes — Ollama, LM Studio, llama.cpp and vLLM are all supported. In the terminal app, pick <strong>On this computer</strong> from <code>/provider</code>, or run <code>/connect local</code>; no key is needed. In VS Code, set <code>mochiii.apiBase</code> to the server's URL (e.g. <code>http://localhost:11434/v1</code> for Ollama) and <code>mochiii.model</code> to the model name, then run <strong>Mochiii: Restart Daemon</strong>.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Why is the chat shared between the editor and the terminal?</summary>
              <div className="faq-answer">
                <p>The VS Code extension and the terminal app both connect to the same background daemon. One daemon means one chat per workspace — open both in the same folder and you'll see the same conversation. Use <code>/bookmark</code> to mark important points in a long thread.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>I sent a message and nothing happened.</summary>
              <div className="faq-answer">
                <p><strong>Cause:</strong> usually the daemon isn't running, or the model provider returned an error or timed out.</p>
                <p><strong>Fix:</strong> check the daemon is running (see above). In VS Code, check <strong>Mochiii: Show Daemon Log</strong> for the error. If you just connected a new provider, restart the daemon.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>How do I clear or restart a conversation?</summary>
              <div className="faq-answer">
                <p>Type <code>/clear</code> to start a new chat. Use <code>/compact</code> to summarise and shrink a long thread without losing context — bookmarked points survive compaction.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>The diff preview won't apply my edits.</summary>
              <div className="faq-answer">
                <p><strong>Cause:</strong> Mochiii's edit-safety checks require a change to match exactly one place in the file. If the file changed on disk after the edit was proposed, or the match is ambiguous, the apply is refused rather than guessed.</p>
                <p><strong>Fix:</strong> review the diff; if it looks wrong, reject it and ask Mochiii to regenerate. Check <strong>Mochiii: Show Daemon Log</strong> for the conflict's detail.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>My attachments (PDF, Word, images) aren't reading.</summary>
              <div className="faq-answer">
                <p>Attachments are read on your machine, not uploaded anywhere, for PDF (including scanned pages, by OCR), Word (.docx), Excel (.xlsx), PowerPoint (.pptx) and images. Old <code>.doc</code>/<code>.xls</code>/<code>.ppt</code> files and images with no readable text are refused with a message explaining why. Check <strong>Mochiii: Show Daemon Log</strong> for a parsing error, and file a bug if a file in a supported format still won't read.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Where are my chat logs stored?</summary>
              <div className="faq-answer">
                <p>In your state directory: <code>~/.local/state/mochiii</code> on macOS and Linux (or <code>$XDG_STATE_HOME/mochiii</code> if you've set that), and <code>%LOCALAPPDATA%\mochiii</code> on Windows. Logs may contain file paths from your workspace but <strong>never contain API keys</strong> — Mochiii's own credentials are scrubbed from every log, prompt and tool result before they're written.</p>
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
            File a bug report with the details below.
          </p>

          <div className="checklist">
            <h3>Include:</h3>
            <ul>
              <li>OS and version (e.g., Ubuntu 22.04, Windows 11)</li>
              <li>Client: the VS Code extension, or the terminal app</li>
              <li>Steps to reproduce</li>
              <li>What you expected</li>
              <li>What happened instead</li>
              <li>Relevant lines from <strong>Mochiii: Show Daemon Log</strong> (VS Code) or your state directory's log (terminal app)</li>
            </ul>
          </div>

          <div className="info-box">
            <p><strong>Note:</strong> logs may contain file paths from your workspace. They never contain API keys (those are scrubbed). Redact anything else sensitive before posting.</p>
          </div>
        </section>

        {/* Security Issues */}
        <section className="support-section">
          <div className="section-icon">
            <Shield size={24} />
          </div>
          <h2>Report a Security Issue</h2>

          <div className="info-box warning-box">
            <p><strong>Do NOT report security vulnerabilities through a public bug report.</strong></p>
          </div>

          <p>
            Keys are never written in plain sight: they're stored in a file only you can read and sent only to
            the provider that issued them, the daemon's own credentials are scrubbed from every log, and the
            daemon takes requests over a local socket, not a network port. If you find a vulnerability that
            bypasses these protections, report it privately to <strong>[[private security contact]]</strong>.
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
            We acknowledge security reports and keep you updated as we investigate and fix them.
          </p>
        </section>

        {/* Feature Requests */}
        <section className="support-section">
          <div className="section-icon">
            <MessageSquare size={24} />
          </div>
          <h2>Feature Requests</h2>
          <p>
            Suggest features with a description of the request and why it matters.
          </p>
          <p className="text-secondary">
            Edit safety is a core principle: every change is shown to you before it's applied.
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
                <li>Windows on ARM: terminal app only, running the x64 build under Windows' emulation</li>
              </ul>
            </div>

            <div>
              <h3>Dependencies</h3>
              <ul>
                <li>VS Code 1.85 or later, for the extension</li>
                <li>A model provider (API key for OpenRouter, Anthropic, and 15 others) <strong>or</strong> a local model server (Ollama, LM Studio, llama.cpp, vLLM)</li>
              </ul>
            </div>
          </div>

          <p className="text-secondary">
            <strong>Hardware:</strong> the daemon indexes your codebase and generates embeddings on your own
            machine — no fixed minimum, but a larger workspace takes more time and memory to index.
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
              <li>No public support channel is set up yet. File a bug report or feature request with the details above.</li>
            </ul>
          </div>

          <div className="info-box">
            <p><strong>No SLA.</strong> We do our best, and treat security issues as a priority.</p>
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
              <h3>Community</h3>
              <ul>
                <li>Everyone who files bug reports and suggests features</li>
                <li>Early adopters who trust Mochiii despite the rough edges</li>
                <li>Developers who run their own local models and want an agent that works with them</li>
              </ul>
            </div>
          </div>

          <div className="cta-box">
            <h3>Support Mochiii's Development</h3>
            <p>If you'd like to support the project, consider:</p>
            <ul>
              <li>Contributing code or documentation</li>
              <li>Spreading the word to developers who want a coding agent that can also run on a local model</li>
            </ul>
          </div>
        </section>

        {/* Helpful Links */}
        <section className="support-section links-section">
          <h2>Helpful Links</h2>
          <div className="links-grid">
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
