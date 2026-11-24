import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Mouse de verdade (não toque). */
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Celular ou tela estreita: versão leve. */
export const isLite = () =>
  typeof window !== 'undefined' && (!finePointer() || window.innerWidth < 760);

let lenis: Lenis | null = null;

/** Rolagem suave só no computador; no celular fica a rolagem nativa. */
export function startSmoothScroll() {
  if (lenis || prefersReduced() || !finePointer()) return () => {};
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis?.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToEl(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
}

export function scrollToY(y: number, duration = 1.2) {
  if (lenis) lenis.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: prefersReduced() ? 'auto' : 'smooth' });
}

/** Trava a rolagem da página (projeto aberto em tela cheia). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle('is-locked', locked);
}
