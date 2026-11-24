import raw from './sig-lyss';

/**
 * A assinatura LYSS pronta para ser escrita por uma caneta:
 * cada traço vira uma lista de pontos com comprimento acumulado,
 * e o caminho completo intercala tinta e "ar" (a caneta erguida entre traços).
 */
export type Pt = [number, number];
export type Stroke = { pts: Pt[]; cum: number[]; len: number; fill: string; ring: boolean };

const [vbx, vby, vbw, vbh] = raw.viewBox.split(/\s+/).map(Number);
export const VIEWBOX = { x: vbx, y: vby, w: vbw, h: vbh };
export const PEN = raw.pen;
export const FILLS = raw.strokes.map((s) => ({ d: s.fill, ring: s.ring }));

function parse(d: string): Pt[] {
  const nums = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  const pts: Pt[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return pts;
}

export const STROKES: Stroke[] = raw.strokes.map((s) => {
  const pts = parse(s.center);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return { pts, cum, len: cum[cum.length - 1], fill: s.fill, ring: s.ring };
});

/** Ponto a `l` unidades do começo do traço. */
export function pointAt(s: Stroke, l: number): Pt {
  if (l <= 0) return s.pts[0];
  if (l >= s.len) return s.pts[s.pts.length - 1];
  let lo = 0;
  let hi = s.cum.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (s.cum[m] < l) lo = m;
    else hi = m;
  }
  const t = (l - s.cum[lo]) / (s.cum[hi] - s.cum[lo] || 1);
  const a = s.pts[lo];
  const b = s.pts[hi];
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** O "ar" custa menos que a tinta: a mão anda mais rápido com a caneta erguida. */
const AIR_COST = 0.55;

type Seg = { kind: 'ink'; i: number; dur: number } | { kind: 'air'; from: Pt; to: Pt; dur: number };

const SEGS: Seg[] = [];
STROKES.forEach((s, i) => {
  SEGS.push({ kind: 'ink', i, dur: s.len });
  const next = STROKES[i + 1];
  if (next) {
    const from = s.pts[s.pts.length - 1];
    const to = next.pts[0];
    SEGS.push({ kind: 'air', from, to, dur: Math.hypot(to[0] - from[0], to[1] - from[1]) * AIR_COST });
  }
});
const TOTAL = SEGS.reduce((a, s) => a + s.dur, 0);

export type PenState = {
  /** Ponta da caneta, em unidades da assinatura. */
  tip: Pt;
  /** Altura da ponta acima do papel (0 = encostada), em unidades da assinatura. */
  lift: number;
  /** Traço sendo escrito agora e quanto dele já tem tinta. Traços antes dele estão completos. */
  stroke: number;
  drawn: number;
};

/** Estado da escrita para um progresso u em [0, 1]. */
export function penAt(u: number): PenState {
  let t = Math.min(Math.max(u, 0), 1) * TOTAL;
  for (let k = 0; k < SEGS.length; k++) {
    const seg = SEGS[k];
    if (t <= seg.dur || k === SEGS.length - 1) {
      if (seg.kind === 'ink') {
        const s = STROKES[seg.i];
        const l = Math.min(t, s.len);
        return { tip: pointAt(s, l), lift: 0, stroke: seg.i, drawn: l };
      }
      const f = seg.dur ? t / seg.dur : 1;
      const e = f * f * (3 - 2 * f);
      const d = Math.hypot(seg.to[0] - seg.from[0], seg.to[1] - seg.from[1]);
      return {
        tip: [seg.from[0] + (seg.to[0] - seg.from[0]) * e, seg.from[1] + (seg.to[1] - seg.from[1]) * e],
        lift: Math.sin(Math.PI * f) * Math.min(220, 60 + d * 0.25),
        stroke: (SEGS[k - 1] as { i: number }).i + 1,
        drawn: 0,
      };
    }
    t -= seg.dur;
  }
  const last = STROKES[STROKES.length - 1];
  return { tip: last.pts[last.pts.length - 1], lift: 0, stroke: STROKES.length - 1, drawn: last.len };
}

export const FIRST_POINT = STROKES[0].pts[0];
export const LAST_POINT = STROKES[STROKES.length - 1].pts[STROKES[STROKES.length - 1].pts.length - 1];

/**
 * Em que momento da escrita (0 a 1, mesma escala de penAt) a ponta começa cada traço.
 * Um ponto a `l` do começo do traço i é alcançado em STROKE_START[i] + l / TOTAL_TIME.
 */
export const TOTAL_TIME = TOTAL;
export const STROKE_START: number[] = (() => {
  const out: number[] = [];
  let acc = 0;
  for (const seg of SEGS) {
    if (seg.kind === 'ink') out[seg.i] = acc / TOTAL;
    acc += seg.dur;
  }
  return out;
})();
