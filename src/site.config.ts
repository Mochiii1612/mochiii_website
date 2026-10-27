/** Everything on the site that goes stale when a release ships lives here. */
export const REPO_URL = 'https://github.com/Rav-2007/codeterminal-core';

const LATEST_RELEASE = `${REPO_URL}/releases/latest/download`;

export const EXTENSION_ID = 'MochiiiAIAgent.mochiii-vscode';
export const MARKETPLACE_URL = `https://marketplace.visualstudio.com/items?itemName=${EXTENSION_ID}`;

export type InstallTargetId = 'unix' | 'windows' | 'npm' | 'vscode';

export interface InstallTarget {
  id: InstallTargetId;
  label: string;
  command: string;
  /** One line under the command. Keep it to facts the release files back up. */
  note: string;
}

/**
 * The VS Code note is where the Marketplace/terminal-app version gap is
 * admitted. Once a current extension is published, update or drop that sentence.
 */
export const INSTALL_TARGETS: InstallTarget[] = [
  {
    id: 'unix',
    label: 'macOS · Linux',
    command: `curl -fsSL ${LATEST_RELEASE}/install.sh | sh`,
    note: 'Terminal app for Apple silicon macs and Linux (x64, arm64). Verifies the release checksums and needs no admin rights.',
  },
  {
    id: 'windows',
    label: 'Windows',
    command: `powershell -ExecutionPolicy ByPass -c "irm ${LATEST_RELEASE}/install.ps1 | iex"`,
    note: 'Terminal app for Windows x64. Run it in PowerShell. Release binaries are not code-signed; see Limits.',
  },
  {
    id: 'npm',
    label: 'npm',
    command: 'npm install -g mochiii',
    note: 'Needs Node.js 18 or later. The same command on every system.',
  },
  {
    id: 'vscode',
    label: 'VS Code',
    command: `code --install-extension ${EXTENSION_ID}`,
    note: 'Linux x64 and Windows x64 only. The Marketplace listing can trail the terminal app.',
  },
];

export const PROVIDERS = [
  'OpenRouter',
  'OpenAI',
  'Anthropic',
  'Google Gemini',
  'NVIDIA',
  'Groq',
  'DeepSeek',
  'xAI',
  'Mistral',
  'Together',
  'Fireworks',
  'Cerebras',
  'Moonshot',
  'Hugging Face',
  'SambaNova',
  'DashScope',
  'Z.ai',
] as const;

/**
 * Where the waitlist form posts `{ email }` as JSON (a Formspree, Buttondown or
 * similar endpoint). Empty means the form is not connected yet and says so.
 */
export const WAITLIST_ENDPOINT = '';
