import { useEffect, useState } from 'react';
import still452 from '../assets/lotus-still-452.webp';
import still904 from '../assets/lotus-still-904.webp';

/** Narrower than this, or with reduced motion asked for, the 3D viewer is never downloaded. */
const STILL_ONLY = '(max-width: 767.98px), (prefers-reduced-motion: reduce)';

/**
 * The hero's lotus. A still image (a frame of the same 3D scene) shows at
 * once. On a wide screen without reduced motion, the 3D viewer is added only
 * after the page has loaded and painted, and fades in over the still once it
 * has drawn the lotus; until then, or if it fails, the still stays.
 */
export default function HeroLotus() {
  const [load3d, setLoad3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const stillOnly = window.matchMedia(STILL_ONLY);
    let painted = false;
    let raf = 0;
    const maybeLoad = () => {
      if (painted && !stillOnly.matches) setLoad3d(true);
    };
    // Two frames after load: the page has painted with the still in place.
    const afterPaint = () => {
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          painted = true;
          maybeLoad();
        });
      });
    };
    if (document.readyState === 'complete') afterPaint();
    else window.addEventListener('load', afterPaint, { once: true });
    stillOnly.addEventListener('change', maybeLoad);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', afterPaint);
      stillOnly.removeEventListener('change', maybeLoad);
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
          src={still452}
          srcSet={`${still452} 452w, ${still904} 904w`}
          sizes="(max-width: 894px) 296px, (max-width: 1368px) 33vw, 452px"
          width={452}
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
    </div>
  );
}
