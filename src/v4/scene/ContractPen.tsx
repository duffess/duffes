import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { Pen } from './Pen';

/**
 * A caneta volta para assinar o contrato. Canvas transparente sobre o contrato,
 * com câmera ortográfica em pixels: o alvo vem em px a partir do canto de cima à esquerda.
 */
export type PenTarget = {
  x: number;
  y: number;
  /** Altura da ponta acima do papel, em px. */
  lift: number;
  /** Rapidez com que a ponta segue o alvo (maior = mais grudada). */
  follow: number;
};

const SCALE = 104; // px por unidade da caneta

function Rig({ target }: { target: PenTarget }) {
  const pen = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const k = useMemo(
    () => ({ x: target.x, y: target.y, lift: target.lift, vx: 0, t: 0, q: new THREE.Quaternion() }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const shadowTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d')!;
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(30,15,8,0.55)');
    g.addColorStop(1, 'rgba(30,15,8,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame((_, dt) => {
    const d = Math.min(dt, 1 / 20);
    k.t += d;
    const a = 1 - Math.exp(-d * target.follow);
    const px = k.x;
    k.x += (target.x - k.x) * a;
    k.y += (target.y - k.y) * a;
    k.lift += (target.lift - k.lift) * (1 - Math.exp(-d * 9));
    k.vx += ((k.x - px) / Math.max(d, 1e-3) - k.vx) * (1 - Math.exp(-d * 8));
    const bob = k.lift > 4 ? Math.sin(k.t * 1.6) * 3 : 0;
    // px (y para baixo) -> mundo ortográfico centrado (y para cima)
    const wx = k.x - size.width / 2;
    const wy = size.height / 2 - k.y + k.lift + bob;
    const g = pen.current!;
    g.position.set(wx, wy, 0);
    // inclinada para cima e para a direita, como na mão de quem escreve; balança com a velocidade
    const axis = new THREE.Vector3(0.5 - k.vx * 0.0004, 0.78, 0.38).normalize();
    const face = new THREE.Vector3(0, 0.2, 1);
    const z = face.sub(axis.clone().multiplyScalar(face.dot(axis))).normalize();
    const xA = new THREE.Vector3().crossVectors(axis, z);
    k.q.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xA, axis, z));
    g.quaternion.copy(k.q);
    if (shadow.current) {
      shadow.current.position.set(wx + 6 + k.lift * 0.5, size.height / 2 - k.y - 4 - k.lift * 0.2, -200);
      const s = 26 + k.lift * 0.6;
      shadow.current.scale.set(s * 1.6, s * 0.6, 1);
      (shadow.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.15, 0.6 - k.lift * 0.008);
    }
  });

  return (
    <>
      <mesh ref={shadow}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      <group ref={pen} scale={SCALE}>
        <Pen shadows={false} />
      </group>
    </>
  );
}

function Loop({ running }: { running: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => setFrameloop(running ? 'always' : 'never'), [running, setFrameloop]);
  return null;
}

export default function ContractPen({ target, running, lite }: { target: PenTarget; running: boolean; lite: boolean }) {
  return (
    <Canvas
      className="contract__pen-canvas"
      style={{ pointerEvents: 'none' }}
      orthographic
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 800], near: 1, far: 2000, zoom: 1 }}
      aria-hidden
    >
      <Loop running={running} />
      <Environment resolution={64} frames={1} environmentIntensity={0.9}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 2]} scale={[7, 2.5, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} scale={[0.7, 7, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="ring" color="#f0c27f" intensity={2.4} position={[2, 2, 5]} scale={2.2} />
      </Environment>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-300, 500, 600]} intensity={2.2} color="#fff1dc" />
      <directionalLight position={[400, -100, 300]} intensity={0.8} color="#f0c27f" />
      <Rig target={target} />
    </Canvas>
  );
}
