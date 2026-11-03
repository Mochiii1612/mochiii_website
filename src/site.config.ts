/** Everything on the site that goes stale when a release ships lives here. */
export const INSTALL_STATEMENT = 'One command installs Mochiii on any OS.';
export const INSTALL_OSES = ['macOS', 'Linux', 'Windows'];
export const INSTALL_COMMAND = 'npm install -g mochiii';
/** One line under the command. Keep it to facts the release files back up. */
export const INSTALL_NOTE = 'Needs Node.js 18 or later. The same command on every system.';

/** The documentation site, linked from the nav and the footer. */
export const DOCS_URL = 'https://docs.mochiii.in';

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
