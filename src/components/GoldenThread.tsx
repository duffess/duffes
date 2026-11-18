import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type GoldenThreadProps = {
  containerRef: RefObject<HTMLDivElement | null>;
};

type Waypoint = {
  x: number;
  y: number;
  mode: 'move' | 'line' | 'curve' | 'arch';
  station?: boolean;
  tension?: number;
  cp1y?: number;
  cp2y?: number;
};

type RelBox = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  cx: number;
  cy: number;
};

export function GoldenThread({ containerRef }: GoldenThreadProps) {
  const prefersReducedMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const goldRef = useRef<SVGPathElement>(null);
  const stationsGroupRef = useRef<SVGGElement>(null);
  const pointRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const stage = containerRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const gold = goldRef.current;
    const stationsGroup = stationsGroupRef.current;
    const point = pointRef.current;
    if (!stage || !svg || !track || !gold || !stationsGroup || !point) return;

    // Lookup table: [yInStage, xInStage, pathLength]
    let table: Array<[number, number, number]> = [];
    let totalLength = 0;
    let stationYs: number[] = [];
    let stageTopDoc = 0;
    let scrollStart = 0;
    let scrollEnd = 1;
    let targetLength = 0;
    let visibleLength: number | undefined;
    let previousFrame = 0;
    let motionRaf = 0;
    let buildRaf = 0;
    let disposed = false;

    const getRelBox = (selector: string, baseRect: DOMRect): RelBox | null => {
      const el = stage.querySelector<HTMLElement>(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const left = r.left - baseRect.left;
      const right = r.right - baseRect.left;
      const top = r.top - baseRect.top;
      const bottom = r.bottom - baseRect.top;
      return {
        left,
        right,
        top,
        bottom,
        cx: left + r.width / 2,
        cy: top + r.height / 2,
      };
    };

    const lookupAtY = (y: number): [number, number, number] => {
      const last = table.length - 1;
      if (y <= table[0][0]) return table[0];
      if (y >= table[last][0]) return table[last];
      let lo = 0;
      let hi = last;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (table[mid][0] < y) lo = mid;
        else hi = mid;
      }
      const a = table[lo];
      const b = table[hi];
      const t = (y - a[0]) / (b[0] - a[0] || 1);
      return [y, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    };

    const updateTarget = () => {
      if (table.length === 0) return;

      const progress = Math.max(0, Math.min(1, (window.scrollY - scrollStart) / (scrollEnd - scrollStart)));
      const startY = table[0][0];
      const endY = table[table.length - 1][0];
      targetLength = lookupAtY(startY + (endY - startY) * progress)[2];
    };

    const renderPoint = (length: number) => {
      const { x, y } = gold.getPointAtLength(length);
      point.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      gold.style.strokeDashoffset = `${(totalLength - length).toFixed(1)}`;
      point.classList.add('on');
      point.classList.toggle('chegou', stationYs.some((sy) => Math.abs(sy - y) < 12));
    };

    const animate = (now: number) => {
      motionRaf = 0;
      updateTarget();
      const current = visibleLength ?? targetLength;
      const remaining = targetLength - current;
      const elapsed = previousFrame ? Math.min(now - previousFrame, 48) : 16;
      const easedStep = remaining * (1 - Math.exp(-elapsed / 190));
      const maxStep = elapsed * 1.8;
      const step = Math.max(-maxStep, Math.min(maxStep, easedStep));
      visibleLength = Math.abs(remaining) < 0.6 ? targetLength : current + step;
      renderPoint(visibleLength);

      if (visibleLength !== targetLength) {
        previousFrame = now;
        motionRaf = requestAnimationFrame(animate);
      } else {
        previousFrame = 0;
      }
    };

    const requestUpdate = () => {
      if (!motionRaf && table.length > 0) motionRaf = requestAnimationFrame(animate);
    };

    const buildPath = () => {
      const baseRect = stage.getBoundingClientRect();
      stageTopDoc = baseRect.top + window.scrollY;
      const W = stage.offsetWidth;
      const H = stage.offsetHeight;
      if (W <= 0 || H <= 0) return;

      svg.setAttribute('width', `${W}`);
      svg.setAttribute('height', `${H}`);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

      const start = getRelBox('[data-fio-start]', baseRect);
      const projSec = getRelBox('#projetos', baseRect);
      const projHead = getRelBox('[data-fio-proj-head]', baseRect);
      const projGrid = getRelBox('[data-fio-proj-grid]', baseRect);
      const projBanner = getRelBox('[data-fio-proj-banner]', baseRect);
      const bannerCopy = getRelBox('[data-fio-proj-banner-copy]', baseRect);
      const bannerCta = getRelBox('[data-fio-proj-banner-cta]', baseRect);
      const servLeft = getRelBox('[data-fio-serv-left]', baseRect);
      const servCard = getRelBox('[data-fio-serv-card]', baseRect);
      const metSec = getRelBox('#metodo', baseRect);
      const metHead = getRelBox('[data-fio-met-head]', baseRect);
      const metGrid = getRelBox('[data-fio-met-grid]', baseRect);
      const aboutBox = getRelBox('[data-fio-about-box]', baseRect);
      const aboutImg = getRelBox('[data-fio-about-img]', baseRect);
      const aboutCopy = getRelBox('[data-fio-about-copy]', baseRect);
      const footerCopy = getRelBox('[data-fio-footer-copy]', baseRect);
      const end = getRelBox('[data-fio-end]', baseRect);

      if (
        !start ||
        !projSec ||
        !projHead ||
        !projGrid ||
        !projBanner ||
        !servLeft ||
        !servCard ||
        !metSec ||
        !metHead ||
        !metGrid ||
        !aboutBox ||
        !footerCopy ||
        !end
      ) {
        return;
      }

      const isMobileOrTablet = window.innerWidth < 1024;
      const rawPoints: Waypoint[] = [];

      if (isMobileOrTablet) {
        const L = 12;

        rawPoints.push(
          { x: start.cx, y: start.cy, mode: 'move', station: true },
          { x: L, y: projHead.top - 8, mode: 'curve', tension: 0.38 },
          { x: L, y: projHead.cy, mode: 'line', station: true },
          { x: L, y: projBanner.bottom + 10, mode: 'line' },
          { x: L, y: servLeft.cy, mode: 'line', station: true },
          { x: L, y: metHead.top - 6, mode: 'curve', tension: 0.34 },
          { x: L, y: metHead.cy, mode: 'line', station: true },
          { x: L, y: metGrid.bottom + 6, mode: 'line' },
          { x: L, y: aboutBox.cy, mode: 'line', station: true },
          { x: L, y: footerCopy.bottom + 8, mode: 'line' },
          {
            x: end.cx,
            y: end.cy,
            mode: 'arch',
            station: true,
            cp1y: footerCopy.bottom + 22,
            cp2y: end.cy - 34,
          }
        );
      } else {
        const xStart = start.cx;
        const xProjArc = Math.min(
          projGrid.right - 80,
          Math.max(projHead.right + 44, projGrid.cx + 140)
        );
        const xProjCenter = window.innerHeight >= 650
          ? projGrid.left + (projGrid.right - projGrid.left) * 0.43
          : projGrid.cx;
        const xBannerGap =
          bannerCopy && bannerCta && bannerCta.left - bannerCopy.right > 44
            ? (bannerCopy.right + bannerCta.left) * 0.5
            : projGrid.cx + 80;
        const xServGap = (servLeft.right + servCard.left) * 0.5;
        const xMetArc = Math.min(
          metGrid.right - 80,
          Math.max(metHead.right + 44, metGrid.cx + 115)
        );
        const xMetCenter = metGrid.cx;
        const xAboutGap =
          aboutImg && aboutCopy && aboutCopy.left - aboutImg.right > 24
            ? (aboutImg.right + aboutCopy.left) * 0.5
            : aboutBox.left + (aboutBox.right - aboutBox.left) * 0.44;
        const xFooterArc = Math.max(24, footerCopy.left - 44);
        const xEnd = end.cx;

        rawPoints.push(
          { x: xStart, y: start.cy, mode: 'move', station: true },
          { x: xProjArc, y: projHead.top + 38, mode: 'curve', tension: 0.4 },
          { x: xProjArc, y: projHead.top + 54, mode: 'line', station: true },
          { x: xProjCenter, y: projGrid.top - 10, mode: 'curve', tension: 0.4 },
          { x: xProjCenter, y: projGrid.cy, mode: 'line', station: true },
          { x: xProjCenter, y: projGrid.bottom - 20, mode: 'line' },
          { x: xBannerGap, y: projBanner.cy, mode: 'curve', tension: 0.4 },
          { x: xServGap, y: servCard.top + 44, mode: 'curve', tension: 0.38 },
          { x: xServGap, y: servCard.cy, mode: 'line', station: true },
          { x: xServGap, y: servCard.bottom - 18, mode: 'line' },
          { x: xMetArc, y: metHead.top + 34, mode: 'curve', tension: 0.38 },
          { x: xMetArc, y: metHead.top + 50, mode: 'line', station: true },
          { x: xMetCenter, y: metGrid.top - 10, mode: 'curve', tension: 0.4 },
          { x: xMetCenter, y: metGrid.bottom - 14, mode: 'line' },
          { x: xAboutGap, y: aboutBox.top + 36, mode: 'curve', tension: 0.4 },
          { x: xAboutGap, y: aboutBox.cy, mode: 'line', station: true },
          { x: xAboutGap, y: aboutBox.bottom - 18, mode: 'line' },
          {
            x: xFooterArc,
            y: footerCopy.top,
            mode: 'curve',
            tension: 0.38,
          },
          { x: xFooterArc, y: footerCopy.bottom + 8, mode: 'line' },
          {
            x: xEnd,
            y: end.cy,
            mode: 'arch',
            station: true,
            cp1y: footerCopy.bottom + 26,
            cp2y: end.cy - 38,
          }
        );
      }

      // Enforce strictly monotonic Y so binary search is guaranteed monotonic
      const pts: Waypoint[] = [];
      for (let i = 0; i < rawPoints.length; i++) {
        const rp = rawPoints[i];
        const minY = i === 0 ? rp.y : pts[i - 1].y + 8;
        pts.push({
          ...rp,
          x: Math.round(rp.x * 10) / 10,
          y: Math.round(Math.max(minY, rp.y) * 10) / 10,
        });
      }

      // Assemble SVG path with vertical tangents, wide cubic S-curves, and vertical arrival on final CTA
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const dy = b.y - a.y;

        if (b.mode === 'line' || Math.abs(a.x - b.x) < 1) {
          d += ` L ${b.x} ${b.y}`;
        } else if (b.mode === 'arch') {
          const rawCp1 = b.cp1y ?? a.y + dy * 0.62;
          const rawCp2 = b.cp2y ?? b.y - Math.min(40, dy * 0.24);
          const c1 = Math.max(a.y + 8, Math.min(b.y - 26, rawCp1));
          const c2 = Math.max(c1, Math.min(b.y - 22, rawCp2));
          d += ` C ${a.x} ${Math.round(c1 * 10) / 10}, ${b.x} ${Math.round(c2 * 10) / 10}, ${b.x} ${b.y}`;
        } else {
          const k = b.tension ?? 0.4;
          const cp1y = Math.round((a.y + dy * k) * 10) / 10;
          const cp2y = Math.round((b.y - dy * k) * 10) / 10;
          d += ` C ${a.x} ${cp1y}, ${b.x} ${cp2y}, ${b.x} ${b.y}`;
        }
      }

      track.setAttribute('d', d);
      gold.setAttribute('d', d);

      // Render subtle intermediate station markers directly on the SVG path
      const intermediateStations = pts.slice(1, -1).filter((p) => p.station);
      stationsGroup.innerHTML = intermediateStations
        .map(
          (st) =>
            `<circle cx="${st.x}" cy="${st.y}" r="2.75" fill="#c5a46d" fill-opacity="0.72" />`
        )
        .join('');

      stationYs = pts.filter((p) => p.station).map((p) => p.y);
      const previousLength = totalLength;
      totalLength = gold.getTotalLength();
      gold.style.strokeDasharray = `${totalLength} ${totalLength}`;

      table = [];
      for (let l = 0; l < totalLength; l += 12) {
        const pt = gold.getPointAtLength(l);
        table.push([pt.y, pt.x, l]);
      }
      if (table.length > 0) {
        const endPt = gold.getPointAtLength(totalLength);
        table.push([endPt.y, endPt.x, totalLength]);
      }

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollStart = Math.max(0, stageTopDoc + pts[0].y - window.innerHeight * 0.62);
      scrollEnd = Math.max(scrollStart + 1, maxScroll);
      updateTarget();
      visibleLength = visibleLength !== undefined && previousLength > 0
        ? (visibleLength / previousLength) * totalLength
        : targetLength;
      renderPoint(visibleLength);
      requestUpdate();
    };

    const scheduleBuild = () => {
      if (disposed) return;
      cancelAnimationFrame(buildRaf);
      buildRaf = requestAnimationFrame(buildPath);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', scheduleBuild);
    window.addEventListener('load', scheduleBuild);

    const ro = new ResizeObserver(scheduleBuild);
    ro.observe(stage);

    if (document.fonts?.ready) {
      document.fonts.ready.then(scheduleBuild).catch(() => {});
    }

    scheduleBuild();

    return () => {
      disposed = true;
      cancelAnimationFrame(buildRaf);
      cancelAnimationFrame(motionRaf);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', scheduleBuild);
      window.removeEventListener('load', scheduleBuild);
      ro.disconnect();
    };
  }, [containerRef, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className="fio-layer" aria-hidden="true">
      <svg ref={svgRef} className="fio-svg" fill="none">
        <defs>
          <linearGradient id="fioGoldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c5a46d" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#c5a46d" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#e6d3ae" stopOpacity="0.96" />
          </linearGradient>
        </defs>
        <path ref={trackRef} className="fio-trilho" />
        <path ref={goldRef} className="fio-ouro" />
        <g ref={stationsGroupRef} />
      </svg>

      <div ref={pointRef} className="fio-ponto">
        <span className="fio-halo" />
        <span className="fio-nucleo" />
      </div>
    </div>
  );
}
