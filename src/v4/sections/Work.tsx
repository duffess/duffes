import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { projects } from '../brand/projects';
import { gsap, isLite, lockScroll, ScrollTrigger, scrollToY } from '../brand/motion';
import { deskFrames, sheetCursor, sheetProgress, work } from '../scene/workState';
import { ProjectDialog } from './ProjectDialog';
import { useLang, useT } from '../brand/lang';
import { projectText } from '../brand/projects';
import { sound } from '../brand/sound';

const Desk = lazy(() =>
  Promise.all([
    document.fonts?.load('54px "Agilov"').catch(() => null),
    document.fonts?.load('600 24px "Instrument Sans Variable"').catch(() => null),
    import('../scene/Desk'),
  ]).then(([, , m]) => m),
);

function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

const pad = (i: number) => String(i + 1).padStart(2, '0');

/** Cena 4: os trabalhos como folhas de papel sobre a mesa. */
export function Work({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [lite] = useState(isLite);
  const [webgl] = useState(hasWebGL);
  const isStatic = reduced || !webgl;
  const [near, setNear] = useState(false);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState(-1);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const busy = useRef(false);
  const lang = useLang();
  const t = useT();

  // Rolagem -> progresso da mesa e folha ativa.
  useEffect(() => {
    if (isStatic || !root.current) return;
    let last = -1;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        work.p = self.progress;
        deskFrames.request();
        const a = self.progress > 0.12 ? Math.round(sheetCursor(self.progress)) : -1;
        // a câmera chegou a outra folha: um sopro de papel bem baixo
        if (a !== last && a >= 0) sound.flip();
        last = a;
        setActive(a);
      },
    });
    work.p = st.progress;
    // O 3D só existe quando a mesa está perto, e só desenha quando aparece.
    const far = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '120% 0px' });
    const vis = new IntersectionObserver(([e]) => setRunning(e.isIntersecting));
    far.observe(root.current);
    vis.observe(root.current);
    return () => {
      st.kill();
      far.disconnect();
      vis.disconnect();
    };
  }, [isStatic]);

  const goTo = useCallback((i: number) => {
    const el = root.current;
    if (!el) return;
    const y = el.offsetTop + sheetProgress(i) * (el.offsetHeight - window.innerHeight);
    scrollToY(y);
  }, []);

  const open = useCallback(
    (i: number) => {
      if (busy.current) return;
      setOpenIdx(i);
      if (isStatic) {
        setShown(true);
        lockScroll(true);
        return;
      }
      busy.current = true;
      work.open = i;
      work.hover = -1;
      lockScroll(true);
      gsap
        .timeline({ onComplete: () => void (busy.current = false) })
        .to(work, { openAmt: 1, onUpdate: () => deskFrames.request(), duration: 1.15, ease: 'power3.inOut' })
        .call(() => setShown(true), [], 0.72);
    },
    [isStatic],
  );

  const close = useCallback(() => {
    if (isStatic) {
      setShown(false);
      setOpenIdx(null);
      lockScroll(false);
      return;
    }
    if (busy.current) return;
    busy.current = true;
    setShown(false);
    gsap.to(work, {
      openAmt: 0,
      onUpdate: () => deskFrames.request(),
      duration: 0.9,
      delay: 0.25,
      ease: 'power3.inOut',
      onComplete: () => {
        work.open = -1;
        busy.current = false;
        setOpenIdx(null);
        lockScroll(false);
      },
    });
  }, [isStatic]);

  const pick = useCallback(
    (i: number) => {
      if (active === i) open(i);
      else goTo(i);
    },
    [active, open, goTo],
  );

  const dialog = (
    <ProjectDialog project={openIdx === null ? null : projects[openIdx]} shown={shown} onClose={close} />
  );

  if (isStatic) {
    return (
      <section className="work work--static" id="trabalhos" aria-labelledby="work-title">
        <h2 id="work-title" className="work__heading">
          {t('Trabalhos que saíram daqui.', 'Work that left this desk.')}
        </h2>
        <ol className="work__list">
          {projects.map((p, i) => (
            <li key={p.id} className="work__item">
              <img src={p.imageSmall} alt={t(`Primeira tela do site ${p.title}`, `First screen of the ${p.title} site`)} width={669} height={400} loading="lazy" />
              <div>
                <p className="work__kind">
                  {pad(i)} · {projectText(p, lang).kind}
                  {p.place ? ` · ${p.place}` : ''}
                </p>
                <h3 className="work__title">{p.title}</h3>
                <p className="work__desc">{projectText(p, lang).description}</p>
                <button className="btn" type="button" onClick={() => open(i)}>
                  {t('Abrir projeto', 'Open project')}
                </button>
              </div>
            </li>
          ))}
        </ol>
        {dialog}
      </section>
    );
  }

  const p = active >= 0 ? projects[active] : null;
  return (
    <section className={`work${lite ? ' work--lite' : ''}`} id="trabalhos" ref={root} aria-labelledby="work-title">
      <div className="work__stage">
        <div className="work__canvas">
          {near && (
            <Suspense fallback={null}>
              <Desk lite={lite} lang={lang} running={running || openIdx !== null} onPick={pick} />
            </Suspense>
          )}
        </div>

        <h2 id="work-title" className={`work__heading${active < 0 ? ' is-on' : ''}`}>
          {t('Trabalhos que saíram daqui.', 'Work that left this desk.')}
        </h2>

        <div className="work__panel" aria-live="polite">
          {p && (
            <div key={p.id} className="work__card">
              <p className="work__kind">
                {pad(active)} · {projectText(p, lang).kind}
                {p.place ? ` · ${p.place}` : ''}
              </p>
              <h3 className="work__title">{p.title}</h3>
              <p className="work__desc">{projectText(p, lang).description}</p>
              <button className="btn" type="button" onClick={() => open(active)}>
                {t('Abrir projeto', 'Open project')}
              </button>
            </div>
          )}
        </div>

        <nav className="work__index" aria-label={t('Trabalhos', 'Work')}>
          <ol>
            {projects.map((proj, i) => (
              <li key={proj.id}>
                <button
                  type="button"
                  className={i === active ? 'is-active' : ''}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => goTo(i)}
                >
                  <span className="work__num">{pad(i)}</span>
                  <span className="work__name">{proj.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      {dialog}
    </section>
  );
}
