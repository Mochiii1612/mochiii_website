import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element with a fade + slide-up transition the first time it
 * scrolls into the viewport. Pair the returned `ref` with an element that
 * has the `.reveal` class and toggle `.reveal-visible` when `isVisible`
 * flips true.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
