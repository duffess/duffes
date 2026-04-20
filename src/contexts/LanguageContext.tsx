import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../data/translations';
import type { Language } from '../data/translations';

type LanguageContextProps = {
  language: Language;
  setLanguage: (lang: Language) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, ...subKeys: string[]) => string;
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, ...subKeys: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result = (translations[language] as any)[key];
    for (const sk of subKeys) {
      if (result && result[sk]) {
        result = result[sk];
      } else {
        return '';
      }
    }
    return typeof result === 'string' ? result : '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
