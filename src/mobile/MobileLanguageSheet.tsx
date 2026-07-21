import React, { useMemo } from 'react';
import { MobileBottomSheet } from './MobileBottomSheet';
import { useFlow } from '../context/FlowContext';
import type { Language } from '../types/flow';
import { FlagIcon } from './EmojiIcons';

/**
 * Mobile-language picker as a bottom sheet.
 * Lists 23 supported languages with flag SVGs (reuses the existing
 * `FlagIcon` component — no extra dependency). Same content as the
 * desktop `WinUIDialog`-based language picker, just mobile-shaped.
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

export const MobileLanguageSheet: React.FC<MobileLanguageSheetProps> = ({
  open,
  onClose,
}) => {
  const { language, setLanguage } = useFlow();

  const languages = useMemo(() => Object.keys(LANGUAGE_LABELS) as Language[], []);

  return (
    <MobileBottomSheet
      open={open}
      onClose={onClose}
      snapPoints={['60%', '90%']}
      initialSnap={0}
      title="🌐  Language"
      showHandle
    >
      <div className="m-section-title">
        ⚠️ Translations may not be 100% accurate
      </div>
      <div className="m-scroll m-flex-1" style={{ maxHeight: '70vh' }}>
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
              <FlagIcon code={code} size={22} />
              <span style={{ flex: 1 }}>{LANGUAGE_LABELS[code]}</span>
              {isActive && (
                <span style={{ color: '#2563eb', fontWeight: 800 }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </MobileBottomSheet>
  );
};
