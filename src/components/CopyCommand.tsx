import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** A shell command on a dark strip, with a copy button. */
export default function CopyCommand({ command, label }: { command: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (insecure context, permissions). The
      // command is still on screen and selectable, so there is nothing to recover.
    }
  };

  return (
    <div className="install-box-terminal">
      <code>
        <span className="install-prompt" aria-hidden="true">$</span>
        {command}
      </code>
      <button type="button" className="install-box-copy" onClick={copy} aria-label={label}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
}
