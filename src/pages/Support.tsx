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
            </ul>
          </div>

          <div className="info-box">
            <p>
              <strong>Where your data goes:</strong> your codebase is indexed and searched on your own machine. Your question, and the code Mochiii finds for it, go to the model you connect: the provider's API with an API key, or the model server on your computer with a local model. A key you connect is stored in <code>~/.mochiii/credentials.json</code>, readable only by you, outside your project. The daemon takes requests over a local socket and opens no network port. In agent mode, Mochiii's web tools can send text to the internet; for a model on your computer they stay off until you type <code>/web on</code>.
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
            In the terminal app, agent mode is on: <code>/mcp-server</code> says <code>Agent mode is ON</code>. In
            VS Code it is <strong>off by default</strong>. Turning it on there takes a <code>models.json</code> of
            your own with its <code>mcp</code> block set to <code>enabled: true</code> — <code>models.agent.json</code> in
            the repository is a worked example. Point <code>mochiii.configPath</code> at that file's absolute path,
            then restart the daemon.
          </p>
          <p>
            Most built-in tools are confined. <code>/mcp-server</code> marks the ones that are not with{' '}
            <code>NO</code> in its CONFINED column — <code>run_command</code>, for example — and their approval
            says <code>NOT SANDBOXED</code>. An MCP server you add is an ordinary program running with your full
            access, not sandboxed, so Mochiii asks you to type its name before adding it, and each of its tools
            asks before it runs.
          </p>

          <div className="info-box">
            <p>
              <strong>Adding a server:</strong> in VS Code, type <code>/mcp</code> in the chat or open Customize →
              MCP → Marketplace; in the terminal app, use <code>/mcp-server add &lt;name&gt; &lt;command&gt;</code>.
              Mochiii shows exactly what will run and asks you to type the server's name before anything is added.
            </p>
          </div>

          <div className="info-grid">
            <div>
              <h3>What a server needs</h3>
              <ul>
                <li>Most <a href="/mcp" className="inline-link">verified servers</a> run with Node.js (<code>npx</code>) and need nothing extra installed.</li>
                <li>A few need <code>uv</code> (<code>uvx</code>) installed — Fetch, Git and Redis in the current catalog.</li>
                <li>A few need Docker running — GitHub and Terraform in the current catalog.</li>
                <li>A server that needs a key starts without it until you set one with <code>/mcp-server key &lt;name&gt; &lt;VARIABLE&gt;</code> (terminal) or <strong>Set Key for MCP Server…</strong> (VS Code). Mochiii says so when you add it.</li>
              </ul>
            </div>
            <div>
              <h3>Good to know</h3>
              <ul>
                <li>The model is shown at most 24 tools at a time, Mochiii's own included. When your servers' tools don't all fit, the model can look up the rest with <code>find_tools</code> — that's expected, not a sign of a broken server.</li>
                <li>When you add a server whose tools don't all fit, Mochiii says how many are left off, and <code>/mcp-server</code> lists them.</li>
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
                <p><strong>Fix:</strong> In VS Code, run <strong>Mochiii: Restart Daemon</strong> from the Command Palette, then <strong>Mochiii: Show Daemon Log</strong> if it still won't connect. In the terminal app, run <code>mochiii --stop</code> in the project folder and start <code>mochiii</code> again; its log is in the <code>logs</code> folder of your state directory (<code>~/.local/state/mochiii</code> on macOS/Linux, <code>%LOCALAPPDATA%\mochiii</code> on Windows).</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>An MCP server won't start.</summary>
              <div className="faq-answer">
                <p><strong>Cause:</strong> most often the program that starts it isn't installed — <code>uv</code> or Docker, for example — or a key it needs isn't set. A first start can also take longer than Mochiii waits, for example while <code>npx</code> downloads the server.</p>
                <p><strong>Fix:</strong> in the terminal app, <code>/mcp-server check &lt;name&gt;</code> starts the server and says whether it connected, and if not, why; add <code>--timeout 60</code> to wait longer. In VS Code, run <strong>Mochiii: Check MCP Server</strong>. Install the missing program, or set the key with <code>/mcp-server key</code> (terminal) or <strong>Set Key for MCP Server…</strong> (VS Code), then check again.</p>
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
                <p>The VS Code extension and the terminal app both connect to the same background daemon, which serves every client of a workspace from one shared conversation — open both in the same folder and you'll see the same chat. To keep a chat, the mechanism is different per client: in VS Code, click the <strong>☆</strong> next to its name, or the star on its row in History, to pin it so it's never dropped by the 50-chat/20 MB limit. In the terminal, <code>/save [name]</code> keeps the current chat, and <code>/resume</code> or <code>/history</code> lists and reopens saved ones.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>I sent a message and nothing happened.</summary>
              <div className="faq-answer">
                <p><strong>Cause:</strong> usually the daemon isn't running, or the model provider returned an error or timed out.</p>
                <p><strong>Fix:</strong> check the daemon is running (see above). In VS Code, check <strong>Mochiii: Show Daemon Log</strong> for the error; in the terminal app, check its log (see above).</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>How do I clear or restart a conversation?</summary>
              <div className="faq-answer">
                <p>Type <code>/clear</code> to start a new chat, or <code>/compact</code> to summarise and shrink a long one. In VS Code, compacting saves the full chat to History first, so nothing already said is lost — click <strong>History</strong> (the clock button) to reopen it.</p>
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
                <p>In VS Code, attachments are read on your machine and turned into text, which is added to your prompt. That works for PDF (including scanned pages, by OCR), Word (.docx), Excel (.xlsx), PowerPoint (.pptx) and images. Old <code>.doc</code>/<code>.xls</code>/<code>.ppt</code> files and images with no readable text are refused with a message explaining why. Check <strong>Mochiii: Show Daemon Log</strong> for a parsing error, and file a bug if a file in a supported format still won't read.</p>
              </div>
            </details>

            <details className="faq-item">
              <summary>Where are my chat logs stored?</summary>
              <div className="faq-answer">
                <p>In your state directory: <code>~/.local/state/mochiii</code> on macOS and Linux (or <code>$XDG_STATE_HOME/mochiii</code> if you've set that), and <code>%LOCALAPPDATA%\mochiii</code> on Windows. Logs may contain file paths from your workspace. Mochiii removes its own API key from what it writes there.</p>
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
            <p><strong>Note:</strong> logs may contain file paths from your workspace. Mochiii removes its own API key from them. Redact anything else sensitive before sending them.</p>
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
            A key you connect is stored in a file only you can read, Mochiii removes its own key from its logs,
            and the daemon takes requests over a local socket, not a network port. If you find a vulnerability that
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
            Edit safety is a core principle: every edit is shown to you as a diff before it's applied.
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
              <li>Email <a href="mailto:mochiiijuly@gmail.com" className="inline-link">mochiiijuly@gmail.com</a> to reach us, with a bug report, a feature request or a question.</li>
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
