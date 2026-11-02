import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { INSTALL_COMMAND, INSTALL_NOTE, INSTALL_OSES, INSTALL_STATEMENT } from '../site.config';

/** Install box: one universal npm command, with a copy button. */
export default function InstallTabs() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (insecure context, permissions). The
      // command is still on screen and selectable, so there is nothing to recover.
    }
  };

  return (
    <div className="install-box">
      <div className="install-box-label">
        <Terminal size={13} aria-hidden="true" />
        <span>{INSTALL_STATEMENT}</span>
      </div>

      <div className="install-os-row">{INSTALL_OSES.join(' · ')}</div>

      <div className="install-box-terminal">
        <code>
          <span className="install-prompt" aria-hidden="true">$</span>
          {INSTALL_COMMAND}
        </code>
        <button className="install-box-copy" onClick={copy} aria-label="Copy install command">
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      <div className="install-box-footer install-note">
        <span>{INSTALL_NOTE}</span>
      </div>
    </div>
  );
}
