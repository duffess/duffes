import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { WaGlyph } from './PhoneDemo';
import { Signature } from './Signature';
import { Intro } from './Intro';
import { mainWa, shouldPlayIntro } from './helpers';
import { Work } from './Work';
import { Closing, Demo, Footer, Hero, InstaToSite, Pricing, Faq, Steps, Team } from './Sections';
import { LangContext, initialLang, useT, type Lang } from './lang';
import { Cursor } from './Cursor';
import { Band } from './Fx';
import { ScrollTrigger, startSmoothScroll } from './motion';

function Nav({ logoRef, logoHidden, lang, setLang }: { logoRef: RefObject<SVGSVGElement | null>; logoHidden: boolean; lang: Lang; setLang: (l: Lang) => void }) {
  const t = useT();
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#topo" className="nav__logo" aria-label="LYSS, voltar ao início">
          <Signature ref={logoRef} name="lyss" className={`nav__sig ${logoHidden ? 'is-waiting' : ''}`} />
        </a>
        <nav className="nav__links" aria-label="Seções">
          <a href="#trabalhos">{t('Trabalhos', 'Work')}</a>
          <a href="#como-funciona">{t('Como funciona', 'How it works')}</a>
          <a href="#precos">{t('Preços', 'Pricing')}</a>
          <a href="#quem-faz">{t('Quem faz', 'About us')}</a>
        </nav>
        <div className="lang" role="group" aria-label="Idioma / Language">
          <button type="button" aria-pressed={lang === 'pt'} onClick={() => setLang('pt')}>PT</button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
        </div>
        <a className="btn btn--small" href={mainWa} target="_blank" rel="noopener noreferrer" data-magnetic>
          <WaGlyph />
          <span>WhatsApp</span>
        </a>
      </div>
    </header>
  );
}

export function Site() {
  const logoRef = useRef<SVGSVGElement>(null);
  const [playIntro] = useState(shouldPlayIntro);
  const [introOn, setIntroOn] = useState(playIntro);
  const [ready, setReady] = useState(!playIntro);
  const [lang, setLangState] = useState<Lang>(initialLang);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('lyss-lang', l); } catch { /* sem armazenamento */ }
  };
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [lang]);

  useEffect(() => startSmoothScroll(), []);

  // Fontes e imagens mudam a altura das seções: recalcula os gatilhos.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <LangContext.Provider value={lang}>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Nav logoRef={logoRef} logoHidden={introOn} lang={lang} setLang={setLang} />
      <main id="conteudo" tabIndex={-1}>
        <Hero ready={ready} />
        <Band />
        <Demo />
        <InstaToSite />
        <Work />
        <Steps />
        <Pricing />
        <Faq />
        <Team />
        <Closing />
      </main>
      <Footer />
      <Cursor />
      {introOn && (
        <Intro target={logoRef} onReveal={() => setReady(true)} onDone={() => setIntroOn(false)} />
      )}
    </LangContext.Provider>
  );
}
