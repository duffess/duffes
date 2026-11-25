import { projects } from '../brand/projects';

/**
 * Estado da mesa de trabalhos, compartilhado entre a rolagem (DOM) e a cena 3D.
 * `p`: progresso da seção (0 a 1). `hover`: folha sob o mouse (-1 nenhuma).
 * `open`: projeto aberto (-1 nenhum). `openAmt`: 0 na mesa, 1 dentro da folha.
 */
export const work = {
  p: 0,
  hover: -1,
  open: -1,
  openAmt: 0,
};

// The DOM scroll/tween callbacks wake the visible WebGL canvas.
export const deskFrames = { request: () => {} };

export const N = projects.length;

/** Trecho da rolagem: visão geral da mesa, depois uma folha por vez. */
export const WORK_PHASE = { overview: [0, 0.1] as const, sheets: [0.16, 0.96] as const };

/** Posição contínua na fila de folhas (0 a N-1), com uma pausa em cada folha. */
export function sheetCursor(p: number) {
  const [a, b] = WORK_PHASE.sheets;
  const f = Math.min(Math.max((p - a) / (b - a), 0), 1) * (N - 1);
  const base = Math.min(Math.floor(f), N - 2);
  const frac = f - base;
  const t = Math.min(Math.max((frac - 0.28) / 0.44, 0), 1);
  return base + t * t * (3 - 2 * t);
}

/** Progresso da seção em que a folha i fica parada no centro. */
export function sheetProgress(i: number) {
  const [a, b] = WORK_PHASE.sheets;
  return a + (i / (N - 1)) * (b - a);
}
