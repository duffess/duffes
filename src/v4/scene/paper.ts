import * as THREE from 'three';
import { FILLS, PEN, STROKES, STROKE_START, TOTAL_TIME, VIEWBOX } from '../brand/sigPath';
import { COLORS } from '../brand/data';

/**
 * Papel creme desenhado uma vez num canvas 2D. A tinta não é redesenhada a cada
 * quadro: um mapa guarda em que instante da escrita cada pixel recebe tinta, e o
 * shader do papel só compara esse instante com o progresso (um número por quadro).
 */

export const PAPER = { w: 5, h: 3.6 };
/** Largura da assinatura no papel, em unidades da cena. */
const SIG_W = 3.7;
/** Centro da assinatura no papel (fração), um pouco acima do meio. */
const SIG_C = { x: 0.5, y: 0.46 };

export function createPaper(lite: boolean, lang: 'pt' | 'en' = 'pt') {
  const en = lang === 'en';
  const W = lite ? 1280 : 2400;
  const H = Math.round((W * PAPER.h) / PAPER.w);
  const s = ((SIG_W / PAPER.w) * W) / VIEWBOX.w; // px por unidade da assinatura
  const ox = SIG_C.x * W - (VIEWBOX.w / 2) * s - VIEWBOX.x * s;
  const oy = SIG_C.y * H - (VIEWBOX.h / 2) * s - VIEWBOX.y * s;

  const mk = () => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    return [c, c.getContext('2d')!] as const;
  };
  const [base, bctx] = mk();

  // Papel: creme, fibras leves e uma linha de assinatura com legenda.
  bctx.fillStyle = COLORS.creme;
  bctx.fillRect(0, 0, W, H);
  const g = bctx.createRadialGradient(W * 0.5, H * 0.45, W * 0.1, W * 0.5, H * 0.5, W * 0.75);
  g.addColorStop(0, 'rgba(255,248,235,0.18)');
  g.addColorStop(1, 'rgba(120,80,40,0.14)');
  bctx.fillStyle = g;
  bctx.fillRect(0, 0, W, H);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < W * 2.2; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const l = 2 + rnd() * 10 * (W / 2400);
    const a = rnd() * Math.PI;
    bctx.strokeStyle = `rgba(${rnd() < 0.5 ? '90,60,30' : '255,250,240'},${0.035 + rnd() * 0.05})`;
    bctx.lineWidth = 1;
    bctx.beginPath();
    bctx.moveTo(x, y);
    bctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    bctx.stroke();
  }
  const k = W / 2400;
  const lineY = oy + 2240 * s;
  bctx.strokeStyle = 'rgba(28,26,23,0.42)';
  bctx.lineWidth = 3 * k;
  bctx.beginPath();
  bctx.moveTo(W * 0.16, lineY);
  bctx.lineTo(W * 0.84, lineY);
  bctx.stroke();
  bctx.fillStyle = 'rgba(28,26,23,0.62)';
  bctx.font = `600 ${30 * k}px "Instrument Sans Variable", system-ui, sans-serif`;
  bctx.fillText('LYSS · Isabela & Guilherme', W * 0.16, lineY + 54 * k);
  bctx.textAlign = 'right';
  bctx.fillText(en ? 'This site comes signed.' : 'Este site sai assinado.', W * 0.84, lineY + 54 * k);
  bctx.textAlign = 'left';
  bctx.font = `700 ${28 * k}px "Instrument Sans Variable", system-ui, sans-serif`;
  bctx.fillStyle = 'rgba(89,9,7,0.8)';
  bctx.fillText(en ? 'CONTRACT No. 001' : 'CONTRATO Nº 001', W * 0.08, H * 0.09);
  bctx.font = `500 ${24 * k}px "Instrument Sans Variable", system-ui, sans-serif`;
  bctx.fillStyle = 'rgba(28,26,23,0.5)';
  bctx.fillText(
    en ? 'Custom website, with a button straight to WhatsApp.' : 'Site sob medida, com botão direto para o WhatsApp.',
    W * 0.08,
    H * 0.09 + 40 * k,
  );

  const paperTex = new THREE.CanvasTexture(base);
  paperTex.colorSpace = THREE.SRGBColorSpace;
  paperTex.anisotropy = 8;

  // ---------- Assinatura: forma da tinta e instante de cada pixel ----------
  const sx0 = ox + VIEWBOX.x * s;
  const sy0 = oy + VIEWBOX.y * s;
  const sw = VIEWBOX.w * s;
  const sh = VIEWBOX.h * s;
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
  const shapeTex = new THREE.CanvasTexture(shapeCanvas);
  shapeTex.anisotropy = 8;

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
      half[dst + x] = THREE.DataUtils.toHalfFloat(v);
    }
  }
  const timeTex = new THREE.DataTexture(half, MW, MH, THREE.RedFormat, THREE.HalfFloatType);
  timeTex.magFilter = THREE.LinearFilter;
  timeTex.minFilter = THREE.LinearFilter;
  timeTex.needsUpdate = true;

  // ---------- Material: o papel revela a tinta até o progresso atual ----------
  const uniforms = {
    uInkShape: { value: shapeTex },
    uInkTime: { value: timeTex },
    uProgress: { value: -1 },
    uInkColor: { value: new THREE.Color('#4d0705') },
    uSigRect: { value: new THREE.Vector4(sx0 / W, sy0 / H, sw / W, sh / H) },
  };
  const material = new THREE.MeshStandardMaterial({ map: paperTex, roughness: 0.88, envMapIntensity: 0.3 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        'void main() {',
        `uniform sampler2D uInkShape;
uniform sampler2D uInkTime;
uniform float uProgress;
uniform vec3 uInkColor;
uniform vec4 uSigRect;
void main() {`,
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
{
  vec2 cuv = vec2((vMapUv.x - uSigRect.x) / uSigRect.z, ((1.0 - vMapUv.y) - uSigRect.y) / uSigRect.w);
  if (cuv.x > 0.0 && cuv.x < 1.0 && cuv.y > 0.0 && cuv.y < 1.0) {
    vec2 tuv = vec2(cuv.x, 1.0 - cuv.y);
    float shape = texture2D(uInkShape, tuv).a;
    float t = texture2D(uInkTime, tuv).r;
    float on = 1.0 - smoothstep(uProgress - 0.0005, uProgress + 0.0002, t);
    diffuseColor.rgb = mix(diffuseColor.rgb, uInkColor, shape * on);
  }
}`,
      );
  };

  /** Progresso da escrita, na mesma escala de penAt (menor que 0: papel limpo; 1 ou mais: assinado). */
  function setProgress(u: number) {
    uniforms.uProgress.value = u;
  }

  /** Ponto da assinatura (unidades do SVG) no espaço local do papel (x, z). */
  function toLocal(x: number, y: number): [number, number] {
    const px = ox + x * s;
    const py = oy + y * s;
    return [(px / W - 0.5) * PAPER.w, (py / H - 0.5) * PAPER.h];
  }
  /** Quantas unidades da cena vale uma unidade da assinatura. */
  const unit = (s / W) * PAPER.w;

  return { material, setProgress, toLocal, unit };
}
