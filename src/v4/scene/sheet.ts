import * as THREE from 'three';
import { projectText } from '../brand/projects';
import type { Project } from '../brand/projects';
import { COLORS } from '../brand/data';

/**
 * Uma folha de papel com o site impresso.
 * O vértice curva a ponta da folha em volta de um cilindro (como papel levantado pelo canto)
 * e o fragmento acende a impressão quando o mouse chega: de papel impresso a site vivo.
 */

export const SHEET = { w: 3, h: 2.3, seg: [56, 40] as const };
/** Área da impressão na folha (fração, a partir do canto de cima à esquerda). */
const MEDIA = { x: 0.06, y: 0.06, w: 0.88 };
const MEDIA_ASPECT = 1.6;
const MEDIA_H = (MEDIA.w * SHEET.w) / MEDIA_ASPECT / SHEET.h;

/** Centro da impressão no espaço local da folha (x, y do plano, antes de deitar). */
export const MEDIA_CENTER = new THREE.Vector2(
  (MEDIA.x + MEDIA.w / 2 - 0.5) * SHEET.w,
  (0.5 - (MEDIA.y + MEDIA_H / 2)) * SHEET.h,
);

function paperCanvas(p: Project, index: number, total: number, lite: boolean, lang: 'pt' | 'en') {
  const W = lite ? 768 : 1280;
  const H = Math.round((W * SHEET.h) / SHEET.w);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d')!;
  x.fillStyle = '#f1e4d2';
  x.fillRect(0, 0, W, H);
  // fibras
  let seed = 11 + index * 31;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < W * 1.4; i++) {
    const px = rnd() * W;
    const py = rnd() * H;
    const l = 2 + rnd() * 7 * (W / 1280);
    const a = rnd() * Math.PI;
    x.strokeStyle = `rgba(${rnd() < 0.5 ? '90,60,30' : '255,250,240'},${0.03 + rnd() * 0.04})`;
    x.beginPath();
    x.moveTo(px, py);
    x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l);
    x.stroke();
  }
  const k = W / 1280;
  const top = (MEDIA.y + MEDIA_H) * H;
  const left = MEDIA.x * W;
  const right = (MEDIA.x + MEDIA.w) * W;
  // moldura fina da impressão
  x.strokeStyle = 'rgba(28,26,23,0.18)';
  x.lineWidth = 2 * k;
  x.strokeRect(left, MEDIA.y * H, right - left, top - MEDIA.y * H);
  x.fillStyle = COLORS.vinho;
  x.font = `400 ${54 * k}px "Agilov", sans-serif`;
  x.textBaseline = 'alphabetic';
  x.fillText(p.title, left, top + 90 * k);
  x.fillStyle = 'rgba(28,26,23,0.72)';
  x.font = `600 ${24 * k}px "Instrument Sans Variable", system-ui, sans-serif`;
  x.fillText(`${projectText(p, lang).kind}${p.place ? ` · ${p.place}` : ''}`, left, top + 132 * k);
  x.textAlign = 'right';
  x.font = `700 ${24 * k}px "Instrument Sans Variable", system-ui, sans-serif`;
  x.fillText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, right, top + 90 * k);
  return c;
}

export type SheetMat = {
  material: THREE.MeshStandardMaterial;
  uniforms: {
    uCurl: { value: number };
    uBend: { value: number };
    uAlive: { value: number };
    uZoom: { value: number };
  };
  /** Começa ou para o vídeo (quando houver). */
  setPlaying(on: boolean): void;
  dispose(): void;
};

export function createSheet(p: Project, index: number, total: number, lite: boolean, lang: 'pt' | 'en', invalidate: () => void): SheetMat {
  const paper = new THREE.CanvasTexture(paperCanvas(p, index, total, lite, lang));
  paper.colorSpace = THREE.SRGBColorSpace;
  paper.anisotropy = 8;

  // Impressão: vídeo se houver, senão a imagem.
  let video: HTMLVideoElement | null = null;
  let media: THREE.Texture;
  const mediaScale = new THREE.Vector2(1, 1);
  const mediaOffset = new THREE.Vector2(0, 0);
  const fit = (w: number, h: number) => {
    invalidate();
    // como object-fit: cover, alinhado ao topo (o começo do site é o que importa)
    const a = w / h;
    if (a > MEDIA_ASPECT) {
      mediaScale.set(MEDIA_ASPECT / a, 1);
      mediaOffset.set((1 - MEDIA_ASPECT / a) / 2, 0);
    } else {
      mediaScale.set(1, a / MEDIA_ASPECT);
      mediaOffset.set(0, 1 - a / MEDIA_ASPECT);
    }
  };
  if (p.video) {
    video = document.createElement('video');
    video.src = p.video;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.addEventListener('loadedmetadata', () => fit(video!.videoWidth, video!.videoHeight));
    media = new THREE.VideoTexture(video);
  } else {
    media = new THREE.TextureLoader().load(lite ? p.imageSmall : p.image, (t) => {
      const img = t.image as HTMLImageElement;
      fit(img.width, img.height);
    });
  }
  media.colorSpace = THREE.SRGBColorSpace;
  media.anisotropy = 8;

  const uniforms = {
    uCurl: { value: 0 },
    uBend: { value: 0 },
    uAlive: { value: 0 },
    uZoom: { value: 0 },
  };
  const material = new THREE.MeshStandardMaterial({
    map: paper,
    roughness: 0.92,
    side: THREE.DoubleSide,
    envMapIntensity: 0.6,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, {
      uMedia: { value: media },
      uMediaRect: { value: new THREE.Vector4(MEDIA.x, MEDIA.y, MEDIA.w, MEDIA_H) },
      uMediaScale: { value: mediaScale },
      uMediaOffset: { value: mediaOffset },
      uBack: { value: new THREE.Color('#e6d4bb') },
      uHalf: { value: new THREE.Vector2(SHEET.w / 2, SHEET.h / 2) },
    });
    const curl = /* glsl */ `
      vec2 cn = normalize(vec2(1.0, -1.0));
      vec2 corner = vec2(uHalf.x, -uHalf.y);
      float reach = uCurl * 1.05;
      float d = dot(position.xy - corner, cn) + reach;
      float R = 0.32;
      float th = 0.0;
      vec3 cpos = position;
      if (d > 0.0) {
        th = min(d / R, 3.0);
        cpos.xy = position.xy - cn * d + cn * R * sin(th);
        cpos.z = R * (1.0 - cos(th));
      }
      vec2 q = position.xy / uHalf;
      cpos.z += uBend * 0.09 * (1.0 - q.x * q.x) * (1.0 - 0.4 * q.y * q.y);
    `;
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', 'uniform float uCurl;\nuniform float uBend;\nuniform vec2 uHalf;\nvoid main() {')
      .replace(
        '#include <beginnormal_vertex>',
        `${curl}
        vec3 objectNormal = d > 0.0 ? vec3(-cn * sin(th), cos(th)) : vec3(0.0, 0.0, 1.0);
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif`,
      )
      .replace('#include <begin_vertex>', 'vec3 transformed = cpos;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        'void main() {',
        `uniform sampler2D uMedia;
uniform vec4 uMediaRect;
uniform vec2 uMediaScale;
uniform vec2 uMediaOffset;
uniform vec3 uBack;
uniform float uAlive;
uniform float uZoom;
void main() {`,
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
{
  vec2 puv = vec2(vMapUv.x, 1.0 - vMapUv.y);
  vec2 m = (puv - uMediaRect.xy) / uMediaRect.zw;
  if (m.x > 0.0 && m.x < 1.0 && m.y > 0.0 && m.y < 1.0) {
    vec2 z = (m - 0.5) / (1.0 + uZoom * 0.05) + 0.5;
    vec2 tuv = uMediaOffset + z * uMediaScale;
    vec3 c = texture2D(uMedia, vec2(tuv.x, 1.0 - tuv.y)).rgb;
    float g = dot(c, vec3(0.299, 0.587, 0.114));
    // impresso no papel (dessaturado, com a cor do papel) -> aceso
    vec3 printed = mix(vec3(g), c, 0.55) * mix(diffuseColor.rgb, vec3(1.0), 0.35);
    diffuseColor.rgb = mix(printed, c, uAlive);
  }
  if (!gl_FrontFacing) diffuseColor.rgb = uBack;
}`,
      );
  };

  let playing = false;
  return {
    material,
    uniforms,
    setPlaying(on) {
      if (!video || playing === on) return;
      playing = on;
      if (on) video.play().catch(() => {});
      else video.pause();
    },
    dispose() {
      paper.dispose();
      media.dispose();
      material.dispose();
      video?.pause();
    },
  };
}

/** Sombra suave de uma folha (textura gerada uma vez). */
export function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 200;
  const x = c.getContext('2d')!;
  x.filter = 'blur(14px)';
  x.fillStyle = 'rgba(60,30,10,1)';
  x.fillRect(34, 34, 188, 132);
  const t = new THREE.CanvasTexture(c);
  return t;
}
