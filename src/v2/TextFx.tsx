import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Efeitos de texto inspirados no "Laboratório Creative Romão" (04 · texto que entra).

const GLYPHS = 'abcdefghijklmnopqrstuvwxyzáãçéõ';

/** Linhas do título que entram embaralhadas e se decifram, da esquerda para a direita. */
export function ScrambleLines({ lines, className }: { lines: string[]; className?: string }) {
  const reduced = useReducedMotion();
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const els = refs.current.filter(Boolean) as HTMLSpanElement[];
    const start = performance.now();
    const perChar = 28; // ms entre cada letra que se acerta
    const lineDelay = 140;
    let raf = 0;

    const tick = (now: number) => {
      let done = true;
      els.forEach((el, li) => {
        const text = lines[li];
        const t = now - start - li * lineDelay;
        const settled = Math.floor(t / perChar);
        if (settled < text.length) done = false;
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === ' ' || i < settled) out += ch;
          else if (t < 0) out += ' ';
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
      });
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      els.forEach((el, li) => (el.textContent = lines[li]));
    };
  }, [lines, reduced]);

  return (
    <span className={className}>
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, i) => (
        <span
          key={line}
          aria-hidden="true"
          className="hero__line"
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          {line}
        </span>
      ))}
    </span>
  );
}

/** Título que acende palavra por palavra conforme a seção entra na tela. */
export function LitWords({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>('.lit__w'));
    let pending = false;
    let lastLit = -1;

    const update = () => {
      pending = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.4)));
      const lit = Math.round(p * spans.length);
      if (lit === lastLit) return;
      lastLit = lit;
      spans.forEach((s, i) => s.classList.toggle('is-lit', i < lit));
    };
    const onScroll = () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    };
    el.classList.add('lit--on');
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      el.classList.remove('lit--on');
    };
  }, [reduced]);

  return (
    <span ref={ref} className="lit">
      {words.map((w, i) => (
        <span key={i} className="lit__w">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}
