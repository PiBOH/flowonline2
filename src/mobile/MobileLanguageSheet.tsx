import React, { useMemo } from 'react';
import { MobileBottomSheet } from './MobileBottomSheet';
import { useFlow } from '../context/FlowContext';
import type { Language } from '../types/flow';
import { FlagIcon } from '../components/EmojiIcons';

/**
 * Mobile-language picker as a bottom sheet (Phase 3 rewrite).
 * Lists 23 supported languages with flag SVGs (reuses the existing
 * `FlagIcon` component — no extra dependency).
 */
export interface MobileLanguageSheetProps {
  open: boolean;
  onClose: () => void;
}

const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English (US)',
  en_GB: 'English (UK)',
  it: 'Italiano',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  zh: '中文',
  nl: 'Nederlands',
  pt: 'Português',
  gl: 'Galego',
  ru: 'Русский',
  uk: 'Українська',
  cs: 'Čeština',
  pl: 'Polski',
  hu: 'Magyar',
  sl: 'Slovenščina',
  ja: '日本語',
  th: 'ไทย',
  id: 'Bahasa Indonesia',
  mn: 'Монгол',
  ar: 'العربية',
  he: 'עברית',
  fa: 'فارسی',
};

export const MobileLanguageSheet: React.FC<MobileLanguageSheetProps> = ({ open, onClose }) => {
  const { language, setLanguage } = useFlow() as any;

  const languages = useMemo(() => Object.keys(LANGUAGE_LABELS) as Language[], []);

  return (
    <MobileBottomSheet
      open={open}
      onClose={onClose}
      snapPoints={['60%', '90%']}
      initialSnap={0}
      title="🌐 Language"
      showHandle
    >
      <div className="m-section-title" style={{ color: '#dc2626', fontWeight: 700 }}>
        ⚠ Translations may not be 100% accurate
      </div>
      <div className="m-scroll" style={{ maxHeight: '70vh' }}>
        {languages.map((code) => {
          const isActive = code === language;
          return (
            <button
              key={code}
              type="button"
              className="m-row"
              onClick={() => {
                setLanguage(code);
                onClose();
              }}
              style={
                isActive
                  ? { background: 'rgba(37, 99, 235, 0.10)', fontWeight: 700 }
                  : undefined
              }
            >
              <span className="m-row__icon"><FlagIcon code={code} size={22} /></span>
              <span className="m-row__label">{LANGUAGE_LABELS[code]}</span>
              {isActive && (
                <span style={{ color: 'var(--m-accent)', fontWeight: 800 }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </MobileBottomSheet>
  );
};
