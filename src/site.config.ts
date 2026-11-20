/** Everything on the site that goes stale when a release ships lives here. */
/** The terminal app, installed with npm. */
export const INSTALL_COMMAND = 'npm install -g mochiii';
export const NODE_REQUIREMENT = 'Needs Node.js 18 or later.';

/** Where each client runs (core README, "Platform support"). */
export const PLATFORMS = {
  terminal: 'Terminal app: Linux x64 and ARM64, macOS on Apple Silicon, and Windows x64 (Windows on ARM runs it through emulation).',
  vscode: 'VS Code extension: Linux x64 and Windows x64.',
  note: 'Intel Macs are not supported.',
} as const;

/** Where people write to us. Each address is used everywhere from here. */
export const SUPPORT_EMAIL = 'supportmochiii@gmail.com';
/** Security reports only (three i's). */
export const SECURITY_EMAIL = 'mochiiijuly@gmail.com';

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
