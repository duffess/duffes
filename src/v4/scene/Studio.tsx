import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { Pen, PEN_CENTER } from './Pen';
import { createPaper, PAPER } from './paper';
import { FIRST_POINT, LAST_POINT, penAt } from '../brand/sigPath';
import { COLORS } from '../brand/data';
import { PHASE, easeInOut, range, smooth, stage } from './state';
import { sound } from '../brand/sound';

type Props = { lite: boolean; lang: 'pt' | 'en'; onReady: () => void };

const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

/** Orientação da caneta: eixo `axis` (da ponta para o fim) e a face da pena virada para `face`. */
function penQuat(axis: THREE.Vector3, face: THREE.Vector3, spin: number, out: THREE.Quaternion) {
  const y = axis.clone().normalize();
  const z = face.clone().sub(y.clone().multiplyScalar(face.dot(y))).normalize();
  const x = new THREE.Vector3().crossVectors(y, z);
  const m = new THREE.Matrix4().makeBasis(x, y, z);
  out.setFromRotationMatrix(m);
  if (spin) out.multiply(new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0), spin));
  return out;
}

const DESK_ROT = -0.05;

function Scene({ lite, lang, onReady }: Props) {
  const pen = useRef<THREE.Group>(null);
  const desk = useRef<THREE.Group>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const { camera, size, setFrameloop } = useThree();
  const paper = useMemo(() => createPaper(lite, lang), [lite, lang]);
  const portrait = size.width / size.height < 0.9;

  // Tudo que é recalculado a cada quadro fica aqui, sem alocar.
  const k = useMemo(
    () => ({
      p: 0,
      t: 0,
      q: new THREE.Quaternion(),
      qa: new THREE.Quaternion(),
      qb: new THREE.Quaternion(),
      tip: V(),
      prevTip: V(),
      vel: V(),
      a: V(),
      b: V(),
      cam: V(),
      tgt: V(),
      camS: V(0, 2.2, 4.8),
      tgtS: V(0.2, 2.0, 0),
      mouse: new THREE.Vector2(),
      mouseS: new THREE.Vector2(),
      deskM: new THREE.Matrix4(),
      first: true,
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      k.mouse.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [k]);

  // A cena para de desenhar quando a tinta já cobriu a tela.
  useEffect(() => {
    let mode: 'always' | 'never' = 'always';
    const id = window.setInterval(() => {
      const want = stage.p > 0.995 ? 'never' : 'always';
      if (want !== mode) {
        mode = want;
        setFrameloop(want);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [setFrameloop]);

  /** Ponto da assinatura (unidades do SVG) no mundo, `h` acima do papel. */
  const sigToWorld = (x: number, y: number, h: number, out: THREE.Vector3) => {
    const [lx, lz] = paper.toLocal(x, y);
    out.set(lx, h, lz);
    const c = Math.cos(DESK_ROT);
    const s = Math.sin(DESK_ROT);
    return out.set(lx * c + lz * s, h, -lx * s + lz * c);
  };

  // Poses fixas
  const heroAxis = useMemo(() => (portrait ? V(0.32, 1, 0.12) : V(0.62, 0.92, 0.12)).normalize(), [portrait]);
  const heroCenter = useMemo(() => (portrait ? V(0, 2.15, 0) : V(1.5, 2.1, 0.2)), [portrait]);
  const writeAxis = V(0.14, 0.72, 0.68).normalize();
  const writeFace = V(-0.15, 0.9, 0.2);
  const exitTip = V(3.4, 2.8, 1.6);
  const lastW = useMemo(() => sigToWorld(LAST_POINT[0], LAST_POINT[1], 0, V()), []); // eslint-disable-line react-hooks/exhaustive-deps
  const firstW = useMemo(() => sigToWorld(FIRST_POINT[0], FIRST_POINT[1], 0.22, V()), []); // eslint-disable-line react-hooks/exhaustive-deps
  const proj = useMemo(() => V(), []);

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 20);
    k.t += d;
    // progresso amortecido: a câmera nunca dá tranco, mesmo com rolagem brusca
    k.p += (stage.p - k.p) * (1 - Math.exp(-d * 7));
    if (Math.abs(stage.p - k.p) < 1e-4) k.p = stage.p;
    const p = k.p;
    k.mouseS.lerp(k.mouse, 1 - Math.exp(-d * 3));

    const g = pen.current!;
    const descend = easeInOut(range(p, PHASE.descend));
    const writeU = range(p, PHASE.write);
    const lift = easeInOut(range(p, PHASE.lift));

    // ---------- Caneta ----------
    // Pose de estúdio: girando devagar sobre o próprio eixo, flutuando.
    const spin = k.t * 0.35;
    const bob = Math.sin(k.t * 0.9) * 0.05;
    penQuat(heroAxis, V(0, 0.4, 1), spin, k.qa);
    k.a.copy(heroCenter).addScaledVector(heroAxis, -PEN_CENTER).add(V(0, bob, 0));

    if (p < PHASE.write[0]) {
      // Abertura e descida até o primeiro traço.
      penQuat(writeAxis, writeFace, 0, k.qb);
      k.q.slerpQuaternions(k.qa, k.qb, descend);
      k.tip.lerpVectors(k.a, firstW, descend);
      k.tip.y += Math.sin(descend * Math.PI) * 0.35; // arco, como quem leva a mão ao papel
      k.vel.set(0, 0, 0);
    } else if (p < PHASE.lift[0]) {
      // Escrevendo: a ponta segue o traço central da assinatura.
      const st = penAt(writeU);
      sigToWorld(st.tip[0], st.tip[1], 0.004 + st.lift * paper.unit, k.tip);
      paper.setProgress(writeU);
      // inclina um pouco na direção do movimento
      k.b.subVectors(k.tip, k.prevTip).divideScalar(Math.max(d, 1e-3));
      if (k.first) k.b.set(0, 0, 0);
      k.vel.lerp(k.b.clampLength(0, 3), 1 - Math.exp(-d * 6));
      if (st.lift === 0) sound.scratch(k.vel.length() / 2.2);
      k.b.copy(writeAxis).addScaledVector(k.vel, 0.035).normalize();
      penQuat(k.b, writeFace, 0, k.q);
    } else {
      // Assinou: a caneta sobe e sai de cena.
      paper.setProgress(2);
      penQuat(writeAxis, writeFace, 0, k.qb);
      penQuat(heroAxis, V(0, 0.4, 1), lift * 1.2, k.qa);
      k.q.slerpQuaternions(k.qb, k.qa, lift);
      sigToWorld(LAST_POINT[0], LAST_POINT[1], 0.004, k.b);
      k.tip.lerpVectors(k.b, exitTip, lift);
      k.tip.y += Math.sin(lift * Math.PI) * 0.2;
    }
    if (p < PHASE.write[0]) paper.setProgress(-1);
    k.prevTip.copy(k.tip);
    k.first = false;
    g.position.copy(k.tip);
    g.quaternion.copy(k.q);

    // ---------- Luz: o estúdio acende o papel quando a caneta desce ----------
    if (spot.current) spot.current.intensity = 0.6 + 2.4 * smooth(range(p, [0.06, 0.26]));

    // ---------- Câmera ----------
    const cam = camera as THREE.PerspectiveCamera;
    if (portrait) {
      k.cam.set(0, 2.1, 7.4);
      k.tgt.set(0, 1.85, 0);
      // segue a ponta de perto
      k.b.copy(k.tip).setY(0);
      const wc = V(k.b.x * 0.92 + 0.3, 3.0, k.b.z + 2.9);
      const wt = V(k.b.x * 0.92, 0, k.b.z + 0.1);
      k.cam.lerp(wc, descend);
      k.tgt.lerp(wt, descend);
    } else {
      k.cam.set(0, 2.2, 4.8);
      k.tgt.set(0.2, 2.0, 0);
      k.b.copy(k.tip).setY(0).multiplyScalar(0.32);
      const wc = V(0.2 + k.b.x, 4.7, 2.9 + k.b.z * 0.6);
      const wt = V(k.b.x, 0, 0.05 + k.b.z);
      k.cam.lerp(wc, descend);
      k.tgt.lerp(wt, descend);
    }
    // Mergulho final na assinatura
    const dive = easeInOut(range(p, [PHASE.lift[0], 1]));
    k.cam.lerp(k.tgt, dive * 0.45);
    if (!lite) {
      k.cam.x += k.mouseS.x * 0.18;
      k.cam.y -= k.mouseS.y * 0.1;
    }
    if (k.camS.distanceToSquared(k.cam) > 50) k.camS.copy(k.cam);
    k.camS.lerp(k.cam, 1 - Math.exp(-d * (portrait ? 4 : 6)));
    k.tgtS.lerp(k.tgt, 1 - Math.exp(-d * (portrait ? 4 : 6)));
    cam.position.copy(k.camS);
    cam.lookAt(k.tgtS);

    // Onde o fim da assinatura cai na tela: dali sai a tinta que toma a tela.
    proj.copy(lastW).project(cam);
    stage.tipScreen.x = proj.x * 0.5 + 0.5;
    stage.tipScreen.y = 1 - (proj.y * 0.5 + 0.5);

    if (!stage.ready && state.clock.elapsedTime > 0.15) {
      stage.ready = true;
      onReady();
    }
  });

  return (
    <>
      <color attach="background" args={[COLORS.estudio]} />
      <fog attach="fog" args={[COLORS.estudio, 7, 15]} />
      <Environment resolution={lite ? 128 : 256} frames={1} environmentIntensity={0.85}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -1]} scale={[7, 2.5, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.2} position={[-5, 1.2, 0.5]} scale={[0.7, 7, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.4} position={[5, 1.5, 1]} scale={[0.5, 6, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" color="#f0c27f" intensity={2.4} position={[2, 2.5, 5]} scale={2.2} />
        <Lightformer form="rect" color="#7a1410" intensity={1} position={[0, -3, 2]} scale={[8, 2, 1]} rotation-x={-Math.PI / 2} />
      </Environment>
      <spotLight
        ref={spot}
        position={[1.6, 7.5, 3.2]}
        angle={0.42}
        penumbra={0.9}
        decay={0}
        intensity={0.6}
        color="#ffe9cc"
        castShadow
        shadow-mapSize={lite ? [512, 512] : [1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <ambientLight intensity={0.08} />

      <group ref={desk} rotation-y={DESK_ROT}>
        <mesh rotation-x={-Math.PI / 2} position-y={-0.004} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#17110e" roughness={0.75} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} rotation-z={0.07} position={[0.16, -0.0022, 0.1]} receiveShadow>
          <planeGeometry args={[PAPER.w, PAPER.h]} />
          <meshStandardMaterial color={COLORS.creme2} roughness={0.95} envMapIntensity={0.2} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[PAPER.w, PAPER.h]} />
          <primitive object={paper.material} attach="material" />
        </mesh>
      </group>

      <Pen ref={pen} />

      {!lite && (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={1} intensity={0.55} radius={0.7} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette offset={0.28} darkness={0.72} blendFunction={BlendFunction.NORMAL} />
          <Noise opacity={0.035} premultiply />
        </EffectComposer>
      )}
    </>
  );
}

export default function Studio({ lite, lang, onReady }: Props) {
  return (
    <Canvas
      className="studio__canvas"
      shadows
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: lite, powerPreference: 'high-performance', alpha: false }}
      camera={{ fov: lite ? 46 : 35, near: 0.1, far: 40, position: [0, 1.75, 5.4] }}
      aria-hidden
    >
      <Scene lite={lite} lang={lang} onReady={onReady} />
    </Canvas>
  );
}
