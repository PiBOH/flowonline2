import React from 'react';
import { MobileBottomSheet } from './MobileBottomSheet';

export interface MobileActionMenuProps {
  open: boolean;
  onClose: () => void;
  hasSelection: boolean;
  hasCopiedBlock: boolean;
  language: 'en' | 'it' | 'de' | 'fr' | 'es' | 'zh' | 'ja' | 'ru' | 'ar' | string;
  onEdit: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
}

/**
 * Bottom-sheet that presents the same actions as the desktop Win32
 * right-click context menu.
 *
 * Triggers when a block is long-pressed inside MobileCanvasView.
 *
 * All actions call their corresponding FlowContext method then dismiss
 * the sheet automatically.
 */
export const MobileActionMenu: React.FC<MobileActionMenuProps> = ({
  open,
  onClose,
  hasSelection,
  hasCopiedBlock,
  language,
  onEdit,
  onCopy,
  onCut,
  onPaste,
  onDelete,
}) => {
  // Tiny inline translator — keeps the menu text short and unaffected
  // by the larger App-level translations catalog (we only need 5 strings).
  const t = (en: string, it: string) => (language === 'it' ? it : en);

  const ACTIONS = [
    {
      key: 'edit',
      label: t('Edit', 'Modifica'),
      icon: '✎',
      disabled: !hasSelection,
      onClick: () => { onEdit(); onClose(); },
    },
    {
      key: 'copy',
      label: t('Copy', 'Copia'),
      icon: '⧉',
      disabled: !hasSelection,
      onClick: () => { onCopy(); onClose(); },
    },
    {
      key: 'cut',
      label: t('Cut', 'Taglia'),
      icon: '✂',
      disabled: !hasSelection,
      onClick: () => { onCut(); onClose(); },
    },
    {
      key: 'paste',
      label: t('Paste', 'Incolla'),
      icon: '⎘',
      disabled: !hasCopiedBlock,
      onClick: () => { onPaste(); onClose(); },
    },
    {
      key: 'delete',
      label: t('Delete', 'Elimina'),
      icon: '🗑',
      disabled: !hasSelection,
      onClick: () => { onDelete(); onClose(); },
      danger: true,
    },
  ] as const;

  return (
    <MobileBottomSheet
      open={open}
      onClose={onClose}
      snapPoints={['40%', '85%']}
      initialSnap={0}
      showHandle
      dismissThreshold={80}
    >
      <div className="m-section-title">{t('Block actions', 'Azioni blocco')}</div>
      {ACTIONS.map((a) => (
        <button
          key={a.key}
          type="button"
          className={`m-row${a.danger ? ' danger' : ''}`}
          disabled={a.disabled}
          onClick={a.onClick}
          style={a.disabled ? { opacity: 0.35, cursor: 'not-allowed' } : undefined}
        >
          <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{a.icon}</span>
          <span style={{ flex: 1 }}>{a.label}</span>
        </button>
      ))}
    </MobileBottomSheet>
  );
};
