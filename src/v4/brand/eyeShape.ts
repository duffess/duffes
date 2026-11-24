// Contorno externo do "o" da Bagel Fat One (unidades da fonte, eixo y para cima).
export const O_OUTER =
  'M279 -2Q162 -2 92.5 67.5Q23 137 23 264Q23 342 55 401Q87 460 144.5 493.5Q202 527 279 527Q365 527 422 493.5Q479 460 507.5 401Q536 342 536 264Q536 137 472.5 67.5Q409 -2 279 -2Z';
// O miolo da letra é uma fenda: o olho "em repouso" fica meio fechado, como a própria fonte desenha.
export const EYE = { cx: 279, cy: 280, rx: 140, rest: 70, wide: 136, max: 168 };
// Tamanho da íris (raio) e da pupila (fração da íris) em cada humor.
export const IRIS = { rest: 60, wide: 84, shock: 58, sleepy: 54 };
export const PUPIL = { rest: 0.5, wide: 0.62, shock: 0.3 };

