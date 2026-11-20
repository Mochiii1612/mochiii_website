/** Everything on the site that goes stale when a release ships lives here. */
export const INSTALL_STATEMENT = 'One command installs Mochiii on any OS.';
export const INSTALL_OSES = ['macOS', 'Linux', 'Windows'];
export const INSTALL_COMMAND = 'npm install -g mochiii';
/** One line under the command. Keep it to facts the release files back up. */
export const INSTALL_NOTE = 'Needs Node.js 18 or later. The same command on every system.';

/** The documentation site, linked from the nav and the footer. */
export const DOCS_URL = 'https://docs.mochiii.in';

/** The VS Code extension: its Marketplace page, and the command that installs it. */
export const MARKETPLACE_URL = 'https://marketplace.visualstudio.com/items?itemName=MochiiiAIAgent.mochiii-vscode';
export const VSCODE_INSTALL_COMMAND = 'code --install-extension MochiiiAIAgent.mochiii-vscode';

/**
 * Footer social links. An icon is drawn only for an entry whose url is set,
 * so a new channel is one line here. No GitHub entry: the site links to no
 * GitHub page.
 */
export const SOCIAL_LINKS: ReadonlyArray<{ name: 'LinkedIn' | 'X' | 'Reddit' | 'Discord'; url: string }> = [
  { name: 'LinkedIn', url: '' },
  { name: 'X', url: '' },
  { name: 'Reddit', url: '' },
  { name: 'Discord', url: '' },
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
