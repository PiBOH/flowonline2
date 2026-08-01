import { useEffect, useState } from 'react';

/**
 * Reactive viewport hook.
 * Returns `true` for narrow viewports and touch devices such as phones or
 * tablets in landscape orientation. Falls back to `false` during SSR-safe
 * initialization.
 */
export function useViewport(breakpointPx: number = 767): { isMobile: boolean; width: number } {
  const isCoarsePointer = (): boolean => {
    if (typeof window === 'undefined') return false;
    const touchPoints = typeof navigator !== 'undefined' ? navigator.maxTouchPoints : 0;
    const coarseMedia = typeof window.matchMedia === 'function'
      ? window.matchMedia('(pointer: coarse)').matches
      : false;
    return touchPoints > 0 || coarseMedia;
  };

  const getMatch = (): boolean => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const shortestSide = Math.min(width, height);
    const isPortrait = height >= width;
    return isPortrait && (width <= breakpointPx || (isCoarsePointer() && shortestSide <= 1024));
  };

  const [isMobile, setIsMobile] = useState<boolean>(getMatch);
  const [width, setWidth] = useState<number>(
    typeof window === 'undefined' ? 1024 : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const shortestSide = Math.min(w, h);
      const isPortrait = h >= w;
      setWidth(w);
      setIsMobile(isPortrait && (w <= breakpointPx || (isCoarsePointer() && shortestSide <= 1024)));
    };

    // Use matchMedia when available, with resize/orientation listeners as the
    // compatibility path for older browsers and embedded webviews.
    const mql = typeof window.matchMedia === 'function'
      ? window.matchMedia(`(max-width: ${breakpointPx}px)`)
      : null;
    const onChange = () => update();
    if (mql) {
      if (mql.addEventListener) {
        mql.addEventListener('change', onChange);
      } else {
        // Safari < 14 fallback
        mql.addListener(onChange);
      }
    }

    // Initial sync (covers the case where initial state was rendered before the listener attached)
    update();
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', update, { passive: true });

    return () => {
      if (mql) {
        if (mql.removeEventListener) {
          mql.removeEventListener('change', onChange);
        } else {
          mql.removeListener(onChange);
        }
      }
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [breakpointPx]);

  return { isMobile, width };
}
