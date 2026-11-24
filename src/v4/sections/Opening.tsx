import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Eye } from '../brand/Eye';
import { useEyes } from '../brand/useEyes';
import { gsap, isLite, ScrollTrigger } from '../brand/motion';
import { createWipe } from '../ink/wipe';
import { PHASE, range, stage } from '../scene/state';
import { useLang, useT } from '../brand/lang';
import type { Lang } from '../brand/lang';

// O 3D chega depois: o título e o texto já aparecem sem ele.
const Studio = lazy(() =>
  Promise.all([
    document.fonts?.load('600 30px "Instrument Sans Variable"').catch(() => null),
    import('../scene/Studio'),
  ]).then(([, m]) => m),
);

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function Title({ lang }: { lang: Lang }) {
  if (lang === 'en') {
    return (
      <h1 className="hero__title" aria-label="Good sites come signed.">
        <span className="hero__line" aria-hidden="true">
          G<Eye />
          <Eye />d sites
        </span>
        <span className="hero__line" aria-hidden="true">
          come signed.
        </span>
      </h1>
    );
  }
  return (
    <h1 className="hero__title" aria-label="Todo site sai assinado.">
      <span className="hero__line" aria-hidden="true">
        T<Eye />d<Eye /> site
      </span>
      <span className="hero__line" aria-hidden="true">
        sai assinado.
      </span>
    </h1>
  );
}

export function Opening({ reduced }: { reduced: boolean }) {
  const wrap = useRef<HTMLElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const hint = useRef<HTMLParagraphElement>(null);
  const wipeEl = useRef<HTMLCanvasElement>(null);
  const [mount3d, setMount3d] = useState(false);
  const [ready, setReady] = useState(false);
  const [lite] = useState(isLite);
  const [webgl] = useState(hasWebGL);
  const isStatic = reduced || !webgl;

  const lang = useLang();
  const t = useT();
  const pitch = t(
    'Sites sob medida para barbearias, estúdios e restaurantes. Com um botão que leva o cliente direto para o seu WhatsApp.',
    'Custom websites for barbershops, studios and restaurants. With a button that takes customers straight to your WhatsApp.',
  );
  useEyes(wrap, true, lang);

  // Carrega o 3D quando o navegador respira.
  useEffect(() => {
    if (isStatic) return;
    const id = window.setTimeout(() => setMount3d(true), 60);
    return () => window.clearTimeout(id);
  }, [isStatic]);

  // Rolagem -> progresso da abertura; os elementos da tela seguem o mesmo relógio.
  useEffect(() => {
    if (isStatic || !wrap.current) return;
    stage.p = 0;
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        stage.p = self.progress;
      },
    });
    stage.p = st.progress;
    const wipe = createWipe(wipeEl.current!);
    const onResize = () => wipe.resize();
    window.addEventListener('resize', onResize);

    const tick = () => {
      const p = stage.p;
      const out = range(p, PHASE.titleOut);
      if (hero.current) {
        // a câmera desce, o título sobe: o mesmo movimento, visto de dentro
        hero.current.style.transform = `translate3d(0, ${-out * 22}vh, 0)`;
        hero.current.style.opacity = String(1 - out * out);
        hero.current.style.visibility = out >= 1 ? 'hidden' : 'visible';
      }
      if (hint.current) hint.current.style.opacity = String(1 - range(p, [0, 0.03]));
      if (caption.current) {
        caption.current.style.opacity = String(range(p, [0.3, 0.36]) * (1 - range(p, [0.74, 0.8])));
      }
      wipe.draw(range(p, PHASE.wipe), stage.tipScreen.x, stage.tipScreen.y);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', onResize);
      st.kill();
    };
  }, [isStatic]);

  if (isStatic) {
    return (
      <section className="hero hero--static" id="topo" ref={wrap} aria-label={t('Abertura', 'Opening')}>
        <div className="hero__copy">
          <Title lang={lang} />
          <p className="hero__pitch">{pitch}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`opening${lite ? ' opening--lite' : ''}`} id="topo" ref={wrap} aria-label={t('Abertura', 'Opening')}>
      <div className="stage">
        <div className={`studio${ready ? ' is-ready' : ''}`}>
          {mount3d && (
            <Suspense fallback={null}>
              <Studio lite={lite} lang={lang} onReady={() => setReady(true)} />
            </Suspense>
          )}
        </div>
        <div className="hero__copy" ref={hero}>
          <Title lang={lang} />
          <p className="hero__pitch">{pitch}</p>
        </div>
        <p className="stage__hint" ref={hint} aria-hidden="true">
          {t('Role para assinar', 'Scroll to sign')}
          <span className="stage__hint-line" />
        </p>
        <p className="stage__caption" ref={caption} aria-hidden="true">
          {t('Do primeiro traço ao site no ar, tudo feito à mão por nós dois.', 'From the first stroke to a live site, all handmade by the two of us.')}
        </p>
        <canvas className="stage__wipe" ref={wipeEl} aria-hidden="true" />
      </div>
    </section>
  );
}
