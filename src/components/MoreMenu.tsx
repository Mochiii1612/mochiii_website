import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

/** The pages behind "More" in the top navigation. */
const ITEMS = [
  { to: '/mcp', label: 'MCP Marketplace' },
  { to: '/faq', label: 'FAQs' },
  { to: '/supporters', label: 'Supporters' },
];

export default function MoreMenu() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const here = ITEMS.some((i) => i.to === location.pathname);

  // A new page closes the menu.
  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  // A click or tap anywhere outside closes it. A click inside an iframe (the
  // home page's 3D viewer is one) never reaches this document, but it does take
  // focus from the window, so that closes it too.
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
    const n = ITEMS.length;
    itemRefs.current[((i % n) + n) % n]?.focus();
  };

  const onButtonKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      const first = e.key === 'ArrowDown' ? 0 : ITEMS.length - 1;
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
      focusItem(ITEMS.length - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className="nav-more" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`nav-link nav-more-btn ${here ? 'active' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="nav-more-menu"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKey}
      >
        More
        <ChevronDown size={14} className={`nav-more-chevron ${open ? 'open' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div id="nav-more-menu" className="nav-more-menu" role="menu" aria-label="More" onKeyDown={onMenuKey}>
          {ITEMS.map((item, i) => (
            <Link
              key={item.to}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              to={item.to}
              role="menuitem"
              className="nav-more-item"
              aria-current={location.pathname === item.to ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
