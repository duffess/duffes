/**
 * Som da pena no papel, da batida do carimbo e da folha passando, sintetizados na hora
 * (sem arquivos de áudio). Fica ligado por padrão, mas o navegador só libera o áudio
 * depois do primeiro clique, toque ou tecla; rolar a página não conta.
 * O botão do topo desliga, e a escolha fica salva.
 */

const KEY = 'lyss-som';
type Listener = (on: boolean) => void;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let scratchGain: GainNode | null = null;
let scratchFilter: BiquadFilterNode | null = null;
let noise: AudioBuffer | null = null;
let on = false;
let lastScratch = 0;
const listeners = new Set<Listener>();

try {
  // ligado, a não ser que a pessoa tenha desligado antes
  on = localStorage.getItem(KEY) !== '0';
} catch {
  on = true;
}

function boot() {
  if (ctx) return;
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(ctx.destination);
  // ruído branco reaproveitado por todos os sons
  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  // Pena: ruído filtrado em loop, com volume que segue a velocidade do traço.
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  scratchFilter = ctx.createBiquadFilter();
  scratchFilter.type = 'bandpass';
  scratchFilter.frequency.value = 3200;
  scratchFilter.Q.value = 0.9;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1400;
  scratchGain = ctx.createGain();
  scratchGain.gain.value = 0;
  src.connect(scratchFilter).connect(hp).connect(scratchGain).connect(master);
  src.start();

  // Se ninguém escreve por um instante, a pena silencia.
  const tick = () => {
    if (scratchGain && ctx && performance.now() - lastScratch > 90) {
      scratchGain.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// O áudio acorda no primeiro gesto que o navegador aceita (o Safari do iPhone pede toque solto ou clique).
const GESTURES = ['pointerdown', 'keydown', 'touchend', 'click'] as const;
if (typeof window !== 'undefined') {
  const wake = () => {
    if (!on) return;
    boot();
    ctx?.resume().then(() => {
      if (ctx?.state === 'running') GESTURES.forEach((g) => window.removeEventListener(g, wake, true));
    });
  };
  GESTURES.forEach((g) => window.addEventListener(g, wake, { capture: true, passive: true }));
}

export const sound = {
  get on() {
    return on;
  },
  /** Liga ou desliga (precisa vir de um clique: o navegador só libera áudio assim). */
  set(value: boolean) {
    on = value;
    try {
      localStorage.setItem(KEY, value ? '1' : '0');
    } catch {
      /* sem armazenamento */
    }
    if (value) {
      boot();
      ctx?.resume();
    } else {
      ctx?.suspend();
    }
    listeners.forEach((l) => l(value));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => void listeners.delete(l);
  },
  /** Pena raspando no papel; `level` de 0 a 1 (velocidade do traço). Chamar a cada quadro enquanto escreve. */
  scratch(level: number) {
    if (!on || !ctx || !scratchGain || !scratchFilter) return;
    if (ctx.state !== 'running') return;
    lastScratch = performance.now();
    const l = Math.min(Math.max(level, 0), 1);
    scratchGain.gain.setTargetAtTime(0.05 + l * 0.22, ctx.currentTime, 0.03);
    scratchFilter.frequency.setTargetAtTime(2600 + l * 2200, ctx.currentTime, 0.05);
  },
  /** Folha deslizando na mesa: um sopro de papel, curto e bem baixo. */
  flip() {
    if (!on || !ctx || !master || !noise || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const n = ctx.createBufferSource();
    n.buffer = noise;
    n.playbackRate.value = 0.8 + Math.random() * 0.3;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 0.7;
    // sobe de tom, como papel arrastado que ganha velocidade e para
    f.frequency.setValueAtTime(700, t);
    f.frequency.exponentialRampToValueAtTime(2600, t + 0.16);
    f.frequency.exponentialRampToValueAtTime(1500, t + 0.34);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.36);
    n.connect(f).connect(g).connect(master);
    n.start(t, Math.random() * 1.5);
    n.stop(t + 0.4);
  },
  /** Batida seca de carimbo: um golpe grave e o estalo da borracha no papel. */
  thud() {
    if (!on || !ctx || !master || !noise || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.9, t + 0.005);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(og).connect(master);
    o.start(t);
    o.stop(t + 0.25);

    const n = ctx.createBufferSource();
    n.buffer = noise;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 1800;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.5, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    n.connect(f).connect(ng).connect(master);
    n.start(t);
    n.stop(t + 0.08);
  },
};
