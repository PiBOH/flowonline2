import { useEffect, useState } from 'react';

/**
 * Reactive viewport hook.
 * Returns `true` when the viewport width is ≤ the breakpoint (default: 767px → mobile).
 * Falls back to `false` during SSR-safe initialization.
 */
export function useViewport(breakpointPx: number = 767): { isMobile: boolean; width: number } {
  const getMatch = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpointPx;
  };

  const [isMobile, setIsMobile] = useState<boolean>(getMatch);
  const [width, setWidth] = useState<number>(
    typeof window === 'undefined' ? 1024 : window.innerWidth
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const w = window.innerWidth;
      setWidth(w);
      setIsMobile(w <= breakpointPx);
    };

    // matchMedia listener (preferred — no resize-event thrash on tablets/keyboards)
    const mql = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const onChange = () => update();
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
    } else {
      // Safari < 14 fallback
      mql.addListener(onChange);
    }

    // Initial sync (covers the case where initial state was rendered before the listener attached)
    update();

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange);
      } else {
        mql.removeListener(onChange);
      }
    };
  }, [breakpointPx]);

  return { isMobile, width };
}
