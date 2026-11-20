import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { INSTALL_ITEMS } from '../installItems';

export default function InstallMenu() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // A new page closes the menu.
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  // A click or tap anywhere outside closes it, and so does the window losing focus.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onBlur = () => setOpen(false);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('blur', onBlur);
    };
  }, [open]);

  const focusItem = (i: number) => {
    const n = INSTALL_ITEMS.length;
    itemRefs.current[((i % n) + n) % n]?.focus();
  };

  const onButtonKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      const first = e.key === 'ArrowDown' ? 0 : INSTALL_ITEMS.length - 1;
      requestAnimationFrame(() => focusItem(first));
    } else if (e.key === 'Escape' && open) {
      setOpen(false);
    }
  };

  const onMenuKey = (e: KeyboardEvent) => {
    const at = itemRefs.current.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusItem(at + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusItem(at - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusItem(INSTALL_ITEMS.length - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className="nav-install" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="nav-cta"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="nav-install-menu"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKey}
      >
        Install
        <ChevronDown size={14} className={`nav-install-chevron ${open ? 'open' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div id="nav-install-menu" className="nav-install-menu" role="menu" aria-label="Install" onKeyDown={onMenuKey}>
          {INSTALL_ITEMS.map((item, i) => {
            const body = (
              <>
                <span className="nav-install-label">{item.label}</span>
                <span className="nav-install-detail">{item.detail}</span>
              </>
            );
            const ref = (el: HTMLAnchorElement | null) => {
              itemRefs.current[i] = el;
            };
            return 'href' in item ? (
              <a key={item.key} ref={ref} href={item.href} role="menuitem" className="nav-install-item">
                {body}
              </a>
            ) : (
              <Link key={item.key} ref={ref} to={item.to} role="menuitem" className="nav-install-item" onClick={() => setOpen(false)}>
                {body}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
