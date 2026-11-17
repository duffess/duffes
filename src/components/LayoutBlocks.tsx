import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';
import { WHATSAPP_URL } from '../data/mockData';

export function CallToAction() {
  return null;
}

export function Footer() {
  const container = useRef<HTMLElement>(null);
  const ctaLinkRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.footer-anim', {
          scrollTrigger: {
            trigger: container.current,
            start: 'top 88%',
            once: true,
          },
          y: 16,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform',
        });
      });

      mm.add(
        '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
        () => {
          const link = ctaLinkRef.current;
          const icon = iconRef.current;
          if (!link || !icon) return;

          const iconX = gsap.quickTo(icon, 'x', { duration: 0.25, ease: 'power2.out' });
          const onEnter = () => iconX(4);
          const onLeave = () => iconX(0);

          link.addEventListener('mouseenter', onEnter);
          link.addEventListener('mouseleave', onLeave);

          return () => {
            link.removeEventListener('mouseenter', onEnter);
            link.removeEventListener('mouseleave', onLeave);
          };
        }
      );
    },
    { scope: container }
  );

  return (
    <footer
      ref={container}
      className="bg-rose-soft/65 border-t border-rose-border text-stone-100 px-6 sm:px-10 md:px-16 lg:px-20 pt-20 pb-14 w-full"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center">
        <div className="max-w-[700px]">
          <h2 className="footer-anim font-headline text-3xl sm:text-5xl md:text-6xl mb-9 leading-[1.15] letter-spacing-tighter text-stone-100">
            {t('footer', 'title')}
          </h2>

          <div className="footer-anim">
            <a
              ref={ctaLinkRef}
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3.5 bg-stone-100 text-stone-950 px-8 sm:px-10 py-4.5 rounded-[2px] font-label text-xs sm:text-sm tracking-[0.16em] uppercase font-bold hover:bg-[#4a3530] transition-colors duration-300 cursor-pointer shadow-sm"
            >
              <span>{t('footer', 'cta')}</span>
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

        <div className="footer-anim w-full mt-20 pt-8 border-t border-rose-border/70 flex flex-col sm:flex-row justify-between items-center gap-6">
          <a href="#inicio" className="brand-lockup" aria-label="LYSS — voltar ao início">
            <span>{t('nav', 'logo')}</span>
            <small>CRIAÇÃO DE SITES</small>
          </a>

          <p className="font-label text-[0.68rem] tracking-[0.16em] text-stone-400 uppercase m-0">
            {t('footer', 'copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
