import { DataUtils } from 'three';
import { FILLS, PEN, STROKES, STROKE_START, TOTAL_TIME, VIEWBOX } from '../src/v4/brand/sigPath';
import { signatureWidthFraction } from '../src/v4/scene/paperSize';

export function bakeInk(lite: boolean) {
  const sw = signatureWidthFraction * (lite ? 1280 : 2400);
  const sh = sw * VIEWBOX.h / VIEWBOX.w;
  const fills = FILLS.map((f) => new Path2D(f.d));

  // Forma: as áreas preenchidas da assinatura, em boa resolução (fica igual à de antes).
  const shapeW = Math.round(sw);
  const shapeH = Math.round(sh);
  const shapeCanvas = document.createElement('canvas');
  shapeCanvas.width = shapeW;
  shapeCanvas.height = shapeH;
  const sctx = shapeCanvas.getContext('2d')!;
  sctx.setTransform(shapeW / VIEWBOX.w, 0, 0, shapeH / VIEWBOX.h, -VIEWBOX.x * (shapeW / VIEWBOX.w), -VIEWBOX.y * (shapeH / VIEWBOX.h));
  sctx.fillStyle = '#fff';
  fills.forEach((p, i) => sctx.fill(p, FILLS[i].ring ? 'evenodd' : 'nonzero'));


  // Instante: para cada pixel, o primeiro momento em que a ponta (com a largura da pena)
  // passa sobre ele, dentro da forma do próprio traço. Igual à máscara do duffes, só que pré-calculada.
  const MW = lite ? 640 : 1024;
  const MH = Math.round((MW * VIEWBOX.h) / VIEWBOX.w);
  const m = MW / VIEWBOX.w; // px do mapa por unidade da assinatura
  const NEVER = 4;
  const loose = new Float32Array(MW * MH).fill(NEVER); // sem recorte: usado nas bordas
  const tight = new Float32Array(MW * MH).fill(NEVER); // recortado pela forma do traço
  const mctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
  mctx.canvas.width = MW;
  mctx.canvas.height = MH;
  const rad = (PEN / 2) * m + 0.75;
  const r2 = rad * rad;
  const stepU = 0.7 / m;

  STROKES.forEach((st, i) => {
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.clearRect(0, 0, MW, MH);
    mctx.setTransform(m, 0, 0, m, -VIEWBOX.x * m, -VIEWBOX.y * m);
    mctx.fill(fills[i], FILLS[i].ring ? 'evenodd' : 'nonzero');
    const alpha = mctx.getImageData(0, 0, MW, MH).data;
    const t0 = STROKE_START[i];
    let j = 0;
    for (let l = 0; l <= st.len; l += stepU) {
      while (j < st.cum.length - 2 && st.cum[j + 1] < l) j++;
      const a = st.pts[j];
      const b = st.pts[j + 1] ?? a;
      const f = (l - st.cum[j]) / (st.cum[j + 1] - st.cum[j] || 1);
      const cx = (a[0] + (b[0] - a[0]) * f - VIEWBOX.x) * m;
      const cy = (a[1] + (b[1] - a[1]) * f - VIEWBOX.y) * m;
      const t = t0 + l / TOTAL_TIME;
      const x0 = Math.max(0, Math.floor(cx - rad));
      const x1 = Math.min(MW - 1, Math.ceil(cx + rad));
      const y0 = Math.max(0, Math.floor(cy - rad));
      const y1 = Math.min(MH - 1, Math.ceil(cy + rad));
      for (let y = y0; y <= y1; y++) {
        const dy = y + 0.5 - cy;
        const row = y * MW;
        for (let x = x0; x <= x1; x++) {
          const dx = x + 0.5 - cx;
          if (dx * dx + dy * dy > r2) continue;
          const k = row + x;
          if (t < loose[k]) loose[k] = t;
          if (alpha[k * 4 + 3] > 0 && t < tight[k]) tight[k] = t;
        }
      }
    }
  });

  // Linhas de baixo para cima (v = 0 embaixo), em meia precisão.
  const half = new Uint16Array(MW * MH);
  for (let y = 0; y < MH; y++) {
    const src = (MH - 1 - y) * MW;
    const dst = y * MW;
    for (let x = 0; x < MW; x++) {
      const v = tight[src + x] < NEVER ? tight[src + x] : loose[src + x];
      half[dst + x] = DataUtils.toHalfFloat(v);
    }
  }
  return { shape: shapeCanvas.toDataURL('image/png'), half };
}
