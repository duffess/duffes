import { useEffect, useState } from 'react';
import { Header } from './sections/Header';
import { Opening } from './sections/Opening';
import { InkSection } from './sections/InkSection';
import { Work } from './sections/Work';
import { Process } from './sections/Process';
import { Team } from './sections/Team';
import { Prices } from './sections/Prices';
import { Final } from './sections/Final';
import { WaButton } from './sections/WaButton';
import './v4.css';
import { prefersReduced, ScrollTrigger, startSmoothScroll } from './brand/motion';
import { initialLang, LangContext, saveLang, SetLangContext } from './brand/lang';
import type { Lang } from './brand/lang';

export function Site() {
  const [reduced, setReduced] = useState(prefersReduced);
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => (reduced ? undefined : startSmoothScroll()), [reduced]);

  // Idioma: salva, ajusta <html lang>, título e descrição; textos mudam de tamanho, então a rolagem recalcula.
  useEffect(() => {
    saveLang(lang);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [lang]);

  const t = (pt: string, en: string) => (lang === 'en' ? en : pt);

  return (
    <LangContext.Provider value={lang}>
      <SetLangContext.Provider value={setLang}>
        <a className="skip" href="#conteudo">
          {t('Pular para o conteúdo', 'Skip to content')}
        </a>
        <Header />
        <main>
          <Opening reduced={reduced} />
          <InkSection />
          <Work reduced={reduced} />
          <Team />
          <Process reduced={reduced} />
          <Prices reduced={reduced} />
          <Final reduced={reduced} />
        </main>
        <WaButton />
      </SetLangContext.Provider>
    </LangContext.Provider>
  );
}
