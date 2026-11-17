import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../data/translations';
import type { Language } from '../data/translations';
import { LanguageContext } from './useLanguage';

const HTML_LANG_MAP: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en',
  es: 'es',
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    document.documentElement.lang = HTML_LANG_MAP[language];
  }, [language]);

  const t = (key: string, ...subKeys: string[]) => {
    let current: unknown = (translations[language] as Record<string, unknown>)[key];
    for (const sk of subKeys) {
      if (current && typeof current === 'object' && sk in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[sk];
      } else {
        return '';
      }
    }
    return typeof current === 'string' ? current : '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
