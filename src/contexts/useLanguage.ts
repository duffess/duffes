import { createContext, useContext } from 'react';
import type { Language } from '../data/translations';

export type LanguageContextProps = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...subKeys: string[]) => string;
};

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
