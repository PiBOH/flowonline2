import React, { useState, useEffect, useRef } from 'react';

/**
 * Shared status indicator.
 *
 * Default state: a tiny colored dot (8px). No text in the DOM.
 * On hover / focus: smoothly grows into a pill containing the `label`.
 * On tap (touch devices): shows the label briefly, then auto-collapses
 * after 2.4s. Re-tapping before collapse starts a new 2.4s window.
 *
 * The dot color is the source of truth for state at rest:
 *   - `live`     → green   (file loaded fresh from remote repo)
 *   - `fallback` → amber   (loaded from local hardcoded fallback)
 *   - `done`     → blue    (informational, neutral outcome)
 *   - `error`    → red     (load failed)
 *   - `info`     → slate   (neutral, no semantic meaning)
 *
 * No text in the DOM at rest means no horizontal-strip intrusion —
 * users see the dot, and only when they care to hover / tap do they
 * get the explanation. This was the explicit user requirement.
 */

export type StatusVariant = 'live' | 'fallback' | 'done' | 'error' | 'info';

export interface StatusDotProps {
  variant: StatusVariant;
  label: string;
  /** When true, dot glows to draw extra attention (use for `live` from network). */
  glow?: boolean;
  /** Exposed to allow consumers to mirror the dot in a different location if needed. */
  size?: number;
}

const COLOR: Record<StatusVariant, string> = {
  live: '#16a34a',
  fallback: '#d97706',
  done: '#2563eb',
  error: '#dc2626',
  info: '#64748b',
};

const TOUCH_HOLD_MS = 2400;

export const StatusDot: React.FC<StatusDotProps> = ({
  variant,
  label,
  glow = false,
  size = 8,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [touchHeld, setTouchHeld] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Auto-collapse tactile tap after TOUCH_HOLD_MS; cancel on outside click.
  useEffect(() => {
    if (!touchHeld) return;
    const t = window.setTimeout(() => setTouchHeld(false), TOUCH_HOLD_MS);
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setTouchHeld(false);
      }
    };
    document.addEventListener('click', onDocClick, { capture: true });
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('click', onDocClick, { capture: true });
    };
  }, [touchHeld]);

  const isOpen = expanded || touchHeld;
  const c = COLOR[variant];

  return (
    <div
      ref={wrapRef}
      role="status"
      aria-label={label}
      tabIndex={0}
      className="status-dot"
      data-variant={variant}
      data-open={isOpen ? 'true' : 'false'}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      onClick={(e) => {
        // Stops the surrounding row from also firing its click handler.
        e.stopPropagation();
        setTouchHeld(true);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setTouchHeld(true);
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 18,
        padding: isOpen ? '0 8px' : '0',
        background: isOpen ? `${c}1f` : 'transparent',
        borderRadius: 999,
        cursor: 'help',
        userSelect: 'none',
        outline: 'none',
        transition: 'padding 180ms cubic-bezier(.4,0,.2,1), background-color 180ms ease',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          background: c,
          opacity: isOpen ? 1 : 0.95,
          transform: isOpen ? 'scale(1.15)' : 'scale(1)',
          boxShadow: glow || isOpen ? `0 0 6px ${c}88` : 'none',
          transition: 'transform 180ms cubic-bezier(.4,0,.2,1), box-shadow 180ms ease, opacity 180ms ease',
          flexShrink: 0,
        }}
      />
      <span
        aria-hidden={isOpen ? 'false' : 'true'}
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: c,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          maxWidth: isOpen ? 320 : 0,
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-width 220ms cubic-bezier(.4,0,.2,1), opacity 180ms ease',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default StatusDot;
