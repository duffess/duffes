import * as THREE from 'three';
import { VIEWBOX } from '../brand/sigPath';
import { PAPER, signatureWidthFraction } from './paperSize';
import { COLORS } from '../brand/data';

/**
 * Papel creme desenhado uma vez num canvas 2D. A tinta não é redesenhada a cada
 * quadro: um mapa guarda em que instante da escrita cada pixel recebe tinta, e o
 * shader do papel só compara esse instante com o progresso (um número por quadro).
 */

/** Centro da assinatura no papel (fração), um pouco acima do meio. */
const SIG_C = { x: 0.5, y: 0.46 };

export function createPaper(lite: boolean, lang: 'pt' | 'en', shapeTex: THREE.Texture, timeTex: THREE.Texture) {
  const en = lang === 'en';
  const W = lite ? 1280 : 2400;
  const H = Math.round((W * PAPER.h) / PAPER.w);
  const s = (signatureWidthFraction * W) / VIEWBOX.w; // px por unidade da assinatura
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

  return { material, setProgress, toLocal, unit, dispose() { paperTex.dispose(); material.dispose(); } };
}
