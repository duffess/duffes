import { useEffect, useRef, useState } from 'react';
import { projects } from './data';
import { LitWords } from './TextFx';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Efeito adaptado do "Laboratório Creative Romão" (09 · sites em órbita).
// Os prints giram numa elipse em volta do retrato; os da frente passam por cima dele.

export function About() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [front, setFront] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const n = projects.length;
    const step = 360 / n;
    let angle = 0;
    let last = performance.now();
    let visible = false;
    let running = false;
    let hovered = false;
    let currentFront = -1;

    const place = () => {
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const cardW = cardRefs.current[0]?.offsetWidth ?? 160;
      const rx = Math.min((W - cardW) / 2, 320);
      const ry = H * 0.07;
      let best = -2;
      let idx = 0;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const a = ((angle + i * step) * Math.PI) / 180;
        const x = Math.sin(a) * rx;
        const z = Math.cos(a);
        const y = -z * ry + H * 0.16;
        const s = 0.62 + ((z + 1) / 2) * 0.38;
        card.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(3)}) rotate(${(Math.sin(a) * 5).toFixed(2)}deg)`;
        card.style.zIndex = String(z > 0 ? 20 + Math.round(z * 10) : Math.round((z + 1) * 9));
        card.style.filter = z > 0 ? 'none' : `blur(${(-z * 1.6).toFixed(1)}px) brightness(${(0.6 + (z + 1) * 0.3).toFixed(2)})`;
        if (z > best) {
          best = z;
          idx = i;
        }
      });
      if (idx !== currentFront) {
        currentFront = idx;
        setFront(idx);
      }
    };

    const spin = (now: number) => {
      if (!visible || reduced) {
        running = false;
        return;
      }
      const dt = Math.min(50, now - last);
      last = now;
      if (!hovered) angle -= dt * 0.012;
      place();
      requestAnimationFrame(spin);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !running && !reduced) {
        running = true;
        last = performance.now();
        requestAnimationFrame(spin);
      }
    });
    io.observe(stage);

    const enter = () => (hovered = true);
    const leave = () => (hovered = false);
    stage.addEventListener('pointerenter', enter);
    stage.addEventListener('pointerleave', leave);
    window.addEventListener('resize', place);
    place();

    return () => {
      io.disconnect();
      stage.removeEventListener('pointerenter', enter);
      stage.removeEventListener('pointerleave', leave);
      window.removeEventListener('resize', place);
    };
  }, [reduced]);

  const current = projects[front];

  return (
    <section className="section about" id="quem-faz" aria-labelledby="about-title">
      <div className="orbit" ref={stageRef}>
        <img
          className="orbit__photo"
          src="/lyss-retrato.webp"
          srcSet="/lyss-retrato-480.webp 480w, /lyss-retrato.webp 720w"
          sizes="(max-width: 900px) 46vw, 260px"
          width={480}
          height={853}
          alt="Retrato de quem cria os sites da LYSS"
          loading="lazy"
          decoding="async"
        />
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="orbit__card"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            aria-hidden="true"
          >
            <img src={p.srcSet.split(' ')[0]} alt="" width={400} height={Math.round((400 * p.height) / p.width)} loading="lazy" decoding="async" />
          </div>
        ))}
        <p className="orbit__caption" aria-live="polite">
          {current.title}
          <span>{current.kind === 'cliente' ? 'Cliente' : 'Demonstração'}</span>
        </p>
      </div>

      <div className="about__text">
        <h2 id="about-title" className="h2">
          <LitWords text="Quem faz o seu site" />
        </h2>
        <p>
          Na LYSS, quem atende é quem desenha e programa. Você conversa direto comigo do primeiro áudio até o site
          estar no ar, sem intermediário e sem formulário.
        </p>
        <p>
          Cuido do visual, do código leve e de cada detalhe que faz o seu negócio parecer o que ele é de verdade.
        </p>
      </div>
    </section>
  );
}
