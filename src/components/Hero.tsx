import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';
import { WHATSAPP_URL } from '../data/mockData';

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const magneticZoneRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-anim', {
          y: 16,
          opacity: 0,
          duration: 0.38,
          stagger: 0.045,
          ease: 'power2.out',
          clearProps: 'transform',
        });
      });

      mm.add(
        '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
        () => {
          const zone = magneticZoneRef.current;
          const btn = buttonRef.current;
          const icon = iconRef.current;
          if (!zone || !btn || !icon) return;

          const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });
          const iconXTo = gsap.quickTo(icon, 'x', { duration: 0.3, ease: 'power3.out' });

          let rect: DOMRect | null = null;

          const onEnter = () => {
            rect = btn.getBoundingClientRect();
            iconXTo(3);
          };

          const onMove = (e: MouseEvent) => {
            if (!rect) rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = (e.clientX - centerX) * 0.16;
            const dy = (e.clientY - centerY) * 0.16;
            xTo(gsap.utils.clamp(-8, 8, dx));
            yTo(gsap.utils.clamp(-5, 5, dy));
          };

          const onLeave = () => {
            rect = null;
            xTo(0);
            yTo(0);
            iconXTo(0);
          };

          zone.addEventListener('mouseenter', onEnter);
          zone.addEventListener('mousemove', onMove);
          zone.addEventListener('mouseleave', onLeave);

          return () => {
            zone.removeEventListener('mouseenter', onEnter);
            zone.removeEventListener('mousemove', onMove);
            zone.removeEventListener('mouseleave', onLeave);
          };
        }
      );
    },
    { scope: container }
  );

  return (
    <section
      id="inicio"
      ref={container}
      aria-labelledby="hero-title"
      className="px-6 sm:px-10 md:px-16 lg:px-20 min-h-[78vh] md:min-h-[82vh] flex flex-col justify-center mb-24 md:mb-36 pt-8 pb-12"
    >
      <div className="max-w-[1200px] mx-auto relative z-10 w-full">
        <p className="hero-eyebrow hero-anim">LYSS · CRIAÇÃO DE SITES</p>

        <h1
          id="hero-title"
          className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] text-stone-100 letter-spacing-tighter mb-10 md:mb-14 max-w-[16ch]"
        >
          <span className="hero-anim block">{t('hero', 'title')}</span>
          <span className="hero-anim block italic font-light text-[#6e4942] mt-1">
            {t('hero', 'titleItalic')}
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-start-6 md:col-span-7">
            <p className="hero-anim font-body text-lg sm:text-xl md:text-[1.375rem] text-stone-300 leading-relaxed mb-7 max-w-[44ch]">
              {t('hero', 'subtitle')}
            </p>
            <div className="hero-anim mb-9 h-px w-20 bg-rose-border" aria-hidden="true" />

            <div ref={magneticZoneRef} className="hero-anim inline-flex">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                ref={buttonRef}
                className="inline-flex items-center gap-3.5 bg-stone-100 text-stone-950 px-7 sm:px-8 py-4 rounded-[2px] font-label text-xs tracking-[0.16em] uppercase font-bold hover:bg-[#4a3530] transition-colors duration-300 cursor-pointer shadow-sm"
              >
                <span>{t('hero', 'cta')}</span>
                <svg
                  ref={iconRef}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
