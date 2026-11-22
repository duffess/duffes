import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { WaGlyph } from './PhoneDemo';
import { Signature } from './Signature';
import { Intro } from './Intro';
import { mainWa, shouldPlayIntro } from './helpers';
import { Work } from './Work';
import { Closing, Demo, Footer, Hero, Pricing, Steps, Team } from './Sections';
import { Cursor } from './Cursor';
import { Band } from './Fx';
import { ScrollTrigger, startSmoothScroll } from './motion';

function Nav({ logoRef, logoHidden }: { logoRef: RefObject<SVGSVGElement | null>; logoHidden: boolean }) {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#topo" className="nav__logo" aria-label="LYSS, voltar ao início">
          <Signature ref={logoRef} name="lyss" className={`nav__sig ${logoHidden ? 'is-waiting' : ''}`} />
        </a>
        <nav className="nav__links" aria-label="Seções">
          <a href="#trabalhos">Trabalhos</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#precos">Preços</a>
          <a href="#quem-faz">Quem faz</a>
        </nav>
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

  useEffect(() => startSmoothScroll(), []);

  // Fontes e imagens mudam a altura das seções: recalcula os gatilhos.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Nav logoRef={logoRef} logoHidden={introOn} />
      <main id="conteudo" tabIndex={-1}>
        <Hero ready={ready} />
        <Band />
        <Demo />
        <Work />
        <Steps />
        <Pricing />
        <Team />
        <Closing />
      </main>
      <Footer />
      <Cursor />
      {introOn && (
        <Intro target={logoRef} onReveal={() => setReady(true)} onDone={() => setIntroOn(false)} />
      )}
    </>
  );
}
