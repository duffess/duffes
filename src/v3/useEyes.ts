import type { RefObject } from 'react';
import { gsap, prefersReduced, useGSAP } from './motion';
import { EYE, IRIS, PUPIL } from './eyeShape';

/**
 * Dá vida aos olhos dentro de `scope`.
 * Seguem o mouse (ou o dedo), arregalam quando o cursor chega perto, levam um susto no clique,
 * piscam, passeiam quando ninguém mexe e ficam com sono depois de um tempo parados.
 */
export function useEyes(scope: RefObject<HTMLElement | null>, awake: boolean, key = '') {
  useGSAP(
    () => {
      const svgs = gsap.utils.toArray<SVGSVGElement>('.eye');
      if (!svgs.length) return;
      const shapes = svgs.map((s) => Array.from(s.querySelectorAll<SVGEllipseElement>('.eye__shape')));
      const looks = svgs.map((s) => s.querySelector<SVGGElement>('.eye__look')!);
      const irises = svgs.map((s) => s.querySelector<SVGCircleElement>('.eye__iris')!);
      const pupils = svgs.map((s) => s.querySelector<SVGCircleElement>('.eye__pupil')!);
      const glints = svgs.map((s) => s.querySelector<SVGCircleElement>('.eye__glint')!);

      if (prefersReduced()) return;

      // Abertura: começam fechados e "acordam" quando o topo aparece.
      const state = { open: EYE.rest, iris: IRIS.rest, pr: PUPIL.rest };
      const apply = () => {
        const ry = String(Math.max(state.open, 0.5));
        shapes.forEach((list) => list.forEach((e) => e.setAttribute('ry', ry)));
        const r = state.iris;
        irises.forEach((c) => c.setAttribute('r', String(r)));
        pupils.forEach((c) => c.setAttribute('r', String(r * state.pr)));
        glints.forEach((c) => {
          c.setAttribute('cx', String(EYE.cx - r * 0.32));
          c.setAttribute('cy', String(EYE.cy + r * 0.34));
          c.setAttribute('r', String(r * 0.2));
        });
      };
      let openTween: gsap.core.Tween | null = null;
      const setOpen = (ry: number, iris: number, pr: number, duration = 0.45, ease = 'power3.out') => {
        openTween?.kill();
        openTween = gsap.to(state, { open: ry, iris, pr, duration, ease, onUpdate: apply });
      };

      if (!awake) {
        state.open = 0;
        apply();
        return;
      }
      state.open = 0;
      apply();
      const wake = gsap.timeline({ delay: 0.5, onUpdate: apply });
      wake
        .to(state, { open: EYE.rest * 0.5, duration: 0.25, ease: 'power2.out' })
        .to(state, { open: 2, duration: 0.12, ease: 'power2.in' })
        .to(state, { open: EYE.wide, iris: IRIS.wide, pr: PUPIL.shock, duration: 0.5, ease: 'back.out(2.5)' })
        .to(state, { open: EYE.rest, iris: IRIS.rest, pr: PUPIL.rest, duration: 0.8, ease: 'power2.inOut' }, '+=0.5');

      // Para onde olhar (em unidades da fonte, dentro da fenda).
      const movers = looks.map((g) => ({
        x: gsap.quickTo(g, 'x', { duration: 0.35, ease: 'power3' }),
        y: gsap.quickTo(g, 'y', { duration: 0.35, ease: 'power3' }),
      }));
      const lookAt = (cx: number, cy: number) => {
        svgs.forEach((svg, i) => {
          const r = svg.getBoundingClientRect();
          const ex = r.left + r.width * (EYE.cx / 558);
          const ey = r.top + r.height * ((527 - EYE.cy) / 529);
          const dx = cx - ex;
          const dy = cy - ey;
          const d = Math.hypot(dx, dy) || 1;
          const reach = Math.min(d / (r.width * 3), 1);
          const maxX = EYE.rx - state.iris * 0.6;
          const maxY = Math.max(state.open - state.iris * 0.45, 8);
          movers[i].x((dx / d) * reach * maxX);
          // y da tela para baixo = y da fonte para baixo (o grupo está espelhado)
          movers[i].y(-(dy / d) * Math.min(reach * 1.4, 1) * maxY);
        });
      };

      let last = performance.now();
      let mode: 'rest' | 'wide' | 'sleepy' = 'rest';
      let blinking = false;
      const near = (cx: number, cy: number) => {
        const r = svgs[0].getBoundingClientRect();
        const r2 = svgs[svgs.length - 1].getBoundingClientRect();
        const mx = (r.left + r2.right) / 2;
        const my = (r.top + r.bottom) / 2;
        return Math.hypot(cx - mx, cy - my) < Math.max(r2.right - r.left, 160) * 1.6;
      };
      const setMode = (m: typeof mode) => {
        if (m === mode || blinking) return;
        mode = m;
        if (m === 'wide') setOpen(EYE.wide, IRIS.wide, PUPIL.wide, 0.5, 'back.out(2)');
        else if (m === 'rest') setOpen(EYE.rest, IRIS.rest, PUPIL.rest, 0.6);
        else setOpen(18, IRIS.sleepy, PUPIL.rest, 1.6, 'power2.inOut');
      };

      const onMove = (e: PointerEvent) => {
        last = performance.now();
        lookAt(e.clientX, e.clientY);
        setMode(near(e.clientX, e.clientY) ? 'wide' : 'rest');
      };
      // Susto no clique ou toque.
      const onDown = (e: PointerEvent) => {
        onMove(e);
        if (blinking) return;
        openTween?.kill();
        gsap
          .timeline({ onUpdate: apply })
          .to(state, { open: EYE.max, iris: IRIS.shock, pr: PUPIL.shock, duration: 0.12, ease: 'power3.out' })
          .to(
            state,
            {
              open: mode === 'wide' ? EYE.wide : EYE.rest,
              iris: mode === 'wide' ? IRIS.wide : IRIS.rest,
              pr: mode === 'wide' ? PUPIL.wide : PUPIL.rest,
              duration: 0.8,
              ease: 'elastic.out(1, 0.45)',
            },
            '+=0.3',
          );
      };

      // Rolagem rápida: os olhos acompanham para cima ou para baixo.
      let lastY = window.scrollY;
      const onScroll = () => {
        const dy = window.scrollY - lastY;
        lastY = window.scrollY;
        if (Math.abs(dy) < 4) return;
        last = performance.now();
        const r = svgs[0].getBoundingClientRect();
        lookAt(r.left + r.width, r.top + (dy > 0 ? 400 : -400));
      };

      // Celular: o giro do aparelho move o olhar, onde o navegador permite sem pedir licença.
      const onTilt = (e: DeviceOrientationEvent) => {
        if (e.gamma == null || e.beta == null) return;
        last = performance.now();
        const r = svgs[0].getBoundingClientRect();
        lookAt(r.left + e.gamma * 20, r.top + (e.beta - 45) * 16);
      };

      const blink = (twice = false) => {
        if (blinking) return;
        blinking = true;
        const back = mode === 'wide' ? EYE.wide : mode === 'sleepy' ? 18 : EYE.rest;
        openTween?.kill();
        const tl = gsap.timeline({ onUpdate: apply, onComplete: () => (blinking = false) });
        tl.to(state, { open: 0, duration: 0.07, ease: 'power2.in' }).to(state, { open: back, duration: 0.16, ease: 'power2.out' });
        if (twice) tl.to(state, { open: 0, duration: 0.07, ease: 'power2.in' }, '+=0.08').to(state, { open: back, duration: 0.16, ease: 'power2.out' });
      };

      const blinker = gsap.delayedCall(3, function loop() {
        if (mode !== 'sleepy') blink(Math.random() < 0.25);
        blinker.delay(2 + Math.random() * 3.5);
        blinker.restart(true);
      });

      // Ninguém mexendo: passeiam e, depois de um tempo, ficam com sono.
      const idle = gsap.delayedCall(1.4, function loop() {
        const quiet = performance.now() - last;
        if (quiet > 9000) setMode('sleepy');
        else if (quiet > 2200) {
          const r = svgs[0].getBoundingClientRect();
          const a = Math.random() * Math.PI * 2;
          lookAt(r.left + Math.cos(a) * 600, r.top + Math.sin(a) * 400);
          if (mode === 'sleepy') setMode('rest');
        }
        idle.delay(1.1 + Math.random() * 1.5);
        idle.restart(true);
      });

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('deviceorientation', onTilt, { passive: true });
      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('deviceorientation', onTilt);
        blinker.kill();
        idle.kill();
        wake.kill();
        openTween?.kill();
      };
    },
    { scope, dependencies: [awake, key], revertOnUpdate: true },
  );
}

