import { createContext, useContext } from 'react';

export type Lang = 'pt' | 'en';
export const LangContext = createContext<Lang>('pt');
export const SetLangContext = createContext<(l: Lang) => void>(() => {});

/** Uso: const t = useT(); t('Texto em português', 'Text in English') */
export function useT() {
  const lang = useContext(LangContext);
  return (pt: string, en: string) => (lang === 'en' ? en : pt);
}

export function useLang() {
  return useContext(LangContext);
}

export function useSetLang() {
  return useContext(SetLangContext);
}

export function initialLang(): Lang {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'pt' || q === 'en') return q;
    const saved = localStorage.getItem('lyss-lang');
    if (saved === 'pt' || saved === 'en') return saved;
  } catch {
    /* sem armazenamento */
  }
  return typeof navigator !== 'undefined' && !navigator.language.toLowerCase().startsWith('pt') ? 'en' : 'pt';
}

export function saveLang(l: Lang) {
  try {
    localStorage.setItem('lyss-lang', l);
  } catch {
    /* sem armazenamento */
  }
  document.documentElement.lang = l === 'en' ? 'en' : 'pt-BR';
  document.title =
    l === 'en'
      ? 'LYSS | Good sites come signed. Websites for local businesses, with WhatsApp'
      : 'LYSS | Todo site sai assinado. Sites para negócios locais com WhatsApp';
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      l === 'en'
        ? 'Isabela and Guilherme design and build websites for local businesses: fast on mobile, ready for Google and with a button straight to your WhatsApp. From R$ 997.'
        : 'Isabela e Guilherme desenham e programam sites para negócios locais: rápidos no celular, prontos para o Google e com botão direto para o seu WhatsApp. A partir de R$ 997.',
    );
}
