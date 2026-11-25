// Contorno externo do "o" da Agilov (unidades da fonte, eixo y para cima).
export const O_OUTER =
  'M15 250C15 107 133 -10 279 -10C425 -10 544 107 544 250C544 394 425 510 279 510C133 510 15 394 15 250Z';
// O miolo redondo da Agilov vira o olho; "em repouso" ele fica meio fechado.
export const EYE = { cx: 279, cy: 250, rx: 140, rest: 70, wide: 136, max: 168 };
// Tamanho da íris (raio) e da pupila (fração da íris) em cada humor.
export const IRIS = { rest: 60, wide: 84, shock: 58, sleepy: 54 };
export const PUPIL = { rest: 0.5, wide: 0.62, shock: 0.3 };
