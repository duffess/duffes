import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';

export function Manifesto() {
  const container = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.manifesto-anim', {
          scrollTrigger: {
            trigger: container.current,
            start: 'top 85%',
            once: true,
          },
          y: 18,
          opacity: 0,
          duration: 0.42,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform',
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="px-6 sm:px-10 md:px-16 lg:px-20 mb-36 flex justify-end">
      <div className="max-w-[600px] text-right">
        <span className="manifesto-anim font-label text-xs tracking-widest text-stone-400 uppercase mb-4 block">
          {t('manifesto', 'label')}
        </span>
        <h2 className="manifesto-anim font-headline text-3xl md:text-4xl text-stone-100 italic leading-snug font-normal">
          {t('manifesto', 'quote')}
        </h2>
      </div>
    </section>
  );
}
