import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';

export function Manifesto() {
  const container = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    gsap.from('.manifesto-anim', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power3.out'
    });
  }, { scope: container });

  return (
    <section ref={container} className="px-8 md:px-24 mb-48 flex justify-end">
      <div className="max-w-[600px] text-right">
        <span className="manifesto-anim font-label text-xs tracking-widest text-stone-400 uppercase mb-4 block">{t('manifesto', 'label')}</span>
        <h2 className="manifesto-anim font-headline text-3xl md:text-4xl text-stone-100 italic leading-snug font-normal">
          {t('manifesto', 'quote')}
        </h2>
      </div>
    </section>
  );
}
