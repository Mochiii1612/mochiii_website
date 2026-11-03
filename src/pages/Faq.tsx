import { MessageSquare } from 'lucide-react';
import '../Support.css';

export default function Faq() {
  return (
    <div className="support-page">
      <div className="support-hero">
        <div className="container">
          <h1 className="support-title">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="support-subtitle">
            Answers to common problems, with steps you can run yourself.
          </p>
        </div>
      </div>

      <div className="support-content container">
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
      </div>
    </div>
  );
}
