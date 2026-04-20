import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';

export function Pillars() {
  const container = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    gsap.from('.pillar-card', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, { scope: container });

  return (
    <section ref={container} className="px-8 md:px-24 mb-48">
      <h2 className="sr-only">Pilares da Engenharia Digital</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
        
        <div className="group pillar-card">
          <span className="font-label text-[0.65rem] tracking-widest text-stone-400 mb-8 block">{t('pillars', 'p1Label')}</span>
          <h3 className="font-headline text-2xl mb-6 text-stone-100">{t('pillars', 'p1Title')}</h3>
          <p className="font-body text-sm text-stone-300 leading-relaxed">
            {t('pillars', 'p1Desc')}
          </p>
        </div>

        <div className="group pillar-card">
          <span className="font-label text-[0.65rem] tracking-widest text-stone-400 mb-8 block">{t('pillars', 'p2Label')}</span>
          <h3 className="font-headline text-2xl mb-6 text-stone-100">{t('pillars', 'p2Title')}</h3>
          <p className="font-body text-sm text-stone-300 leading-relaxed">
            {t('pillars', 'p2Desc')}
          </p>
        </div>

        <div className="group pillar-card">
          <span className="font-label text-[0.65rem] tracking-widest text-stone-400 mb-8 block">{t('pillars', 'p3Label')}</span>
          <h3 className="font-headline text-2xl mb-6 text-stone-100">{t('pillars', 'p3Title')}</h3>
          <p className="font-body text-sm text-stone-300 leading-relaxed">
            {t('pillars', 'p3Desc')}
          </p>
        </div>

      </div>
    </section>
  );
}
