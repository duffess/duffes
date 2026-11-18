import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Efeitos de texto inspirados no "Laboratório Creative Romão" (04 · texto que entra).

/** Linhas do título que sobem de dentro de uma máscara, uma depois da outra. */
export function RevealLines({ lines }: { lines: string[] }) {
  return (
    <span className="reveal">
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, i) => (
        <span key={line} className="hero__line reveal__mask" aria-hidden="true">
          <span className="reveal__text" style={{ animationDelay: `${0.12 + i * 0.11}s` }}>
            {line}
          </span>
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
