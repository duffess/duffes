import { useRef, useState } from 'react';
import { projects } from './data';
import { Reveal } from './Fx';
import { ScrollTrigger, finePointer, gsap, prefersReduced, scrollToY, useGSAP } from './motion';

const N = projects.length;

/**
 * Trabalhos num carrossel curvo: os cartões ficam por dentro de um cilindro,
 * as pontas vêm na direção de quem olha. No computador a rolagem gira o
 * cilindro; em qualquer tela dá para arrastar ou usar as setas.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const api = useRef<{ go: (i: number) => void } | null>(null);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const cards = Array.from(el.querySelectorAll<HTMLElement>('.reel__card'));
      const reduced = prefersReduced();
      let current = 0;
      let target = 0;
      let last = -1;
      let geo = { step: 0.5, radius: 1000, stepPx: 500 };

      const measure = () => {
        const w = cards[0]?.offsetWidth || 500;
        const gap = Math.max(w * 0.08, 18);
        const radius = Math.max(w * 1.9, 640);
        geo = { radius, step: (w + gap) / radius, stepPx: w + gap };
        el.style.perspective = `${Math.round(radius * 1.5)}px`;
      };

      const render = () => {
        const { radius, step } = geo;
        cards.forEach((c, i) => {
          const a = (i - current) * step;
          const off = Math.abs(i - current);
          // Ponto de vista no eixo do cilindro: as pontas avançam.
          const x = Math.sin(a) * radius;
          const z = (1 - Math.cos(a)) * radius;
          c.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${(-a * 180) / Math.PI}deg)`;
          c.style.opacity = String(Math.max(0, 1 - Math.max(off - 1.6, 0)));
          c.style.zIndex = String(100 - Math.round(off * 10));
        });
        const idx = Math.round(current);
        if (idx !== last) {
          last = idx;
          setActive(Math.min(Math.max(idx, 0), N - 1));
        }
      };

      measure();
      render();

      const tick = () => {
        const d = target - current;
        if (Math.abs(d) < 0.0005) {
          if (current !== target) {
            current = target;
            render();
          }
          return;
        }
        current += d * (reduced ? 1 : 0.12);
        render();
      };
      gsap.ticker.add(tick);

      const clamp = (v: number) => Math.min(Math.max(v, 0), N - 1);

      // Estado do arrasto.
      let dragging = false;
      let moved = 0;
      let startX = 0;
      let startY = 0;
      let startT = 0;
      let axis: 'x' | 'y' | null = null;

      // Computador: a rolagem gira o cilindro com a seção presa.
      const mm = gsap.matchMedia();
      let st: ScrollTrigger | null = null;
      mm.add('(min-width: 900px) and (hover: hover) and (prefers-reduced-motion: no-preference)', () => {
        st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (N - 1) * 0.55}`,
          pin: true,
          onUpdate: (self) => {
            if (dragging) return;
            // Cada trabalho para um pouco no centro antes de o próximo girar.
            const raw = self.progress * (N - 1);
            const i = Math.min(Math.floor(raw), N - 2);
            const f = Math.min(Math.max((raw - i - 0.18) / 0.64, 0), 1);
            target = i + f * f * (3 - 2 * f);
          },
        });
        return () => {
          st = null;
        };
      });

      const go = (i: number) => {
        const t = clamp(i);
        if (st) {
          scrollToY(st.start + (t / (N - 1)) * (st.end - st.start));
        } else {
          target = t;
        }
      };
      api.current = { go };

      // Arrastar (dedo ou mouse).
      const down = (e: PointerEvent) => {
        if (e.button !== 0) return;
        dragging = true;
        moved = 0;
        axis = null;
        startX = e.clientX;
        startY = e.clientY;
        startT = target;
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!axis && Math.hypot(dx, dy) > 6) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (axis !== 'x') return;
        moved = Math.abs(dx);
        target = Math.min(Math.max(startT - dx / geo.stepPx, -0.35), N - 1 + 0.35);
        el.classList.add('is-dragging');
      };
      const up = () => {
        if (!dragging) return;
        dragging = false;
        el.classList.remove('is-dragging');
        if (axis === 'x') go(Math.round(target));
        else target = clamp(Math.round(target));
      };
      // Um arrasto não abre o link do cartão.
      const click = (e: MouseEvent) => {
        if (moved > 8) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      el.addEventListener('pointerdown', down);
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
      el.addEventListener('click', click, true);

      const onResize = () => {
        measure();
        render();
      };
      window.addEventListener('resize', onResize);

      return () => {
        gsap.ticker.remove(tick);
        mm.revert();
        el.removeEventListener('pointerdown', down);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        el.removeEventListener('click', click, true);
        window.removeEventListener('resize', onResize);
      };
    },
    { scope: root },
  );

  const p = projects[active];

  return (
    <section className="work" id="trabalhos" ref={root} aria-labelledby="work-title">
      <div className="work__head wrap">
        <Reveal id="work-title">Sites que a gente já assinou</Reveal>
        <p className="work__hint">{finePointer() ? 'Role ou arraste para girar.' : 'Arraste para o lado.'}</p>
      </div>

      <div className="reel" ref={stage}>
        <ul className="reel__ring">
          {projects.map((proj, i) => (
            <li
              key={proj.id}
              className="reel__card"
              aria-hidden={i === active ? undefined : true}
            >
              <a href={proj.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} draggable={false}>
                <img
                  src={proj.image}
                  srcSet={proj.srcSet}
                  sizes="(max-width: 900px) 80vw, 46vw"
                  width={proj.width}
                  height={proj.height}
                  alt=""
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="work__info wrap">
        <div className="work__count" aria-hidden="true">
          {active + 1}
          <span>/{N}</span>
        </div>
        <div className="work__text" aria-live="polite">
          <p className="work__kind">
            {p.kind === 'cliente' ? 'Cliente' : 'Estudo'}
            {p.place ? `, ${p.place}` : ''}
          </p>
          <h3 className="h3">{p.title}</h3>
          <p>{p.description}</p>
          <a className="link" href={p.url} target="_blank" rel="noopener noreferrer">
            Abrir {p.urlLabel}
          </a>
        </div>
        <div className="work__nav">
          <button
            type="button"
            className="round"
            onClick={() => api.current?.go(active - 1)}
            disabled={active === 0}
            aria-label="Trabalho anterior"
          >
            <Arrow dir={-1} />
          </button>
          <button
            type="button"
            className="round"
            onClick={() => api.current?.go(active + 1)}
            disabled={active === N - 1}
            aria-label="Próximo trabalho"
          >
            <Arrow dir={1} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Arrow({ dir }: { dir: 1 | -1 }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={dir < 0 ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
