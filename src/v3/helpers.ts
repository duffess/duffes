import { DEFAULT_WA_MESSAGE, waLink } from './data';
import { gsap } from './motion';

export const mainWa = waLink(DEFAULT_WA_MESSAGE);

export const INTRO_KEY = 'lyss-intro-visto';

/** A abertura aparece uma vez por visita e nunca com movimento reduzido. */
export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1';
  } catch {
    return true;
  }
}


/** Duração de cada traço proporcional ao comprimento, somando `total` segundos. */
export function strokePlan(svg: SVGSVGElement, total: number) {
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>('[data-c]'));
  const lens = paths.map((p) => {
    try {
      return Math.max(p.getTotalLength(), 1);
    } catch {
      return 1;
    }
  });
  const sum = lens.reduce((a, b) => a + b, 0);
  return paths.map((p, i) => ({ el: p, dur: Math.max((lens[i] / sum) * total, 0.06) }));
}

/**
 * Escrita contínua: os traços vêm um atrás do outro, sem parar entre eles,
 * cada um com tempo proporcional ao comprimento. O ritmo geral (acelera e
 * freia) vem de `ease`, aplicado ao conjunto, não a cada traço.
 */
export function writeTween(svg: SVGSVGElement, duration: number, ease = 'power1.inOut') {
  const draw = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  let at = 0;
  for (const { el, dur } of strokePlan(svg, 1)) {
    draw.to(el, { strokeDashoffset: 0, duration: dur }, at);
    at += dur;
  }
  return gsap.to(draw, { progress: 1, duration, ease, paused: true });
}
