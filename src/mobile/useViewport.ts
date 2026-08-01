import { useEffect, useState } from 'react';

export interface ViewportEnvironment {
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}

/**
 * Decide whether the shared mobile surface should be mounted.
 *
 * A narrow viewport alone is deliberately not enough: desktop browsers can
 * be resized to the same CSS dimensions. Device identity (mobile UA or
 * iPadOS desktop-mode platform), touch capability, and compact CSS dimensions
 * are combined so a resized desktop window stays on the desktop layout.
 */
export function shouldUseMobileSurface(
  environment: ViewportEnvironment,
  breakpointPx = 767,
): boolean {
  const {
    width,
    height,
    screenWidth,
    screenHeight,
    userAgent,
    platform,
    maxTouchPoints,
  } = environment;

  const ua = userAgent.toLowerCase();
  const normalizedPlatform = platform.toLowerCase();
  const mobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/.test(ua);

  // iPadOS 13+ can advertise itself as macOS. Touch is the distinguishing
  // signal that prevents ordinary Macs from being classified as iPads.
  const iPadDesktopMode =
    (normalizedPlatform === 'macintel' || normalizedPlatform === 'macppc') &&
    maxTouchPoints > 0;

  if (!mobileUserAgent && !iPadDesktopMode) return false;

  const viewportShortestSide = Math.min(width, height);
  const usableScreenWidth = screenWidth > 0 ? screenWidth : width;
  const usableScreenHeight = screenHeight > 0 ? screenHeight : height;
  const screenShortestSide = Math.min(usableScreenWidth, usableScreenHeight);
  const compactCssDimensions =
    width <= breakpointPx ||
    viewportShortestSide <= 1024 ||
    screenShortestSide <= 1024;

  // The rotated presentation is only needed for portrait devices. A mobile
  // device already in landscape should remain landscape and must not rotate a
  // second time.
  return compactCssDimensions && height >= width;
}

const readEnvironment = (): ViewportEnvironment => {
  if (typeof window === 'undefined') {
    return {
      width: 1024,
      height: 768,
      screenWidth: 1024,
      screenHeight: 768,
      userAgent: '',
      platform: '',
      maxTouchPoints: 0,
    };
  }

  const browserNavigator = typeof navigator === 'undefined' ? undefined : navigator;
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    screenWidth: window.screen?.width ?? window.innerWidth,
    screenHeight: window.screen?.height ?? window.innerHeight,
    userAgent: browserNavigator?.userAgent ?? '',
    platform: browserNavigator?.platform ?? '',
    maxTouchPoints: browserNavigator?.maxTouchPoints ?? 0,
  };
};

/**
 * Reactive viewport hook. It updates for resize and orientation changes and
 * remains safe in SSR-like environments where window is unavailable.
 */
export function useViewport(breakpointPx: number = 767): { isMobile: boolean; width: number } {
  const getEnvironment = (): ViewportEnvironment => readEnvironment();
  const getMatch = (): boolean => shouldUseMobileSurface(getEnvironment(), breakpointPx);

  const [isMobile, setIsMobile] = useState<boolean>(getMatch);
  const [width, setWidth] = useState<number>(getEnvironment().width);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const environment = getEnvironment();
      setWidth(environment.width);
      setIsMobile(shouldUseMobileSurface(environment, breakpointPx));
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
        mql.addListener(onChange);
      }
    }

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
