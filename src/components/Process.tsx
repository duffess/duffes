import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';

export function Process() {
  const container = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.process-header', {
          scrollTrigger: {
            trigger: container.current,
            start: 'top 86%',
            once: true,
          },
          y: 16,
          opacity: 0,
          duration: 0.38,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform',
        });

        gsap.from('.process-step', {
          scrollTrigger: {
            trigger: container.current,
            start: 'top 82%',
            once: true,
          },
          y: 18,
          opacity: 0,
          duration: 0.4,
          stagger: 0.055,
          ease: 'power2.out',
          clearProps: 'transform',
        });
      });
    },
    { scope: container }
  );

  const steps = [
    { label: t('method', 's1Label'), desc: t('method', 's1Desc') },
    { label: t('method', 's2Label'), desc: t('method', 's2Desc') },
    { label: t('method', 's3Label'), desc: t('method', 's3Desc') },
    { label: t('method', 's4Label'), desc: t('method', 's4Desc') },
  ];

  return (
    <section
      id="metodo"
      ref={container}
      aria-labelledby="process-title"
      className="scroll-mt-28 px-6 sm:px-10 md:px-16 lg:px-20 mb-28 md:mb-40"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-14 md:mb-20">
          <span className="process-header font-label text-xs tracking-[0.2em] text-rose-accent uppercase mb-4 block font-semibold">
            Passo a passo
          </span>
          <h2
            id="process-title"
            className="process-header font-headline text-4xl sm:text-5xl md:text-6xl text-stone-100 letter-spacing-tighter italic font-light"
          >
            {t('method', 'title')}
          </h2>
          <div className="process-header mt-6 h-px w-20 bg-rose-border" aria-hidden="true" />
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-800/70 overflow-hidden rounded-[2px] border border-stone-800 list-none p-0 m-0">
          {steps.map((step, index) => {
            const [num, title] = step.label.split(' / ');
            return (
              <li
                key={step.label}
                className="process-step bg-stone-950 p-8 md:p-10 hover:bg-rose-soft/60 transition-colors duration-300 flex flex-col min-h-[200px] md:min-h-[250px]"
              >
                <span className="font-label text-[0.68rem] font-bold tracking-[0.2em] text-rose-accent uppercase mb-6 block">
                  {num || `0${index + 1}`}
                </span>
                <h3 className="font-headline text-2xl text-stone-100 mb-4 leading-snug">
                  {title}
                </h3>
                <p className="font-body text-sm text-stone-300 leading-relaxed mt-auto">
                  {step.desc}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
