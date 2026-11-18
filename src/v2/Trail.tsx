import { useEffect, useRef } from 'react';
import { WaGlyph } from './PhoneDemo';
import { DEFAULT_WA_MESSAGE, waLink } from './data';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Adaptado do "Laboratório Creative Romão": 01 (fio dourado) + 11 (objeto que viaja).
// Um fio dourado desce pela margem da página, trocando de lado a cada seção.
// No computador, a bolha do WhatsApp vai na ponta do fio. No celular, a ponta é
// um ponto de luz e a bolha fica no canto. No fechamento, a bolha encolhe e vira
// o ícone do botão "Quero o meu site".

const SECTIONS = ['trabalhos', 'incluso', 'como-funciona', 'quem-faz'];
const HEAD_AT = 0.55; // a ponta do fio fica a 55% da altura da tela
const BUBBLE = 60;
const GLYPH = 30;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type Row = [number, number, number]; // y, x, comprimento

export function Trail() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const railRef = useRef<SVGPathElement>(null);
  const goldRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const main = wrap.parentElement!;
    const svg = svgRef.current!;
    const rail = railRef.current!;
    const gold = goldRef.current!;
    const dot = dotRef.current!;
    const bubble = bubbleRef.current!;

    let table: Row[] = [];
    let total = 0;
    let wide = false;
    let cur = { x: 0, y: 0, s: 1, r: 0, op: 0, m: 0 };
    let first = true;
    let raf = 0;

    const build = () => {
      const base = main.getBoundingClientRect();
      const W = main.clientWidth;
      const H = main.scrollHeight;
      wide = window.innerWidth >= 1320; // só onde a margem lateral cabe a bolha
      svg.setAttribute('width', String(W));
      svg.setAttribute('height', String(H));
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

      const sec = document.querySelector('.section');
      const gutter = sec ? parseFloat(getComputedStyle(sec).paddingLeft) || 20 : 20;
      const contentLeft = Math.max(0, (W - 1240) / 2) + gutter;
      const L = Math.max(9, contentLeft / 2);
      const R = W - L;
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { top: r.top - base.top, bottom: r.bottom - base.top };
      };

      const pts: { x: number; y: number }[] = [];
      const hero = document.getElementById('topo');
      if (hero) pts.push({ x: R, y: box(hero).bottom - 80 });
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const b = box(el);
        const x = i % 2 === 0 ? R : L;
        // As curvas acontecem no respiro de cima de cada seção (padding vazio),
        // então a bolha só cruza a página onde não tem texto.
        const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
        pts.push({ x, y: b.top + padTop * 0.85 }, { x, y: b.bottom });
      });
      const closing = document.querySelector('.closing');
      // o fio termina antes do fechamento, para não passar por cima do celular
      const lastX = pts.length ? pts[pts.length - 1].x : L;
      if (closing) pts.push({ x: lastX, y: box(closing).top - 8 });

      let d = '';
      pts.forEach((p, i) => {
        if (i === 0) {
          d = `M ${p.x} ${p.y}`;
          return;
        }
        const a = pts[i - 1];
        if (Math.abs(a.x - p.x) < 1) d += ` L ${p.x} ${p.y}`;
        else {
          const ym = (a.y + p.y) / 2;
          d += ` C ${a.x} ${ym}, ${p.x} ${ym}, ${p.x} ${p.y}`;
        }
      });
      rail.setAttribute('d', d);
      gold.setAttribute('d', d);
      total = gold.getTotalLength();
      gold.style.strokeDasharray = `${total} ${total}`;
      table = [];
      for (let l = 0; l <= total; l += 6) {
        const pt = gold.getPointAtLength(l);
        table.push([pt.y, pt.x, l]);
      }
      kick();
    };

    const lookup = (y: number): Row => {
      if (!table.length) return [0, 0, 0];
      let lo = 0;
      let hi = table.length - 1;
      if (y <= table[0][0]) return table[0];
      if (y >= table[hi][0]) return table[hi];
      // o fio só desce, então y cresce junto com o comprimento
      while (hi - lo > 1) {
        const m = (lo + hi) >> 1;
        if (table[m][0] < y) lo = m;
        else hi = m;
      }
      const a = table[lo];
      const b = table[hi];
      const t = (y - a[0]) / (b[0] - a[0] || 1);
      return [y, mix(a[1], b[1], t), mix(a[2], b[2], t)];
    };

    const frame = () => {
      const base = main.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const yPage = -base.top + vh * HEAD_AT;
      const [hy, hx, hl] = lookup(yPage);
      gold.style.strokeDashoffset = String(Math.max(0, total - hl));
      const started = table.length ? clamp((yPage - table[0][0] + 60) / 120) : 0;

      // ponta do fio (ponto de luz) — só no celular
      dot.style.transform = `translate3d(${hx}px, ${hy}px, 0)`;
      dot.style.opacity = wide ? '0' : String(started);

      // alvo da bolha
      let x: number;
      let y: number;
      let r: number;
      let s = 1;
      let op = started;
      if (wide) {
        x = hx;
        if (table.length && yPage > table[table.length - 1][0] + 1) {
          // depois do fim do fio, a bolha voa e espera ao lado do celular
          x = vw / 2 + Math.min(210, vw * 0.28);
          y = vh * HEAD_AT;
        } else {
          y = hy + base.top;
        }
        const ahead = lookup(yPage + 40);
        r = clamp((ahead[1] - hx) * 0.6, -18, 18);
      } else {
        x = vw - BUBBLE / 2 - 16;
        y = vh - BUBBLE / 2 - 20;
        r = 0;
        op = clamp((-document.getElementById('topo')!.getBoundingClientRect().bottom + vh * 0.5) / (vh * 0.25));
      }

      // fechamento: vai até o ícone do botão e vira ele
      let m = 0;
      const closing = document.querySelector<HTMLElement>('.closing');
      const icon = document.querySelector<SVGElement>('.closing__pill .wa-glyph');
      if (closing && icon) {
        const cr = closing.getBoundingClientRect();
        const p = clamp(-cr.top / (cr.height - vh));
        const ir = icon.getBoundingClientRect();
        const k = clamp((p - 0.04) / 0.3);
        const e = k * k * (3 - 2 * k);
        if (k > 0) {
          x = mix(x, ir.left + ir.width / 2, e);
          y = mix(y, ir.top + ir.height / 2, e);
          r = r * (1 - e);
          s = mix(1, ir.width / GLYPH, e);
          op = Math.max(op, e);
        }
        m = clamp((p - 0.26) / 0.1);
        const pillOp = clamp((p - 0.33) / 0.08) * (1 - clamp((p - 0.6) / 0.06));
        if (p > 0.41) op = pillOp;
        bubble.style.pointerEvents = p > 0.2 ? 'none' : '';
      }
      return { x, y, s, r, op, m };
    };

    const loop = () => {
      const t = frame();
      const f = first || reduced ? 1 : 0.2;
      first = false;
      cur = {
        x: mix(cur.x, t.x, f),
        y: mix(cur.y, t.y, f),
        s: mix(cur.s, t.s, f),
        r: mix(cur.r, t.r, f),
        op: mix(cur.op, t.op, Math.max(f, 0.25)),
        m: mix(cur.m, t.m, Math.max(f, 0.25)),
      };
      bubble.style.transform = `translate3d(${(cur.x - BUBBLE / 2).toFixed(1)}px, ${(cur.y - BUBBLE / 2).toFixed(1)}px, 0) rotate(${cur.r.toFixed(2)}deg) scale(${cur.s.toFixed(3)})`;
      bubble.style.opacity = cur.op.toFixed(3);
      bubble.style.visibility = cur.op < 0.02 ? 'hidden' : 'visible';
      bubble.style.setProperty('--m', cur.m.toFixed(3));
      const moving =
        Math.abs(t.x - cur.x) + Math.abs(t.y - cur.y) + Math.abs(t.s - cur.s) * 50 + Math.abs(t.op - cur.op) * 50 > 0.4;
      raf = moving ? requestAnimationFrame(loop) : 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(build);
    ro.observe(main);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', build);
    document.fonts?.ready.then(build);
    build();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', build);
    };
  }, [reduced]);

  return (
    <>
      <div ref={wrapRef} className={`trail ${reduced ? 'trail--static' : ''}`} aria-hidden="true">
        <svg ref={svgRef} fill="none">
          <defs>
            <linearGradient id="trail-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d9a520" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#e9b52c" />
            </linearGradient>
          </defs>
          <path ref={railRef} className="trail__rail" />
          <path ref={goldRef} className="trail__gold" />
        </svg>
        <span ref={dotRef} className="trail__dot" />
      </div>
      <a
        ref={bubbleRef}
        className="traveler"
        href={waLink(DEFAULT_WA_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar no WhatsApp"
      >
        <WaGlyph />
        <span className="traveler__tip">Chamar no WhatsApp</span>
      </a>
    </>
  );
}
