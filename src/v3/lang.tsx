import { createContext, useContext } from 'react';

export type Lang = 'pt' | 'en';
export const LangContext = createContext<Lang>('pt');

/** Uso: const t = useT(); t('Texto em português', 'Text in English') */
export function useT() {
  const lang = useContext(LangContext);
  return (pt: string, en: string) => (lang === 'en' ? en : pt);
}

export function useLang() {
  return useContext(LangContext);
}

export function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lyss-lang');
    if (saved === 'pt' || saved === 'en') return saved;
  } catch {
    /* sem armazenamento */
  }
  return typeof navigator !== 'undefined' && !navigator.language.toLowerCase().startsWith('pt') ? 'en' : 'pt';
}
