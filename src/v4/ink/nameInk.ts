/**
 * Escreve um nome à mão num canvas 2D, da esquerda para a direita,
 * e diz onde está a ponta da caneta a cada instante (para a caneta 3D seguir).
 * O nome é desenhado uma vez; cada quadro só recorta até onde a tinta chegou.
 */
export const NAME_FONT = '"Great Vibes", cursive';

export function createNameWriter(canvas: HTMLCanvasElement, color: string) {
  const ctx = canvas.getContext('2d')!;
  const full = document.createElement('canvas');
  const fctx = full.getContext('2d', { willReadFrequently: true })!;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let x0 = 0;
  let x1 = 0;
  let colY: Float32Array = new Float32Array(0);
  let baseline = 0;

  function layout(name: string) {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = full.width = Math.round(w * dpr);
    canvas.height = full.height = Math.round(h * dpr);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.clearRect(0, 0, w, h);
    let size = Math.min(h * 0.78, 96);
    fctx.font = `${size}px ${NAME_FONT}`;
    const maxW = w - 24;
    const tw = fctx.measureText(name).width;
    if (tw > maxW) {
      size *= maxW / tw;
      fctx.font = `${size}px ${NAME_FONT}`;
    }
    baseline = h * 0.72;
    x0 = 8;
    fctx.fillStyle = color;
    fctx.fillText(name, x0, baseline);
    x1 = x0 + fctx.measureText(name).width + size * 0.15;

    // Por coluna, o meio da tinta: é por onde a ponta passa.
    const img = fctx.getImageData(0, 0, full.width, full.height).data;
    colY = new Float32Array(Math.ceil(w));
    let last = baseline - size * 0.25;
    for (let cx = 0; cx < colY.length; cx++) {
      const px = Math.min(Math.round(cx * dpr), full.width - 1);
      let sum = 0;
      let n = 0;
      for (let py = 0; py < full.height; py += 2) {
        if (img[(py * full.width + px) * 4 + 3] > 90) {
          sum += py;
          n++;
        }
      }
      if (n) last = sum / n / dpr;
      colY[cx] = last;
    }
  }

  /** Desenha até o progresso t (0 a 1) e devolve a ponta da caneta, em px do canvas. */
  function draw(t: number) {
    const x = x0 + (x1 - x0) * Math.min(Math.max(t, 0), 1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (t > 0) {
      ctx.drawImage(full, 0, 0);
      // corta o que ainda não foi escrito, com a borda da tinta suave
      const g = ctx.createLinearGradient(x * dpr - 10 * dpr, 0, x * dpr + 2 * dpr, 0);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }
    const cx = Math.min(Math.max(Math.round(x), 0), colY.length - 1);
    return { x, y: colY[cx] ?? baseline };
  }

  return {
    layout,
    draw,
    /** Quanto tempo leva para escrever, proporcional ao tamanho do nome. */
    duration: () => 0.7 + (x1 - x0) / 420,
    start: () => ({ x: x0, y: colY[Math.round(x0)] ?? baseline }),
  };
}
