import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: any;
};

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const externalIconRef = useRef<HTMLSpanElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      // Impede o scroll da pagina de fundo
      document.body.style.overflow = 'hidden';
      
      const tl = gsap.timeline();

      tl.to(overlayRef.current, {
        y: '0%',
        duration: 0.9,
        ease: 'expo.inOut'
      })
      .fromTo(contentRef.current, 
        { opacity: 0, y: 50, filter: 'blur(15px)', scale: 0.96 },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          scale: 1, 
          duration: 1.2, 
          ease: 'power4.out',
          clearProps: 'all' // Clean up filters for performance
        },
        "-=0.4"
      );
    } else {
      document.body.style.overflow = 'auto';
      
      gsap.to(overlayRef.current, {
        y: '100%',
        duration: 0.8,
        ease: 'expo.inOut'
      });
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 z-[100] bg-stone-950 flex flex-col md:flex-row translate-y-full"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-[110] text-stone-400 hover:text-stone-100 uppercase tracking-widest font-label text-xs flex items-center gap-2 cursor-pointer transition-colors"
      >
        {t('projectDetails', 'closeBtn')}
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>

      {/* Painel Esquerdo: Live Iframe (Restrito ao Desktop) */}
      <div className="hidden md:flex w-full md:w-1/2 h-[50vh] md:h-full bg-stone-900 border-b md:border-b-0 md:border-r border-stone-800 relative overflow-hidden items-center justify-center p-8 md:p-16">
        <div className="w-full aspect-video md:aspect-[4/3] bg-stone-950 ambient-shadow rounded-md overflow-hidden relative border border-stone-800">
          <div className="absolute top-0 w-full h-6 bg-stone-900 border-b border-stone-800 flex items-center px-4 gap-2">
            <div className="w-2 h-2 rounded-full bg-stone-700"></div>
            <div className="w-2 h-2 rounded-full bg-stone-700"></div>
            <div className="w-2 h-2 rounded-full bg-stone-700"></div>
          </div>
          {isOpen && (
            <div className="w-full h-full pt-6">
              <iframe 
                src={project.linkUrl} 
                className="w-full h-full border-none bg-stone-950"
                title={`${project.title} Preview`}
                loading="lazy"
              ></iframe>
            </div>
          )}
        </div>
      </div>

      {/* Painel Direito: Technical Details */}
      <div ref={contentRef} className="w-full md:w-1/2 h-full overflow-y-auto px-8 py-16 md:p-24 custom-scrollbar">
        <div className="max-w-[500px]">
          <h3 className="font-headline text-4xl md:text-6xl text-stone-100 mb-4">{t('projects', project.id, 'title')}</h3>
          <p className="font-body text-stone-400 mb-16 text-lg">{t('projects', project.id, 'description')}</p>
          
          <div className="mb-16">
            <span className="font-label text-[0.65rem] tracking-widest text-stone-400 uppercase mb-4 block">
              {t('projectDetails', 'challengeLabel')}
            </span>
            <p className="font-body text-stone-300 leading-relaxed">
              {t('projects', project.id, 'challenge')}
            </p>
          </div>

          <div className="mb-16">
            <span className="font-label text-[0.65rem] tracking-widest text-stone-400 uppercase mb-4 block">
              {t('projectDetails', 'solutionLabel')}
            </span>
            <p className="font-body text-stone-300 leading-relaxed">
              {t('projects', project.id, 'solution')}
            </p>
          </div>

          <div className="mb-16">
            <span className="font-label text-[0.65rem] tracking-widest text-stone-400 uppercase mb-4 block">
              {t('projectDetails', 'stackLabel')}
            </span>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag: string, i: number) => (
                <span key={i} className="px-4 py-2 border border-stone-800 text-stone-400 font-label text-xs uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <a 
            href={project.linkUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-3 bg-stone-100 text-stone-900 px-8 py-4 font-label text-xs tracking-widest uppercase font-bold hover:bg-stone-300 transition-colors duration-500 cursor-pointer"
            onMouseEnter={() => gsap.to(externalIconRef.current, { x: 3, y: -3, duration: 0.4, ease: 'power3.out' })}
            onMouseLeave={() => gsap.to(externalIconRef.current, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' })}
          >
            {t('projectDetails', 'liveBtn')}
            <span ref={externalIconRef} className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>
      </div>
    </div>
  );
}
