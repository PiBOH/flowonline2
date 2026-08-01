import { describe, expect, it } from 'vitest';
import { shouldUseMobileSurface, type ViewportEnvironment } from './useViewport';

const environment = (overrides: Partial<ViewportEnvironment> = {}): ViewportEnvironment => ({
  width: 390,
  height: 844,
  screenWidth: 390,
  screenHeight: 844,
  userAgent: '',
  platform: '',
  maxTouchPoints: 0,
  ...overrides,
});

describe('shouldUseMobileSurface', () => {
  it('does not classify a resized desktop browser as mobile', () => {
    expect(shouldUseMobileSurface(environment({
      width: 390,
      height: 844,
      screenWidth: 1920,
      screenHeight: 1080,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36',
      platform: 'Win32',
    }))).toBe(false);
  });

  it('does not classify a desktop touchscreen with a compact window as mobile', () => {
    expect(shouldUseMobileSurface(environment({
      screenWidth: 2560,
      screenHeight: 1440,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36',
      platform: 'Win32',
      maxTouchPoints: 10,
    }))).toBe(false);
  });

  it('classifies an Android phone in portrait as mobile', () => {
    expect(shouldUseMobileSurface(environment({
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36',
      platform: 'Linux armv8l',
      maxTouchPoints: 5,
    }))).toBe(true);
  });

  it('classifies a mobile emulator with a mobile UA even without touch points', () => {
    expect(shouldUseMobileSurface(environment({
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36',
      platform: 'Linux armv8l',
      maxTouchPoints: 0,
    }))).toBe(true);
  });

  it('classifies an iPhone in portrait as mobile', () => {
    expect(shouldUseMobileSurface(environment({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1',
      platform: 'iPhone',
      maxTouchPoints: 5,
    }))).toBe(true);
  });

  it('classifies iPadOS desktop-mode Safari using MacIntel plus touch', () => {
    expect(shouldUseMobileSurface(environment({
      width: 820,
      height: 1180,
      screenWidth: 820,
      screenHeight: 1180,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    }))).toBe(true);
  });

  it('keeps a Mac desktop with no touch points on the desktop layout', () => {
    expect(shouldUseMobileSurface(environment({
      width: 820,
      height: 1180,
      screenWidth: 2560,
      screenHeight: 1440,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15',
      platform: 'MacIntel',
      maxTouchPoints: 0,
    }))).toBe(false);
  });

  it('does not rotate a mobile device that is already in landscape', () => {
    expect(shouldUseMobileSurface(environment({
      width: 844,
      height: 390,
      screenWidth: 844,
      screenHeight: 390,
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36',
      platform: 'Linux armv8l',
      maxTouchPoints: 5,
    }))).toBe(false);
  });

  it('falls back to viewport dimensions when screen dimensions are unavailable', () => {
    expect(shouldUseMobileSurface(environment({
      screenWidth: 0,
      screenHeight: 0,
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36',
      platform: 'Linux armv8l',
      maxTouchPoints: 5,
    }))).toBe(true);
  });
});
