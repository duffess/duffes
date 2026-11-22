import { Fragment, useId, useRef } from 'react';
import type { ElementType, ReactNode } from 'react';
import { gsap, prefersReduced, useGSAP } from './motion';
import { EYE, IRIS, O_OUTER, PUPIL } from './eyeShape';
import { Signature } from './Signature';
import { writeTween } from './helpers';

/* ---------- Olhos: os "o" do título viram olhos de verdade ---------- */

export function Eye() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="eye" viewBox="0 -527 558 529" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`e${id}`}>
          <ellipse className="eye__shape" cx={EYE.cx} cy={EYE.cy} rx={EYE.rx} ry={EYE.rest} />
        </clipPath>
      </defs>
      <g transform="scale(1,-1)">
        <path d={O_OUTER} fill="currentColor" />
        <ellipse className="eye__white eye__shape" cx={EYE.cx} cy={EYE.cy} rx={EYE.rx} ry={EYE.rest} />
        <g clipPath={`url(#e${id})`}>
          <g className="eye__look">
            <circle className="eye__iris" cx={EYE.cx} cy={EYE.cy} r={IRIS.rest} />
            <circle className="eye__pupil" cx={EYE.cx} cy={EYE.cy} r={IRIS.rest * PUPIL.rest} />
            <circle className="eye__glint" cx={EYE.cx - IRIS.rest * 0.32} cy={EYE.cy + IRIS.rest * 0.34} r={IRIS.rest * 0.2} />
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ---------- Título que sobe palavra por palavra ---------- */

export function Reveal({
  as: Tag = 'h2',
  children,
  className = 'h2',
  id,
}: {
  as?: ElementType;
  children: string;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.from('.w > span', {
        yPercent: 110,
        rotate: 4,
        duration: 1.1,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 86%', once: true },
      });
    },
    { scope: ref },
  );
  const words = children.split(' ');
  return (
    <Tag ref={ref} id={id} className={className} aria-label={children}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/* ---------- Faixa de ramos que acelera com a rolagem ---------- */

const TRADES = ['Barbearia', 'Academia', 'Clínica', 'Restaurante', 'Salão', 'Estúdio', 'Consultório', 'Ateliê'];

export function Band() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = root.current?.querySelector<HTMLElement>('.band__track');
      if (!track || prefersReduced()) return;
      let x = 0;
      let dir = -1;
      let boost = 0;
      let skew = 0;
      const half = () => track.scrollWidth / 2;
      let lastY = window.scrollY;
      let lastT = performance.now();

      const tick = () => {
        const now = performance.now();
        const dt = Math.min(now - lastT, 50);
        lastT = now;
        const y = window.scrollY;
        const v = ((y - lastY) / (dt || 16)) * 1000;
        lastY = y;
        if (Math.abs(v) > 30) dir = v > 0 ? -1 : 1;
        boost += (Math.min(Math.abs(v) / 110, 22) - boost) * 0.12;
        skew += (gsap.utils.clamp(-9, 9, (dir * Math.abs(v)) / 240) - skew) * 0.12;
        const w = half();
        x += dir * (0.7 + boost) * (dt / 16);
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        track.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      };
      // Só anda quando está na tela.
      let on = false;
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !on) {
          on = true;
          lastT = performance.now();
          lastY = window.scrollY;
          gsap.ticker.add(tick);
        } else if (!e.isIntersecting && on) {
          on = false;
          gsap.ticker.remove(tick);
        }
      });
      io.observe(root.current!);
      return () => {
        io.disconnect();
        gsap.ticker.remove(tick);
      };
    },
    { scope: root },
  );

  const row = (k: string) =>
    TRADES.map((t) => (
      <span className="band__item" key={k + t}>
        {t}
        <svg className="band__mark" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M20 2c2 10 8 16 18 18-10 2-16 8-18 18-2-10-8-16-18-18C12 18 18 12 20 2Z" />
        </svg>
      </span>
    ));

  return (
    <div className="band" ref={root} aria-label="Ramos que atendemos: barbearia, academia, clínica, restaurante, salão, estúdio, consultório e ateliê">
      <div className="band__track" aria-hidden="true">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}

/* ---------- Assinatura gigante escrita pela rolagem ---------- */

export function BigSignature({ children }: { children?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const sig = useRef<SVGSVGElement>(null);
  const reduced = prefersReduced();

  useGSAP(
    () => {
      const svg = sig.current;
      if (!svg || reduced) return;
      const write = writeTween(svg, 1, 'none');
      gsap.to(write, {
        progress: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'bottom bottom', scrub: 0.8 },
      });
    },
    { scope: root },
  );

  return (
    <div className="bigsig" ref={root}>
      <Signature ref={sig} name="lyss" className="bigsig__svg" hidden={!reduced} label="Lyss" />
      {children}
    </div>
  );
}
