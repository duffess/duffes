import { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { portfolioData } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { ProjectModal } from './ProjectModal';

export function CaseStudy() {
  const container = useRef<HTMLElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const projects = portfolioData.caseStudies;
  const currentProject = projects[activeIndex];

  useGSAP(() => {
    // Editorial Reveal with clip-path
    gsap.from('.project-header', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
      },
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out'
    });

    // Vertical Parallax Effect on Images
    gsap.utils.toArray<HTMLElement>('.parallax-img').forEach((img) => {
      gsap.to(img, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }, { scope: container });

  // Handle Project Switching Animation
  useEffect(() => {
    if (!cardContentRef.current) return;

    setIsAnimating(true);
    
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    });

    // Content Reveal Sequence
    tl.fromTo(cardContentRef.current.querySelectorAll('.case-info > *, .case-image-wrapper'), 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
    );
  }, [activeIndex]);

  const switchProject = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    
    const tl = gsap.timeline({
      onComplete: () => setActiveIndex(index)
    });

    tl.to(cardContentRef.current?.querySelectorAll('.case-info > *, .case-image-wrapper') || [], {
      y: -15,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    });
  };

  const nextProject = () => {
    const nextIdx = (activeIndex + 1) % projects.length;
    switchProject(nextIdx);
  };

  const prevProject = () => {
    const prevIdx = (activeIndex - 1 + projects.length) % projects.length;
    switchProject(prevIdx);
  };

  const buttonRectRef = useRef<DOMRect | null>(null);

  const updateButtonRect = useCallback(() => {
    if (buttonRef.current) {
      buttonRectRef.current = buttonRef.current.getBoundingClientRect();
    }
  }, []);

  // Magnetic Button Logic
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    let rect = buttonRectRef.current;
    if (!rect) {
      rect = buttonRef.current.getBoundingClientRect();
      buttonRectRef.current = rect;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    const radius = 80;

    if (dist < radius) {
      const moveX = (e.clientX - centerX) * 0.4;
      const moveY = (e.clientY - centerY) * 0.4;
      gsap.to(buttonRef.current, { x: moveX, y: moveY, duration: 0.4, ease: 'power3.out', overwrite: true });
    } else {
      gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', overwrite: true });
      buttonRectRef.current = null;
    }
  }, []);

  const handleMouseEnter = () => {
    updateButtonRect();
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)', overwrite: true });
    buttonRectRef.current = null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openModal = (project: any) => setSelectedProject(project);
  const closeModal = () => setSelectedProject(null);

  return (
    <>
      <section 
        ref={container} 
        className="px-8 md:px-24 mb-48 relative select-none"
      >
        <div className="mb-24 text-center overflow-hidden">
           <span className="project-header font-label text-sm tracking-widest text-stone-400 uppercase mb-6 block">{t('caseStudy', 'headerLabel')}</span>
           <h2 className="project-header font-headline text-6xl md:text-7xl text-stone-100 letter-spacing-tighter italic font-light">{t('caseStudy', 'headerTitle')}</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center relative">
          
          {/* Project Display Card */}
          <div 
            ref={cardContentRef}
            className="case-card bg-stone-900/50 p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row gap-16 items-center flex-1 w-full"
          >
            <div className="case-info w-full md:w-1/2 order-2 md:order-1">
              <span className="font-label text-xs tracking-widest text-stone-400 uppercase mb-6 block">
                {t('caseStudy', 'tag')}
              </span>
              <h3 className="font-headline text-4xl md:text-5xl mb-8 text-stone-100">{t('projects', currentProject.id, 'title')}</h3>
              <p className="font-body text-lg text-stone-400 mb-12 leading-relaxed">
                {t('projects', currentProject.id, 'description')}
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                {currentProject.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="font-label text-[0.6rem] uppercase tracking-widest text-stone-400 mb-1">
                      {t('projects', currentProject.id, 'stats', stat.labelKey)}
                    </div>
                    <div className="font-headline text-3xl text-stone-100">{stat.value}</div>
                  </div>
                ))}
              </div>
              
              <div className="inline-block" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
                <button 
                  ref={buttonRef}
                  onClick={() => openModal(currentProject)}
                  className="inline-block border-b border-stone-700 pb-1 font-label text-xs tracking-widest uppercase text-stone-300 hover:text-stone-100 transition-colors duration-500 cursor-pointer relative z-10"
                >
                  {t('caseStudy', 'cta')}
                </button>
              </div>
            </div>
            
            <div className="case-image-wrapper overflow-hidden w-full md:w-1/2 order-1 md:order-2 ambient-shadow rounded-sm hover:-translate-y-1 transition-transform duration-700">
              <img 
                alt={`${currentProject.id} interface preview`} 
                className="parallax-img w-full aspect-[4/3] object-cover focus:outline-none opacity-90 cursor-pointer scale-110" 
                src={currentProject.imageSrc}
                srcSet={`${currentProject.imageSrc.replace('.webp', '-400.webp')} 400w, ${currentProject.imageSrc.replace('.webp', '-669.webp')} 669w, ${currentProject.imageSrc} 1055w`}
                sizes="(max-width: 768px) 400px, 1055px"
                onClick={() => openModal(currentProject)}
                loading="lazy"
              />
            </div>
          </div>

          {/* Navigation Side Counter (Right Side) */}
          <div className="flex lg:flex-col items-center gap-6">
            <button 
              onClick={prevProject}
              className="w-10 h-10 border border-stone-800 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-100 hover:border-stone-100 transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:-translate-y-1 transition-transform">keyboard_arrow_up</span>
            </button>
            
            <div className="font-label text-xs tracking-[0.3em] text-stone-100 flex lg:flex-col items-center gap-1">
              <span>0{activeIndex + 1}</span>
              <span className="text-stone-600 block my-1">/</span>
              <span className="text-stone-400">0{projects.length}</span>
            </div>

            <button 
              onClick={nextProject}
              className="w-10 h-10 border border-stone-800 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-100 hover:border-stone-100 transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:translate-y-1 transition-transform">keyboard_arrow_down</span>
            </button>
          </div>

        </div>
      </section>

      <ProjectModal 
        isOpen={!!selectedProject} 
        onClose={closeModal} 
        project={selectedProject} 
      />
    </>
  );
}
