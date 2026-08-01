import React, { useMemo } from 'react';
import { useFlow } from '../context/FlowContext';
import type { Language } from '../types/flow';
import { FlagIcon } from '../components/EmojiIcons';
import { M2Button, M2Dialog } from './Material2';

export interface MobileLanguageSheetProps { open: boolean; onClose: () => void; }

const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English (US)', en_GB: 'English (UK)', it: 'Italian', de: 'German', fr: 'French', es: 'Spanish', zh: 'Chinese', nl: 'Dutch', pt: 'Portuguese', gl: 'Galician', ru: 'Russian', uk: 'Ukrainian', cs: 'Czech', pl: 'Polish', hu: 'Hungarian', sl: 'Slovenian', ja: 'Japanese', th: 'Thai', id: 'Indonesian', mn: 'Mongolian', ar: 'Arabic', he: 'Hebrew', fa: 'Persian',
};

export const MobileLanguageSheet: React.FC<MobileLanguageSheetProps> = ({ open, onClose }) => {
  const { language, setLanguage } = useFlow();
  const languages = useMemo(() => Object.keys(LANGUAGE_LABELS) as Language[], []);
  return (
    <M2Dialog open={open} onClose={onClose} title="Language" actions={<M2Button onClick={onClose}>Close</M2Button>}>
      <p style={{ margin: '0 0 12px', color: '#b00020', fontSize: 13 }}>Translations may not be 100% accurate.</p>
      <div className="m2-language-grid">
        {languages.map((code) => (
          <button key={code} type="button" className={`m2-language-item ${code === language ? 'is-active' : ''}`} onClick={() => { setLanguage(code); onClose(); }} aria-pressed={code === language}>
            <FlagIcon code={code} size={24} /><span>{LANGUAGE_LABELS[code]}</span>{code === language && <strong aria-label="Selected">✓</strong>}
          </button>
        ))}
      </div>
    </M2Dialog>
  );
};
