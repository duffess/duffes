/**
 * Assinatura desenhada pela própria pessoa (mouse, dedo ou caneta).
 * O traço afina quando a mão acelera e engrossa quando ela desacelera, como tinta de pena.
 */
export type PadPoint = { x: number; y: number; pressing: boolean; speed: number };

export function createPad(
  canvas: HTMLCanvasElement,
  color: string,
  on: { move(p: PadPoint): void; leave(): void; stroke(): void },
) {
  const ctx = canvas.getContext('2d')!;
  let dpr = 1;
  let drawing = false;
  let last: { x: number; y: number; t: number; w: number } | null = null;
  let mid: { x: number; y: number } | null = null;
  let strokes = 0;

  const fit = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const down = (e: PointerEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    if (strokes === 0) fit();
    drawing = true;
    const p = local(e);
    last = { ...p, t: performance.now(), w: 5 };
    mid = p;
    // um ponto, caso seja só um toque
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
    ctx.fill();
    on.move({ ...p, pressing: true, speed: 0 });
  };

  const move = (e: PointerEvent) => {
    const p = local(e);
    if (!drawing || !last || !mid) {
      on.move({ ...p, pressing: false, speed: 0 });
      return;
    }
    const now = performance.now();
    const dist = Math.hypot(p.x - last.x, p.y - last.y);
    if (dist < 1.2) return;
    const v = dist / Math.max(now - last.t, 1); // px por ms
    const w = last.w + (Math.max(1.6, 6.2 - v * 2.2) - last.w) * 0.35;
    // curva suave: do meio anterior até o meio atual, passando pelo último ponto
    const m = { x: (last.x + p.x) / 2, y: (last.y + p.y) / 2 };
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(mid.x, mid.y);
    ctx.quadraticCurveTo(last.x, last.y, m.x, m.y);
    ctx.stroke();
    mid = m;
    last = { ...p, t: now, w };
    on.move({ ...p, pressing: true, speed: Math.min(v / 2, 1) });
  };

  const up = () => {
    if (!drawing) return;
    drawing = false;
    last = mid = null;
    strokes++;
    on.stroke();
    on.move({ x: -1, y: -1, pressing: false, speed: 0 });
  };

  const leave = () => {
    if (!drawing) on.leave();
  };

  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', leave);

  return {
    clear() {
      fit();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes = 0;
    },
    get strokes() {
      return strokes;
    },
    destroy() {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('pointerleave', leave);
    },
  };
}
