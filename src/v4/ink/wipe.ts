import { COLORS } from '../brand/data';

/**
 * A tinta que toma a tela: uma mancha vinho sai do fim da assinatura,
 * de borda irregular, e logo atrás dela vem o creme do papel.
 * Canvas 2D para as cores baterem exatamente com o CSS da seção seguinte.
 */
export function createWipe(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let lastT = -1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    lastT = -1;
  };
  resize();

  // Ruído da borda: soma de senos com fases fixas (a mancha não "treme").
  const waves = Array.from({ length: 7 }, (_, i) => ({
    f: 3 + i * 2 + (i % 2),
    ph: (i * 2.39) % (Math.PI * 2),
    a: 0.5 / (i + 1.2),
  }));
  // Pingos: alguns lóbulos que avançam mais que o resto.
  const drips = Array.from({ length: 9 }, (_, i) => ({
    th: (i / 9) * Math.PI * 2 + i * 0.7,
    a: 0.12 + ((i * 37) % 10) / 60,
  }));

  const splats = Array.from({ length: 34 }, (_, i) => ({
    th: i * 2.399,
    d: 1.05 + ((i * 53) % 17) / 40,
    s: 0.4 + ((i * 29) % 11) / 11,
  }));

  const edge = (th: number, seed: number) => {
    let n = 0;
    for (const wv of waves) n += Math.sin(th * wv.f + wv.ph + seed) * wv.a;
    let dr = 0;
    for (const dp of drips) {
      const a = th - dp.th - seed * 0.3;
      const dd = Math.atan2(Math.sin(a), Math.cos(a));
      dr += Math.exp(-(dd * dd) / 0.004) * dp.a;
    }
    return { scale: 1 + n * 0.14 + dr * 0.6, offset: n * 14, cos: Math.cos(th), sin: Math.sin(th) };
  };

  const contour = (seed: number) => Array.from({ length: 221 }, (_, i) => edge(i / 220 * Math.PI * 2, seed));
  const outer = contour(0), inner = contour(0.12), paper = contour(2.1);

  const blob = (cx: number, cy: number, r: number, points: typeof outer, color: string) => {
    if (r <= 0) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const rr = Math.max(r * point.scale + point.offset, 0);
      const x = cx + point.cos * rr;
      const y = cy + point.sin * rr;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  /** t em [0, 1]; (cx, cy) em fração da tela. */
  function draw(t: number, cx: number, cy: number) {
    const q = Math.round(t * 2000) / 2000;
    if (q === lastT) return;
    lastT = q;
    canvas.style.visibility = t <= 0 ? 'hidden' : 'visible';
    if (t <= 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (t >= 1) {
      ctx.fillStyle = COLORS.creme;
      ctx.fillRect(0, 0, w, h);
      return;
    }
    const x = Math.min(Math.max(cx, 0), 1) * w;
    const y = Math.min(Math.max(cy, 0), 1) * h;
    const far = Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y));
    const R = far * 1.35;
    const ink = Math.pow(Math.min(t / 0.7, 1), 1.6);
    const cream = Math.pow(Math.max((t - 0.3) / 0.7, 0), 1.5);
    blob(x, y, ink * R * 1.02, outer, COLORS.vinho2);
    blob(x, y, ink * R, inner, COLORS.vinho);
    // respingos à frente da mancha
    ctx.fillStyle = COLORS.vinho;
    const r0 = ink * R;
    for (const sp of splats) {
      const rr = r0 * sp.d + 6;
      const sz = sp.s * (4 + r0 * 0.02) * Math.min(t * 6, 1);
      ctx.beginPath();
      ctx.arc(x + Math.cos(sp.th) * rr, y + Math.sin(sp.th) * rr, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    blob(x, y, cream * R, paper, COLORS.creme);
  }

  return { draw, resize };
}
