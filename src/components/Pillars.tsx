import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';

export function Pillars() {
  const container = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.pillar-card', {
          scrollTrigger: {
            trigger: container.current,
            start: 'top 85%',
            once: true,
          },
          y: 18,
          opacity: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform',
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="px-6 sm:px-10 md:px-16 lg:px-20 mb-36">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="sr-only">O que você pode esperar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          <div className="group pillar-card">
            <span className="font-label text-[0.65rem] tracking-widest text-stone-400 mb-6 block">
              {t('pillars', 'p1Label')}
            </span>
            <h3 className="font-headline text-2xl mb-4 text-stone-100">{t('pillars', 'p1Title')}</h3>
            <p className="font-body text-sm text-stone-300 leading-relaxed">
              {t('pillars', 'p1Desc')}
            </p>
          </div>

          <div className="group pillar-card">
            <span className="font-label text-[0.65rem] tracking-widest text-stone-400 mb-6 block">
              {t('pillars', 'p2Label')}
            </span>
            <h3 className="font-headline text-2xl mb-4 text-stone-100">{t('pillars', 'p2Title')}</h3>
            <p className="font-body text-sm text-stone-300 leading-relaxed">
              {t('pillars', 'p2Desc')}
            </p>
          </div>

          <div className="group pillar-card">
            <span className="font-label text-[0.65rem] tracking-widest text-stone-400 mb-6 block">
              {t('pillars', 'p3Label')}
            </span>
            <h3 className="font-headline text-2xl mb-4 text-stone-100">{t('pillars', 'p3Title')}</h3>
            <p className="font-body text-sm text-stone-300 leading-relaxed">
              {t('pillars', 'p3Desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
