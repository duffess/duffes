import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';

export function Process() {
  const container = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    gsap.from('.process-header', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.from('.process-step', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 75%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }, { scope: container });

  const steps = [
    { label: t('method', 's1Label'), desc: t('method', 's1Desc') },
    { label: t('method', 's2Label'), desc: t('method', 's2Desc') },
    { label: t('method', 's3Label'), desc: t('method', 's3Desc') },
    { label: t('method', 's4Label'), desc: t('method', 's4Desc') },
  ];

  return (
    <section ref={container} className="px-8 md:px-24 mb-48">
      <div className="mb-24">
        <h2 className="process-header font-headline text-5xl md:text-7xl text-stone-100 letter-spacing-tighter italic font-light">
          {t('method', 'title')}
        </h2>
        <div className="process-header mt-8 h-px w-24 bg-stone-300 opacity-30"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-800/30 overflow-hidden rounded-sm border border-stone-800/50">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="process-step bg-stone-950 p-10 md:p-12 hover:bg-stone-900/40 transition-colors duration-700 group flex flex-col min-h-[300px]"
          >
            <span className="font-label text-[0.65rem] tracking-widest text-stone-400 uppercase mb-8 block transition-colors group-hover:text-stone-300">
              {step.label.split(' / ')[0]}
            </span>
            <h3 className="font-headline text-2xl text-stone-200 mb-8 leading-tight">
              {step.label.split(' / ')[1]}
            </h3>
            <p className="font-body text-sm text-stone-300 leading-relaxed mt-auto group-hover:opacity-100 transition-opacity">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
