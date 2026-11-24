import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { projects } from '../brand/projects';
import { COLORS } from '../brand/data';
import { createSheet, MEDIA_CENTER, SHEET, shadowTexture } from './sheet';
import { N, sheetCursor, work } from './workState';
import { range, smooth } from './state';

type Props = { lite: boolean; lang: 'pt' | 'en'; running: boolean; onPick: (i: number) => void };

const SPACING = 6.2;
const JITTER = [
  { z: 0.05, r: -0.06 },
  { z: -0.12, r: 0.045 },
  { z: 0.1, r: -0.035 },
  { z: -0.05, r: 0.06 },
];
const sheetX = (c: number) => c * SPACING;

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

function Sheets({ lite, lang, onPick }: { lite: boolean; lang: 'pt' | 'en'; onPick: (i: number) => void }) {
  const mats = useMemo(() => projects.map((p, i) => createSheet(p, i, N, lite, lang)), [lite, lang]);
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  const geo = useMemo(() => new THREE.PlaneGeometry(SHEET.w, SHEET.h, ...SHEET.seg), []);
  const shadowTex = useMemo(shadowTexture, []);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const shadows = useRef<(THREE.Mesh | null)[]>([]);
  const amt = useMemo(() => projects.map(() => ({ h: 0, o: 0 })), []);

  useFrame((_, dt) => {
    const d = Math.min(dt, 1 / 20);
    const c = sheetCursor(work.p);
    const settled = Math.abs(c - Math.round(c)) < 0.02 && work.p > 0.12;
    projects.forEach((_, i) => {
      const g = groups.current[i];
      const s = shadows.current[i];
      if (!g || !s) return;
      const a = amt[i];
      const want =
        work.hover === i || (lite && settled && Math.round(c) === i) ? 1 : 0;
      // mola: a dobra vem rápido e volta com calma
      a.h += (want - a.h) * (1 - Math.exp(-d * (want ? 8 : 5)));
      const o = work.open === i ? work.openAmt : 0;
      a.o = o;
      // A folha fica inteira e plana na mesa; o hover só dobra o canto.
      const m = mats[i].uniforms;
      m.uCurl.value = a.h * (1 - o) * 0.6;
      m.uBend.value = 0;
      m.uAlive.value = 1;
      m.uZoom.value = 0;
      mats[i].setPlaying(a.h > 0.5 || o > 0.5);
      const j = JITTER[i % JITTER.length];
      g.position.set(sheetX(i), 0.004 + o * 0.25, j.z);
      // giro em torno do eixo vertical (YXZ): a folha gira na mesa sem afundar nela
      g.rotation.order = 'YXZ';
      g.rotation.y = j.r * (1 - o);
      g.rotation.x = -Math.PI / 2;
      s.position.set(sheetX(i), 0.002, j.z);
      s.rotation.z = j.r;
    });
  });

  return (
    <>
      {projects.map((p, i) => (
        <group key={p.id}>
          <mesh
            ref={(el) => {
              shadows.current[i] = el;
            }}
            rotation-x={-Math.PI / 2}
            renderOrder={1}
          >
            <planeGeometry args={[SHEET.w * 1.26, SHEET.h * 1.34]} />
            <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.2} />
          </mesh>
          <group
            ref={(el) => {
              groups.current[i] = el;
            }}
          >
            <mesh
              name={`sheet-${i}`}
              geometry={geo}
              material={mats[i].material}
              onPointerOver={(e) => {
                e.stopPropagation();
                work.hover = i;
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                if (work.hover === i) work.hover = -1;
                document.body.style.cursor = '';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onPick(i);
              }}
            />
          </group>
        </group>
      ))}
    </>
  );
}

function Rig() {
  const { camera, size, scene } = useThree();
  const portrait = size.width / size.height < 0.9;
  const k = useMemo(
    () => ({ p: 0, cam: V(), tgt: V(), camS: V(-2.5, 7, 7.5), tgtS: V(6, 0, -0.5), a: V(), b: V(), mc: V(), first: true }),
    [],
  );

  useFrame((_, dt) => {
    const d = Math.min(dt, 1 / 20);
    k.p += (work.p - k.p) * (1 - Math.exp(-d * 7));
    const p = k.p;
    const c = sheetCursor(p);
    const x = sheetX(c);
    const center = sheetX((N - 1) / 2);

    // Visão geral: a fila de folhas vista de lado, recuando na mesa.
    if (portrait) {
      k.cam.set(-3.2, 9.5, 11);
      k.tgt.set(center - 1.5, 0, -0.6);
    } else {
      k.cam.set(-3, 7.2, 7.6);
      k.tgt.set(center - 1, 0, -0.6);
    }
    // Uma folha por tela.
    if (portrait) {
      k.b.set(x, 0, 1.05);
      k.a.copy(k.b).add(V(0, 8.3, 5.1));
    } else {
      k.b.set(x - 1.25, 0, 0.12);
      k.a.copy(k.b).add(V(0, 4.9, 3.6));
    }
    const s = smooth(range(p, [0.03, 0.15]));
    k.cam.lerp(k.a, s);
    k.tgt.lerp(k.b, s);

    // Mergulho na folha aberta.
    if (work.open >= 0 && work.openAmt > 0) {
      const mesh = scene.getObjectByName(`sheet-${work.open}`);
      if (mesh) {
        k.mc.set(MEDIA_CENTER.x, MEDIA_CENTER.y, 0).applyMatrix4(mesh.matrixWorld);
        const dist = portrait ? 4.6 : 2.5;
        const e = work.openAmt;
        const ee = e * e * (3 - 2 * e);
        k.a.copy(k.mc).add(V(0, dist * 0.92, dist * 0.4));
        k.cam.lerp(k.a, ee);
        k.tgt.lerp(k.mc, ee);
      }
    }

    const rate = work.openAmt > 0 ? 14 : portrait ? 4.5 : 6;
    if (k.first) {
      k.camS.copy(k.cam);
      k.tgtS.copy(k.tgt);
      k.first = false;
    }
    k.camS.lerp(k.cam, 1 - Math.exp(-d * rate));
    k.tgtS.lerp(k.tgt, 1 - Math.exp(-d * rate));
    camera.position.copy(k.camS);
    camera.lookAt(k.tgtS);
  });
  return null;
}

function Loop({ running }: { running: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => setFrameloop(running ? 'always' : 'never'), [running, setFrameloop]);
  return null;
}

export default function Desk({ lite, lang, running, onPick }: Props) {
  return (
    <Canvas
      className="desk__canvas"
      flat
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ fov: lite ? 46 : 35, near: 0.1, far: 60, position: [-3, 7.2, 7.6] }}
      onPointerMissed={() => (work.hover = -1)}
      aria-hidden
    >
      <Loop running={running} />
      <color attach="background" args={[COLORS.creme]} />
      <fog attach="fog" args={[COLORS.creme, 12, 30]} />
      <Environment resolution={lite ? 64 : 128} frames={1} environmentIntensity={0.35}>
        <Lightformer form="rect" intensity={2} position={[0, 6, 2]} scale={[12, 6, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1} color="#f3d9b5" position={[-6, 2, 3]} scale={[2, 6, 1]} rotation-y={Math.PI / 2} />
      </Environment>
      <ambientLight intensity={1.25} color="#fff3e2" />
      <directionalLight position={[-3, 8, 5]} intensity={0.6} color="#fff1dc" />
      <mesh rotation-x={-Math.PI / 2} position={[sheetX((N - 1) / 2), 0, 0]}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial color={COLORS.creme} />
      </mesh>
      <Sheets lite={lite} lang={lang} onPick={onPick} />
      <Rig />
    </Canvas>
  );
}
