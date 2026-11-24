import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Caneta-tinteiro feita só com geometria do Three.js.
 * Origem na ponta da pena; o eixo da caneta é +Y; a face de cima da pena olha para +Z.
 */

const lathe = (pts: [number, number][], seg = 48) =>
  new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

/** Pena: um pedaço de cone, pontudo na frente, com ombros antes de entrar na seção. */
function nibGeometry() {
  const H = 0.36;
  const U = 28;
  const V = 40;
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  for (let j = 0; j <= V; j++) {
    const v = j / V;
    const y = v * H;
    const r = 0.005 + 0.07 * Math.pow(v, 0.9);
    // contorno: ponta fina, alarga rápido, ombro leve perto do fim
    const span = 1.05 * Math.pow(Math.min(v / 0.62, 1), 0.55) * (1 - 0.12 * Math.max(0, (v - 0.8) / 0.2));
    for (let i = 0; i <= U; i++) {
      const u = (i / U) * 2 - 1;
      const th = u * span;
      pos.push(r * Math.sin(th), y, r * Math.cos(th));
      uv.push(i / U, v);
    }
  }
  for (let j = 0; j < V; j++) {
    for (let i = 0; i < U; i++) {
      const a = j * (U + 1) + i;
      const b = a + U + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Clipe da tampa: uma fita curva. */
function clipGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0.13),
    new THREE.Vector3(0, -0.1, 0.165),
    new THREE.Vector3(0, -0.45, 0.17),
    new THREE.Vector3(0, -0.62, 0.155),
    new THREE.Vector3(0, -0.66, 0.14),
  ]);
  const shape = new THREE.Shape();
  shape.moveTo(-0.028, -0.008);
  shape.lineTo(0.028, -0.008);
  shape.lineTo(0.028, 0.008);
  shape.lineTo(-0.028, 0.008);
  return new THREE.ExtrudeGeometry(shape, { steps: 40, extrudePath: curve, bevelEnabled: false });
}

export type PenMaterials = ReturnType<typeof makeMaterials>;

function makeMaterials() {
  return {
    vinho: new THREE.MeshPhysicalMaterial({
      color: '#5e0a08',
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      sheen: 0.4,
      sheenColor: new THREE.Color('#a0322a'),
    }),
    ouro: new THREE.MeshStandardMaterial({ color: '#d9ad62', metalness: 1, roughness: 0.2 }),
    ouroPena: new THREE.MeshStandardMaterial({ color: '#e2b86c', metalness: 1, roughness: 0.16, side: THREE.DoubleSide }),
    preto: new THREE.MeshPhysicalMaterial({ color: '#14110f', roughness: 0.3, clearcoat: 0.8 }),
    fenda: new THREE.MeshBasicMaterial({ color: '#1a120a' }),
  };
}

export const Pen = forwardRef<THREE.Group, { shadows?: boolean }>(function Pen({ shadows = true }, ref) {
  const m = useMemo(makeMaterials, []);
  const geo = useMemo(
    () => ({
      nib: nibGeometry(),
      feed: lathe([
        [0.0, 0.05],
        [0.012, 0.06],
        [0.05, 0.25],
        [0.066, 0.34],
        [0.0, 0.34],
      ]),
      section: lathe([
        [0.0, 0.3],
        [0.072, 0.3],
        [0.082, 0.33],
        [0.086, 0.45],
        [0.084, 0.58],
        [0.092, 0.7],
        [0.1, 0.76],
        [0.0, 0.76],
      ]),
      ringA: lathe([
        [0.0, 0.76],
        [0.112, 0.76],
        [0.116, 0.775],
        [0.116, 0.805],
        [0.112, 0.82],
        [0.0, 0.82],
      ]),
      barrel: lathe([
        [0.0, 0.82],
        [0.112, 0.82],
        [0.118, 0.95],
        [0.12, 1.4],
        [0.116, 1.75],
        [0.0, 1.75],
      ]),
      // tampa encaixada atrás, como quem escreve de verdade
      cap: lathe([
        [0.0, 1.62],
        [0.124, 1.62],
        [0.128, 1.68],
        [0.13, 2.1],
        [0.126, 2.36],
        [0.112, 2.44],
        [0.08, 2.48],
        [0.0, 2.49],
      ]),
      capBand: lathe([
        [0.0, 1.66],
        [0.134, 1.66],
        [0.137, 1.68],
        [0.137, 1.74],
        [0.134, 1.76],
        [0.0, 1.76],
      ]),
      finial: lathe([
        [0.0, 2.44],
        [0.085, 2.44],
        [0.088, 2.47],
        [0.06, 2.505],
        [0.0, 2.51],
      ]),
      clip: clipGeometry(),
      slit: new THREE.PlaneGeometry(0.0035, 0.2),
      hole: new THREE.CircleGeometry(0.011, 20),
    }),
    [],
  );

  return (
    <group ref={ref} dispose={null}>
      <mesh geometry={geo.nib} material={m.ouroPena} castShadow={shadows} />
      {/* fenda e respiro da pena, colados à superfície */}
      <mesh geometry={geo.slit} material={m.fenda} position={[0, 0.1, 0.0265]} rotation={[0.2, 0, 0]} />
      <mesh geometry={geo.hole} material={m.fenda} position={[0, 0.205, 0.0485]} rotation={[0.2, 0, 0]} />
      <mesh geometry={geo.feed} material={m.preto} position={[0, 0, -0.022]} castShadow={shadows} />
      <mesh geometry={geo.section} material={m.preto} castShadow={shadows} />
      <mesh geometry={geo.ringA} material={m.ouro} castShadow={shadows} />
      <mesh geometry={geo.barrel} material={m.vinho} castShadow={shadows} />
      <mesh geometry={geo.cap} material={m.vinho} castShadow={shadows} />
      <mesh geometry={geo.capBand} material={m.ouro} />
      <mesh geometry={geo.finial} material={m.ouro} />
      <mesh geometry={geo.clip} material={m.ouro} position={[0, 2.3, 0]} castShadow={shadows} />
    </group>
  );
});

/** Comprimento da caneta e onde fica o meio dela (para girar em torno do centro). */
export const PEN_LENGTH = 2.51;
export const PEN_CENTER = 1.25;
