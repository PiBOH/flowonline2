import React, { useEffect } from 'react';

export const M2MenuIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const M2CloseIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const M2IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...props }) => (
  <button type="button" className={`m2-icon-button ${className}`} {...props}>{children}</button>
);

export const M2Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'text' | 'outlined' | 'contained' }> = ({ variant = 'text', className = '', children, ...props }) => (
  <button type="button" className={`m2-button m2-button--${variant} ${className}`} {...props}>{children}</button>
);

export const M2Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <section className={`m2-card ${className}`} {...props}>{children}</section>
);

export interface M2DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
  ariaLabel?: string;
}

export const M2Dialog: React.FC<M2DialogProps> = ({ open, title, onClose, children, actions, ariaLabel }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="m2-modal-layer" role="presentation">
      <button type="button" className="m2-modal-scrim" aria-label="Close dialog" onClick={onClose} />
      <section className="m2-dialog" role="dialog" aria-modal="true" aria-label={ariaLabel || title}>
        <header className="m2-dialog__header">
          <h2>{title}</h2>
          <M2IconButton aria-label="Close dialog" onClick={onClose}><M2CloseIcon size={20} /></M2IconButton>
        </header>
        <div className="m2-dialog__content">{children}</div>
        {actions && <footer className="m2-dialog__actions">{actions}</footer>}
      </section>
    </div>
  );
};

export interface M2DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const M2Drawer: React.FC<M2DrawerProps> = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <button type="button" className="m2-drawer__scrim is-open" aria-label="Close navigation drawer" onClick={onClose} />
      <aside className="m2-drawer is-open" aria-label="Navigation drawer">{children}</aside>
    </>
  );
};

export interface M2BottomNavProps {
  value: string;
  items: Array<{ id: string; label: string; icon: React.ReactNode }>;
  onChange: (id: string) => void;
}

export const M2BottomNav: React.FC<M2BottomNavProps> = ({ value, items, onChange }) => (
  <nav className="m2-bottom-nav" aria-label="Primary navigation">
    {items.map((item) => (
      <button key={item.id} type="button" className={`m2-bottom-nav__item ${value === item.id ? 'is-active' : ''}`} onClick={() => onChange(item.id)} aria-current={value === item.id ? 'page' : undefined}>
        <span className="m2-bottom-nav__icon">{item.icon}</span>
        <span>{item.label}</span>
      </button>
    ))}
  </nav>
);

export const M2Snackbar: React.FC<{ message: string; tone?: 'success' | 'error' }> = ({ message, tone = 'success' }) => (
  <div className={`m2-snackbar m2-snackbar--${tone}`} role="status" aria-live="polite">{message}</div>
);
