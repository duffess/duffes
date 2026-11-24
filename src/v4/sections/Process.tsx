import { useEffect, useRef, useState } from 'react';
import { steps } from '../brand/offer';
import { Stamp } from '../brand/Stamp';
import { gsap, ScrollTrigger } from '../brand/motion';
import { sound } from '../brand/sound';
import { useLang, useT } from '../brand/lang';

const pad = (i: number) => String(i + 1).padStart(2, '0');
/** Onde cada carimbo bate na folha (porcentagem) e com que giro. */
const SPOTS = [
  { x: 4, y: 6, r: -7 },
  { x: 44, y: 18, r: 5 },
  { x: 8, y: 52, r: 3 },
  { x: 46, y: 60, r: -6 },
];
/** Progresso da seção em que cada batida acontece. */
const BEATS = [0.1, 0.32, 0.54, 0.76];

/** Cena 5: as quatro etapas, uma batida de carimbo por rolagem. */
export function Process({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const marks = useRef<(SVGSVGElement | null)[]>([]);
  const [count, setCount] = useState(reduced ? steps.length : 0);
  const lang = useLang();
  const t = useT();
  const L = (s: (typeof steps)[number]) => (lang === 'en' ? s.en : s);

  useEffect(() => {
    if (reduced || !root.current) return;
    marks.current.forEach((m) => m && gsap.set(m, { autoAlpha: 0 }));
    let shown = 0;
    const stamp = (i: number, order: number) => {
      const m = marks.current[i];
      if (!m) return;
      const delay = order * 0.12;
      gsap.killTweensOf(m);
      gsap.fromTo(
        m,
        { autoAlpha: 0, scale: 1.35, y: -26 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.17, delay, ease: 'power4.in' },
      );
      gsap.delayedCall(delay + 0.17, sound.thud);
      // o papel sente o golpe
      gsap.fromTo(
        sheet.current,
        { y: 0, rotate: 0 },
        { y: 3, rotate: SPOTS[i].r > 0 ? 0.25 : -0.25, duration: 0.06, delay: delay + 0.17, yoyo: true, repeat: 1, ease: 'power2.out' },
      );
    };
    const lift = (i: number) => {
      const m = marks.current[i];
      if (!m) return;
      gsap.killTweensOf(m);
      gsap.to(m, { autoAlpha: 0, scale: 1.12, y: -14, duration: 0.25, ease: 'power2.out' });
    };
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const n = BEATS.filter((b) => self.progress >= b).length;
        if (n === shown) return;
        // batidas novas descem com força; voltando a rolagem, o carimbo sai do papel
        for (let i = shown; i < n; i++) stamp(i, i - shown);
        for (let i = shown - 1; i >= n; i--) lift(i);
        shown = n;
        setCount(n);
      },
    });
    return () => st.kill();
  }, [reduced]);

  const current = Math.max(count - 1, 0);
  return (
    <section
      className={`process${reduced ? ' process--static' : ''}`}
      id="processo"
      ref={root}
      aria-labelledby="process-title"
    >
      <div className="process__stage">
        <div className="process__head">
          <p className="kicker">{t('Como funciona', 'How it works')}</p>
          <h2 id="process-title" className="process__title">
            {t('Quatro batidas e o site está no ar.', 'Four stamps and your site is live.')}
          </h2>
        </div>

        <div className="process__sheet" ref={sheet}>
          {steps.map((s, i) => (
            <Stamp
              key={s.title}
              ref={(el) => {
                marks.current[i] = el;
              }}
              top={`LYSS · ${t('ETAPA', 'STEP')} ${pad(i)}`}
              title={L(s).title}
              bottom={L(s).seal}
              style={{ left: `${SPOTS[i].x}%`, top: `${SPOTS[i].y}%`, rotate: `${SPOTS[i].r}deg` }}
            />
          ))}
        </div>

        {reduced ? (
          <ol className="process__list">
            {steps.map((s, i) => (
              <li key={s.title}>
                <p className="process__num">{pad(i)}</p>
                <h3 className="process__step">{L(s).title}</h3>
                <p>{L(s).text}</p>
              </li>
            ))}
          </ol>
        ) : (
          <>
            <div className="process__text" aria-hidden="true">
              {count > 0 && (
                <div key={current} className="process__card">
                  <p className="process__num">
                    {pad(current)} / {pad(steps.length - 1)}
                  </p>
                  <h3 className="process__step">{L(steps[current]).title}</h3>
                  <p>{L(steps[current]).text}</p>
                </div>
              )}
            </div>
            {/* Para leitor de tela e busca: as quatro etapas em ordem. */}
            <ol className="sr-only">
              {steps.map((s) => (
                <li key={s.title}>
                  {L(s).title}: {L(s).text}
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}
