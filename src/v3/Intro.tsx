import { useRef } from 'react';
import type { RefObject } from 'react';
import { Signature } from './Signature';
import { INTRO_KEY, writeTween } from './helpers';
import { gsap, lockScroll, useGSAP } from './motion';

type Props = {
  target: RefObject<SVGSVGElement | null>;
  onReveal: () => void;
  onDone: () => void;
};

/**
 * A caneta escreve "Lyss" no meio da tela e a assinatura voa até o menu,
 * onde vira o logo.
 */
export function Intro({ target, onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const sig = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const svg = sig.current;
      if (!svg) return;
      lockScroll(true);
      try {
        sessionStorage.setItem(INTRO_KEY, '1');
      } catch {
        /* navegação privada: tudo bem repetir */
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onComplete: () => {
          lockScroll(false);
          onDone();
        },
      });
      tlRef.current = tl;

      tl.from('.intro__hint', { autoAlpha: 0, duration: 0.4 }, 0.2);
      const write = writeTween(svg, 1.5);
      write.paused(false);
      tl.add(write, 0.25);
      let at = 0.25 + 1.5;
      at += 0.25;

      // Voo até o logo do menu (FLIP: medimos as duas caixas na hora).
      tl.add(() => {
        const to = target.current?.getBoundingClientRect();
        const from = svg.getBoundingClientRect();
        if (!to || !from.width) return;
        gsap.to(svg, {
          x: to.left - from.left,
          y: to.top - from.top,
          scale: to.width / from.width,
          transformOrigin: '0 0',
          duration: 0.95,
          ease: 'expo.inOut',
        });
      }, at);
      tl.add(onReveal, at + 0.35);
      tl.to('.intro__paper', { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, at + 0.1);
      tl.to('.intro__hint', { autoAlpha: 0, duration: 0.2 }, at);
      tl.set({}, {}, at + 1.0);
    },
    { scope: root },
  );

  const skip = () => {
    tlRef.current?.kill();
    lockScroll(false);
    onReveal();
    onDone();
  };

  return (
    <div className="intro" ref={root}>
      <div className="intro__paper" />
      <Signature ref={sig} name="lyss" className="intro__sig" hidden />
      <button type="button" className="intro__hint" onClick={skip}>
        Pular abertura
      </button>
    </div>
  );
}
