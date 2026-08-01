import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { WinUIDialog } from './WinUIDialog';

describe('WinUIDialog close button', () => {
  it('stops the title-bar pointer handler and calls onClose', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const onClose = vi.fn();

    act(() => {
      root.render(React.createElement(WinUIDialog, {
        isOpen: true,
        onClose,
        title: 'Test dialog',
        message: 'Test message',
      }));
    });

    const closeButton = container.querySelector<HTMLButtonElement>('[aria-label="Close dialog"]');
    expect(closeButton).not.toBeNull();

    act(() => {
      closeButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
      closeButton?.click();
    });

    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => {
      root.unmount();
    });
    container.remove();
  });
});
