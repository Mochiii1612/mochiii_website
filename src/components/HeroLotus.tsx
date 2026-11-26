import { useEffect, useState } from 'react';
import still520 from '../assets/lotus-still-520.webp';
import still1040 from '../assets/lotus-still-1040.webp';

/** What the six petal labels say, also given to screen readers as a list. */
const PETAL_LABELS = ['Knows your codebase', 'VS Code', 'Terminal app', 'Agent mode', 'Long tasks', 'MCP servers'];

/**
 * The hero's lotus. A still image (a frame of the same 3D view) shows at
 * once. The 3D viewer, with its labels and its slow turn, is added only after
 * the page has loaded and painted, on every screen size, and fades in over
 * the still once it has drawn the lotus; until then, or if it fails, the
 * still stays. With reduced motion asked for, the viewer does not turn.
 */
export default function HeroLotus() {
  const [load3d, setLoad3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let raf = 0;
    // Two frames after load: the page has painted with the still in place.
    const afterPaint = () => {
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => setLoad3d(true));
      });
    };
    if (document.readyState === 'complete') afterPaint();
    else window.addEventListener('load', afterPaint, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', afterPaint);
    };
  }, []);

  useEffect(() => {
    if (!load3d) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; ready?: boolean } | null;
      if (data?.type !== 'mochiii-lotus') return;
      if (data.ready) setReady(true);
      else setFailed(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [load3d]);

  return (
    <div className="hero-stage">
      <div className="hero-stage-glow" aria-hidden="true" />
      <div className={`splat-container${ready && !failed ? ' is-3d' : ''}`}>
        <img
          className="lotus-still"
          src={still520}
          srcSet={`${still520} 520w, ${still1040} 1040w`}
          sizes="(max-width: 767.98px) 340px, 520px"
          width={520}
          height={520}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
        {load3d && !failed && (
          <iframe
            src="/spz-viewer/index.html"
            title="The Mochiii lotus in 3D"
            className="splat-iframe"
            tabIndex={-1}
            aria-hidden="true"
          />
        )}
      </div>
      <ul className="visually-hidden">
        {PETAL_LABELS.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
    </div>
  );
}
