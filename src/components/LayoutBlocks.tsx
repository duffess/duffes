export function CallToAction() {
  return null; // O bloco de CTA está todo unificado no Footer na versão A
}

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const container = useRef<HTMLElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    gsap.from('.footer-anim', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }, { scope: container });

  const handleMouseEnter = () => {
    gsap.to(iconRef.current, { x: 5, duration: 0.4, ease: 'power3.out' });
  };
  
  const handleMouseLeave = () => {
    gsap.to(iconRef.current, { x: 0, duration: 0.4, ease: 'power3.out' });
  };

  return (
    <footer ref={container} className="bg-stone-950 text-stone-100 flex flex-col items-center px-8 md:px-24 py-32 w-full gap-12 text-center">
      <div className="max-w-[800px]">
        <h2 className="footer-anim font-headline text-4xl md:text-6xl mb-12 leading-tight">
          {t('footer', 'title')}
        </h2>
        <button 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="footer-anim inline-flex items-center gap-3 bg-stone-900 text-stone-100 border border-stone-800 px-12 py-6 font-label text-sm tracking-widest uppercase font-bold hover:bg-stone-800 transition-colors duration-500 cursor-pointer"
          aria-label={t('footer', 'cta')}
        >
          {t('footer', 'cta')}
          <span ref={iconRef} className="material-symbols-outlined text-[16px] text-stone-400" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
      
      <div className="footer-anim w-full mt-24 flex flex-col items-center gap-12">
        {/* Performance Badges */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 hover:opacity-80 transition-opacity duration-700">
          {[
            { label: 'Performance', score: '86' },
            { label: 'Accessibility', score: '95' },
            { label: 'Best Practices', score: '100' },
            { label: 'SEO', score: '100' }
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center text-[0.65rem] font-bold text-stone-300">
                {badge.score}
              </div>
              <span className="font-label text-[0.6rem] tracking-widest uppercase text-stone-400">{badge.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="font-headline text-3xl text-stone-100">{t('nav', 'logo')}</div>
          <div className="font-label text-[10px] tracking-widest text-stone-400 uppercase">
            {t('footer', 'copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
}
