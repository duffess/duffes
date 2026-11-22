import { useEffect, useRef } from 'react';
import { finePointer, gsap, prefersReduced } from './motion';

/**
 * Só no computador: um ponto de tinta segue o mouse e cresce sobre links,
 * e os botões marcados com data-magnetic são puxados de leve pelo cursor.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dot.current;
    if (!el || !finePointer() || prefersReduced()) return;
    document.documentElement.classList.add('has-cursor');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.classList.add('is-on');
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      const t = e.target as Element | null;
      const hot = t?.closest('a, button, [role="button"]');
      el.classList.toggle('is-hot', !!hot);
      el.classList.toggle('is-drag', !!t?.closest('.reel'));
    };
    const leave = () => {
      el.classList.remove('is-on');
      shown = false;
    };

    // Ímã
    const mags = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
    const offs = mags.map((m) => {
      const mx = gsap.quickTo(m, 'x', { duration: 0.5, ease: 'power3' });
      const my = gsap.quickTo(m, 'y', { duration: 0.5, ease: 'power3' });
      const mv = (e: PointerEvent) => {
        const r = m.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.28);
        my((e.clientY - (r.top + r.height / 2)) * 0.36);
      };
      const out = () => {
        mx(0);
        my(0);
      };
      m.addEventListener('pointermove', mv);
      m.addEventListener('pointerleave', out);
      return () => {
        m.removeEventListener('pointermove', mv);
        m.removeEventListener('pointerleave', out);
        gsap.set(m, { x: 0, y: 0 });
      };
    });

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      offs.forEach((f) => f());
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <div className="cursor" ref={dot} aria-hidden="true">
      <span>Arraste</span>
    </div>
  );
}
