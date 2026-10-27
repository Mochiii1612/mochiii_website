import { PROVIDERS } from '../site.config';

// Mono logo files; they use currentColor, so they follow the page theme.
const logos = import.meta.glob('../assets/providers/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const FILE_FOR: Record<(typeof PROVIDERS)[number], string> = {
  OpenRouter: 'openrouter',
  OpenAI: 'openai',
  Anthropic: 'anthropic',
  'Google Gemini': 'gemini',
  NVIDIA: 'nvidia',
  Groq: 'groq',
  DeepSeek: 'deepseek',
  xAI: 'xai',
  Mistral: 'mistral',
  Together: 'together',
  Fireworks: 'fireworks',
  Cerebras: 'cerebras',
  Moonshot: 'moonshot',
  'Hugging Face': 'huggingface',
  SambaNova: 'sambanova',
  DashScope: 'alibabacloud',
  'Z.ai': 'zai',
};

export default function ProviderLogos() {
  return (
    <ul className="provider-logos">
      {PROVIDERS.map((name) => {
        const svg = logos[`../assets/providers/${FILE_FOR[name]}.svg`] ?? '';
        return (
          <li key={name} className="provider-logo">
            <span className="provider-logo-mark" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />
            <span className="provider-logo-name">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
