import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DOCS_URL, PROVIDERS, SUPPORT_EMAIL, VERSIONS } from '../site.config';
import '../Support.css';

interface Item {
  q: string;
  a: ReactNode;
  /** A page on the docs site, as [title, path]. */
  docs?: [string, string];
}

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: 'Getting started',
    items: [
      {
        q: 'What does beta mean?',
        a: (
          <>
            Mochiii works and is used daily, but some features and docs are still being finished. Expect changes between
            versions. Please report bugs to <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-link">{SUPPORT_EMAIL}</a>.
          </>
        ),
      },
      {
        q: 'How do I install Mochiii?',
        a: (
          <>
            For VS Code, install Mochiii from the VS Code Marketplace, or run{' '}
            <code>code --install-extension MochiiiAIAgent.mochiii-vscode</code>. For the terminal app, run{' '}
            <code>npm install -g mochiii</code> (it needs Node.js 18 or later), then run <code>mochiii</code> inside a
            project folder.
          </>
        ),
        docs: ['Install in VS Code', '/getting-started/install-vscode'],
      },
      {
        q: 'Which systems does it run on?',
        a: (
          <>
            The terminal app runs on Linux x64 and ARM64, macOS on Apple Silicon, and Windows x64; Windows on ARM runs the
            x64 build under Windows' emulation. The VS Code extension is for Linux x64 and Windows x64. Intel Macs are not
            supported.
          </>
        ),
        docs: ['Install the terminal app', '/getting-started/install-terminal'],
      },
      {
        q: 'How do I connect a model?',
        a: (
          <>
            The first run asks which AI provider to use, for its API key and for a model. Mochiii works with{' '}
            {PROVIDERS.length} providers, and for most of them it can tell the provider from the key. Switch at any time
            with <code>/provider</code> and <code>/model</code>.
          </>
        ),
        docs: ['Choosing a model', '/models/choosing-a-model'],
      },
      {
        q: 'Can I use a model on my own computer?',
        a: (
          <>
            Yes: Ollama, LM Studio, llama.cpp or vLLM, with no key. Start the server, then in the terminal app pick{' '}
            <strong>On this computer</strong> from <code>/provider</code>, or run <code>/connect local</code>. In VS Code,
            use the <code>mochiii.apiBase</code> and <code>mochiii.model</code> settings.
          </>
        ),
        docs: ['Local models', '/models/local-models'],
      },
      {
        q: 'Is Mochiii open source?',
        a: <>No. Mochiii is proprietary, all rights reserved. Versions already published under Apache-2.0 keep that licence.</>,
      },
    ],
  },
  {
    title: 'Using it',
    items: [
      {
        q: 'Does Mochiii change my files without asking?',
        a: (
          <>
            In VS Code, a new chat starts in <strong>Auto</strong>, which has full access inside the project: after a
            one-time warning it edits files, runs commands and tests, installs the project's packages and uses local git
            without asking. It still asks when it recognises going outside the project, sending something out or wiping
            data. Commands are not sandboxed, so use Auto only in projects you trust. In <strong>Manual</strong> every
            edit waits for your Apply, and <strong>Plan</strong> writes a plan with no edits, commands or network. In the
            terminal app, each edit is shown as a diff that you apply or skip, and a command waits for your approval,
            unless you turn on <code>/auto</code>; it is off every time Mochiii starts.
          </>
        ),
        docs: ['Approvals', '/using/approvals'],
      },
      {
        q: 'Why does a model on my computer use no tools?',
        a: (
          <>
            A model on your computer gets the code that matters with each question, and no tools, until you type{' '}
            <code>/agent on</code>. Mochiii then tries the model with a few small test questions and uses it the way it
            can: as a full agent, a compact agent, or for chat.
          </>
        ),
        docs: ['Local models', '/models/local-models'],
      },
      {
        q: 'Why are my terminal and VS Code chats separate?',
        a: (
          <>
            The terminal app (since 1.6.0) and the VS Code extension each keep their own chat, saved chats and search,
            and each terminal window has its own chat. The terminal app starts a new chat every time you launch it:{' '}
            <code>/save</code> a chat to keep it and <code>/resume</code> to reopen it. Your code index, saved rules and spending limits are still
            shared.
          </>
        ),
        docs: ['History and saved chats', '/using/history'],
      },
      {
        q: 'How do I start over, or shrink a long chat?',
        a: (
          <>
            <code>/clear</code> starts a new chat, and <code>/compact</code> shrinks a long one.
          </>
        ),
        docs: ['Commands', '/using/commands'],
      },
      {
        q: 'How do I add an MCP server?',
        a: (
          <>
            Pick one from the <Link to="/mcp" className="inline-link">MCP Marketplace</Link>, or in the terminal app type{' '}
            <code>/mcp</code>, press <code>a</code> and paste the JSON from the server's setup page. Its tools are ready on
            your next question.
          </>
        ),
        docs: ['Add an MCP server', '/mcp/add-a-server'],
      },
      {
        q: 'How do I keep spending under control?',
        a: (
          <>
            <code>/usage</code> shows tokens and cost from your provider's own bill, and <code>/budget</code> sets spending
            limits. When a session or a day reaches its limit, Mochiii stops and asks before going on.
          </>
        ),
        docs: ['Spending limits', '/features/spending-limits'],
      },
      {
        q: 'Can I attach files in VS Code?',
        a: <>Yes: PDFs (scanned ones too), Word, Excel, PowerPoint and images. They are read on your machine.</>,
        docs: ['VS Code', '/using/vscode'],
      },
    ],
  },
  {
    title: 'Troubleshooting',
    items: [
      {
        q: 'I updated one client and chats stopped saving.',
        a: (
          <>
            The terminal app and the VS Code extension keep chat memory in one file, and an older version can't use it once
            a newer one has upgraded it. VS Code extension {VERSIONS.extension} works with terminal app{' '}
            {VERSIONS.terminal} or later: update the terminal app first, run <code>mochiii -stop</code> in each folder you
            use it in, then reload VS Code.
          </>
        ),
        docs: ['Troubleshooting', '/troubleshooting'],
      },
      {
        q: 'Installed a Mochiii .vsix by hand?',
        a: (
          <>
            Uninstall it before installing from the Marketplace. VS Code will not replace a hand-installed build numbered
            1.1.0 to 1.6.1 with {VERSIONS.extension}.
          </>
        ),
      },
      {
        q: 'Code search is off after I installed.',
        a: (
          <>
            An install of 1.5.1 or earlier made after 19 November could not download the code-search engine. Update, then
            run <code>mochiii download-model</code>. On Linux, code search needs glibc 2.27 or newer; on Windows, the
            Microsoft Visual C++ runtime.
          </>
        ),
        docs: ['Troubleshooting', '/troubleshooting'],
      },
      {
        q: "An MCP server won't start.",
        a: (
          <>
            In the terminal app, <code>/mcp</code> lists every server and its state, the ones that need you first. A
            server that fails to start says why: a key with no value (with the command that sets it), or a Node.js version
            that is too old, for example.
          </>
        ),
        docs: ['Add an MCP server', '/mcp/add-a-server'],
      },
      {
        q: 'The model sent back an empty answer.',
        a: (
          <>
            Mochiii says so: "the model sent back an empty answer". Ask again, or pick another model with{' '}
            <code>/model</code>.
          </>
        ),
        docs: ['Troubleshooting', '/troubleshooting'],
      },
      {
        q: 'The mochiii command is not found after I installed it.',
        a: <>Open a new terminal: the one you installed from may not find the new command yet.</>,
        docs: ['Install the terminal app', '/getting-started/install-terminal'],
      },
      {
        q: 'Where are the logs?',
        a: (
          <>
            In <code>~/.local/state/mochiii/logs/</code>. Logs can contain file paths from your project, so check them
            before you send them to us.
          </>
        ),
        docs: ['Troubleshooting', '/troubleshooting'],
      },
    ],
  },
];

export default function Faq() {
  return (
    <div className="support-page">
      <div className="support-hero">
        <div className="container">
          <h1 className="support-title">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="support-subtitle">
            Short answers, each with a link to the docs. Still stuck? See <Link to="/support" className="inline-link">Support</Link>.
          </p>
        </div>
      </div>

      <div className="support-content container">
        {GROUPS.map((g) => (
          <section key={g.title} className="faq-group" aria-labelledby={`faq-${g.title}`}>
            <h2 id={`faq-${g.title}`}>{g.title}</h2>
            <div className="faq-list">
              {g.items.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <div className="faq-answer">
                    <p>{item.a}</p>
                    {item.docs && (
                      <p className="faq-docs">
                        Docs: <a href={DOCS_URL + item.docs[1]} className="inline-link">{item.docs[0]}</a>
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
