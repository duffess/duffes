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
        const headTrigger = container.current?.querySelector('[data-fio-met-head]');
        const gridTrigger = container.current?.querySelector('[data-fio-met-grid]');

        gsap.from('.process-header', {
          scrollTrigger: {
            trigger: headTrigger || container.current,
            start: 'top 84%',
            once: true,
          },
          y: 24,
          opacity: 0,
          filter: 'blur(5px)',
          duration: 0.58,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter',
        });

        gsap.from('.process-step', {
          scrollTrigger: {
            trigger: gridTrigger || container.current,
            start: 'top 85%',
            once: true,
          },
          y: 24,
          opacity: 0,
          duration: 0.54,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
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
      className="scroll-mt-28 px-6 sm:px-10 md:px-14 lg:px-20 mb-28 md:mb-32"
    >
      <div className="max-w-[1220px] mx-auto border-t border-stone-800/80 pt-16 md:pt-24">
        <div data-fio-met-head className="mb-12 md:mb-20 max-w-[560px] lg:max-w-[420px] xl:max-w-[520px]">
          <span className="process-header font-label text-xs tracking-[0.2em] text-rose-accent uppercase mb-3.5 block font-semibold">
            {t('method', 'eyebrow')}
          </span>
          <h2
            id="process-title"
            className="process-header font-headline text-3xl sm:text-5xl md:text-[3.25rem] text-stone-100 letter-spacing-tighter leading-[1.12] mb-3"
          >
            {t('method', 'title')}
          </h2>
          <p className="process-header font-body text-base sm:text-lg text-stone-300 leading-relaxed m-0">
            {t('method', 'subtitle')}
          </p>
        </div>

        <ol data-fio-met-grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 list-none p-0 m-0">
          {steps.map((step, index) => {
            const [num, title] = step.label.split(' / ');
            return (
              <li
                key={step.label}
                className="process-step process-step-card bg-stone-950 border border-stone-800 rounded-[6px] overflow-hidden p-7 md:p-9 hover:bg-rose-soft/60 flex flex-col min-h-[210px] md:min-h-[245px]"
              >
                <span className="font-label text-[0.68rem] font-bold tracking-[0.2em] text-rose-accent uppercase mb-5 block">
                  {num || `0${index + 1}`}
                </span>
                <h3 className="font-headline text-2xl text-stone-100 mb-3.5 leading-snug">
                  {title}
                </h3>
                <p className="font-body text-sm sm:text-[0.95rem] text-stone-300 leading-relaxed mt-auto m-0">
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
