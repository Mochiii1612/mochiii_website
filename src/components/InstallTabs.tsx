import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { INSTALL_TARGETS, type InstallTargetId } from '../site.config';

function defaultTarget(): InstallTargetId {
  if (typeof navigator !== 'undefined' && /windows/i.test(navigator.userAgent)) return 'windows';
  return 'unix';
}

/**
 * Tabbed install box. One command per surface, with a copy button.
 * Used in the hero and again in the install section.
 */
export default function InstallTabs({ idPrefix }: { idPrefix: string }) {
  const [active, setActive] = useState<InstallTargetId>(defaultTarget);
  const [copied, setCopied] = useState(false);
  const target = INSTALL_TARGETS.find((t) => t.id === active) ?? INSTALL_TARGETS[0];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(target.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (insecure context, permissions). The
      // command is still on screen and selectable, so there is nothing to recover.
    }
  };

  return (
    <div className="install-box">
      <div className="install-box-label install-tabs" role="tablist" aria-label="Install method">
        <Terminal size={13} aria-hidden="true" />
        {INSTALL_TARGETS.map((t) => (
          <button
            key={t.id}
            id={`${idPrefix}-tab-${t.id}`}
            role="tab"
            aria-selected={active === t.id}
            aria-controls={`${idPrefix}-panel`}
            className={`install-tab${active === t.id ? ' active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id={`${idPrefix}-panel`}
        role="tabpanel"
        aria-labelledby={`${idPrefix}-tab-${target.id}`}
        className="install-box-terminal"
      >
        <code>
          <span className="install-prompt" aria-hidden="true">{target.id === 'windows' ? 'PS>' : '$'}</span>
          {target.command}
        </code>
        <button className="install-box-copy" onClick={copy} aria-label="Copy install command">
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      <div className="install-box-footer install-note">
        <span>{target.note}</span>
      </div>
    </div>
  );
}
