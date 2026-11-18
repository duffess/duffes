import { useEffect, useRef } from 'react';
import { WaGlyph } from './PhoneDemo';
import { DEFAULT_WA_MESSAGE, waLink } from './data';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Inspirado no "Laboratório Creative Romão" (11 · objeto que viaja pelo site).
// Uma bolha do WhatsApp acompanha a página, muda de lado a cada seção
// e, no fechamento, vai para o centro e vira o botão "Quero o meu site".

type Stop = { id: string; x: number; y: number; rot: number; scale: number };

// x e y em fração da tela. No computador ela usa a margem lateral.
const DESKTOP: Stop[] = [
  { id: 'trabalhos', x: 0.94, y: 0.72, rot: -10, scale: 1 },
  { id: 'incluso', x: 0.06, y: 0.4, rot: 8, scale: 0.9 },
  { id: 'como-funciona', x: 0.94, y: 0.3, rot: -6, scale: 1 },
  { id: 'quem-faz', x: 0.06, y: 0.68, rot: 10, scale: 1.05 },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function Traveler() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const size = 60;
    let cur = { x: 0, y: 0, rot: 0, scale: 0.6, op: 0 };
    let first = true;
    let raf = 0;

    const target = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const wide = vw >= 1100; // há margem lateral livre
      const hero = document.getElementById('topo');
      const closing = document.querySelector<HTMLElement>('.closing');
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;

      // Antes de sair do topo: escondida perto do celular.
      const appear = clamp((vh * 0.55 - heroBottom) / (vh * 0.25));

      let x: number;
      let y: number;
      let rot: number;
      let scale: number;

      if (!wide) {
        // Celular e telas médias: fica no canto, como botão flutuante.
        x = vw - size / 2 - 16;
        y = vh - size / 2 - 20;
        rot = Math.sin(window.scrollY / 260) * 6;
        scale = 1;
      } else {
        // Acha entre quais paradas a página está, pelo centro da tela.
        const mid = vh / 2;
        const pts = DESKTOP.map((s) => {
          const sec = document.getElementById(s.id);
          const r = sec?.getBoundingClientRect();
          return { s, c: r ? r.top + r.height / 2 : 0 };
        });
        let a = pts[0];
        let b = pts[0];
        for (let i = 0; i < pts.length; i++) {
          if (pts[i].c <= mid) a = pts[i];
          if (pts[i].c > mid) {
            b = pts[i];
            break;
          }
          b = pts[i];
        }
        const t = a === b ? 0 : clamp((mid - a.c) / (b.c - a.c));
        const e = t * t * (3 - 2 * t);
        const margin = Math.max(0, (vw - 1240) / 2);
        const sx = (s: Stop) => (s.x < 0.5 ? margin / 2 + 8 : vw - margin / 2 - 8);
        x = sx(a.s) + (sx(b.s) - sx(a.s)) * e;
        y = (a.s.y + (b.s.y - a.s.y) * e) * vh;
        rot = a.s.rot + (b.s.rot - a.s.rot) * e;
        scale = a.s.scale + (b.s.scale - a.s.scale) * e;
      }

      // Fechamento: vai para o centro e some dentro do botão.
      let op = appear;
      if (closing) {
        const r = closing.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - vh));
        const enter = clamp((vh - r.top) / vh); // 0 quando o fechamento começa a aparecer
        const dock = clamp(p / 0.36);
        const k = Math.max(enter * 0.4, dock);
        x = x + (vw / 2 - x) * k;
        y = y + (vh / 2 - y) * k;
        rot = rot * (1 - k);
        scale = scale + (1.15 - scale) * k;
        op = op * (1 - clamp((p - 0.3) / 0.08));
        el.style.pointerEvents = p > 0.3 ? 'none' : '';
      }
      return { x, y, rot, scale, op };
    };

    const loop = () => {
      const t = target();
      const f = first || reduced ? 1 : 0.14;
      first = false;
      cur = {
        x: cur.x + (t.x - cur.x) * f,
        y: cur.y + (t.y - cur.y) * f,
        rot: cur.rot + (t.rot - cur.rot) * f,
        scale: cur.scale + (t.scale - cur.scale) * f,
        op: cur.op + (t.op - cur.op) * Math.max(f, 0.2),
      };
      el.style.transform = `translate3d(${(cur.x - size / 2).toFixed(1)}px, ${(cur.y - size / 2).toFixed(1)}px, 0) rotate(${cur.rot.toFixed(2)}deg) scale(${cur.scale.toFixed(3)})`;
      el.style.opacity = cur.op.toFixed(3);
      el.style.visibility = cur.op < 0.02 ? 'hidden' : 'visible';
      const moving =
        Math.abs(t.x - cur.x) + Math.abs(t.y - cur.y) + Math.abs(t.rot - cur.rot) + Math.abs(t.op - cur.op) > 0.3;
      raf = moving ? requestAnimationFrame(loop) : 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', kick);
    };
  }, [reduced]);

  return (
    <a
      ref={ref}
      className="traveler"
      href={waLink(DEFAULT_WA_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chamar no WhatsApp"
    >
      <WaGlyph />
      <span className="traveler__tip">Chamar no WhatsApp</span>
    </a>
  );
}
