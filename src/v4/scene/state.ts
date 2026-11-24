/**
 * Estado compartilhado entre a rolagem (DOM) e a cena 3D, sem passar por React.
 * `p` é o progresso da abertura (0 a 1), atualizado pelo ScrollTrigger.
 * `tipScreen` é onde a ponta da caneta está na tela (0 a 1), para a tinta sair dali.
 */
export const stage = {
  p: 0,
  tipScreen: { x: 0.5, y: 0.5 },
  ready: false,
};

/** Fases da abertura, em fração do progresso. */
export const PHASE = {
  titleOut: [0.02, 0.13],
  descend: [0.1, 0.27],
  write: [0.27, 0.8],
  lift: [0.8, 0.9],
  wipe: [0.83, 0.985],
} as const;

export const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
export const range = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
