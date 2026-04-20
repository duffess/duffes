import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    // Editorial Reveal with clip-path
    gsap.from('.hero-reveal', {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      y: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out',
      delay: 0.1
    });

    // Subtitle Reveal
    gsap.from('.hero-sub-reveal', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5
    });
  }, { scope: container });

  const buttonRectRef = useRef<DOMRect | null>(null);

  const updateButtonRect = useCallback(() => {
    if (buttonRef.current) {
      buttonRectRef.current = buttonRef.current.getBoundingClientRect();
    }
  }, []);

  // Magnetic Button Logic
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    // Read cached rect instead of calling getBoundingClientRect()
    let rect = buttonRectRef.current;
    if (!rect) {
      rect = buttonRef.current.getBoundingClientRect();
      buttonRectRef.current = rect;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Distância do mouse ao centro
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const radius = 100; // Raio de atração

    if (dist < radius) {
      const moveX = (e.clientX - centerX) * 0.35;
      const moveY = (e.clientY - centerY) * 0.35;
      gsap.to(buttonRef.current, { x: moveX, y: moveY, duration: 0.4, ease: 'power3.out', overwrite: true });
      gsap.to(iconRef.current, { x: moveX * 0.5, duration: 0.4, ease: 'power3.out', overwrite: true });
    } else {
      handleMouseLeave();
    }
  }, []);

  const handleMouseEnter = () => {
    updateButtonRect();
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', overwrite: true });
    gsap.to(iconRef.current, { x: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', overwrite: true });
    buttonRectRef.current = null;
  };

  return (
    <section ref={container} className="px-8 md:px-24 min-h-[85vh] flex flex-col justify-center mb-32 pt-16 select-none">
      <div className="max-w-[1200px] relative w-full">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-[6rem] leading-[1.15] text-stone-100 letter-spacing-tighter mb-12">
          <div className="hero-reveal overflow-hidden inline-block mr-4 pb-4">
            {t('hero', 'title')}
          </div>
          <div className="hero-reveal italic font-light opacity-80 overflow-hidden inline-block pb-4">
            {t('hero', 'titleItalic')}
          </div>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-start-6 md:col-span-7">
            <p className="hero-sub-reveal font-body text-xl md:text-2xl text-stone-300 leading-relaxed mb-8">
              {t('hero', 'subtitle')}
            </p>
            <div className="hero-sub-reveal mb-12 h-px w-24 bg-stone-300 opacity-30"></div>
            
            <div className="flex items-center" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
              <button 
                ref={buttonRef}
                className="hero-sub-reveal inline-flex items-center gap-3 bg-stone-100 text-stone-900 px-8 py-4 font-label text-xs tracking-widest uppercase font-bold hover:bg-stone-300 transition-colors duration-500 cursor-pointer relative z-10"
              >
                {t('hero', 'cta')}
                <span ref={iconRef} className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
