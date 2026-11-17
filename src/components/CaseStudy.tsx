import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/mockData';
import type { ProjectItem } from '../data/mockData';
import { useLanguage } from '../contexts/useLanguage';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ProjectModal } from './ProjectModal';

type CaseStudyProps = {
  onModalStateChange?: (isOpen: boolean) => void;
};

export function CaseStudy({ onModalStateChange }: CaseStudyProps) {
  const container = useRef<HTMLElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const magneticZoneRef = useRef<HTMLDivElement>(null);
  const detailsBtnRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const prevIndexRef = useRef(0);

  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = portfolioData.caseStudies;
  const currentProject = projects[activeIndex];

  // Section scroll reveal + subtle magnetic CTA + thumbnail warmup
  useGSAP(
    () => {
      // Preload remaining carousel thumbnails when user scrolls near section
      const warmupTrigger = ScrollTrigger.create({
        trigger: container.current,
        start: 'top 120%',
        once: true,
        onEnter: () => {
          projects.slice(1).forEach((proj) => {
            const img = new Image();
            img.src = proj.imageSrc.replace('.webp', '-669.webp');
          });
        },
      });

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.project-header', {
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

        gsap.from('.project-stage', {
          scrollTrigger: {
            trigger: container.current,
            start: 'top 82%',
            once: true,
          },
          y: 18,
          opacity: 0,
          duration: 0.42,
          ease: 'power2.out',
          clearProps: 'transform',
        });
      });

      mm.add(
        '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
        () => {
          const zone = magneticZoneRef.current;
          const btn = detailsBtnRef.current;
          if (!zone || !btn) return;

          const xTo = gsap.quickTo(btn, 'x', { duration: 0.28, ease: 'power3.out' });
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.28, ease: 'power3.out' });
          let rect: DOMRect | null = null;

          const onEnter = () => {
            rect = btn.getBoundingClientRect();
          };

          const onMove = (e: MouseEvent) => {
            if (!rect) rect = btn.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
            xTo(gsap.utils.clamp(-6, 6, dx));
            yTo(gsap.utils.clamp(-4, 4, dy));
          };

          const onLeave = () => {
            rect = null;
            xTo(0);
            yTo(0);
          };

          zone.addEventListener('mouseenter', onEnter);
          zone.addEventListener('mousemove', onMove);
          zone.addEventListener('mouseleave', onLeave);

          return () => {
            zone.removeEventListener('mouseenter', onEnter);
            zone.removeEventListener('mousemove', onMove);
            zone.removeEventListener('mouseleave', onLeave);
          };
        }
      );

      return () => {
        warmupTrigger.kill();
      };
    },
    { scope: container }
  );

  // Fast, StrictMode-safe, rapid-click-safe project switch transition
  useGSAP(
    () => {
      if (prevIndexRef.current === activeIndex) return;
      prevIndexRef.current = activeIndex;

      if (prefersReducedMotion) return;

      gsap.fromTo(
        '.case-switch-item',
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.24,
          stagger: 0.025,
          ease: 'power2.out',
          overwrite: true,
          clearProps: 'transform',
        }
      );
    },
    { dependencies: [activeIndex, prefersReducedMotion], scope: cardContentRef, revertOnUpdate: true }
  );

  const selectProject = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
  };

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleCarouselKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextProject();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevProject();
    }
  };

  const openModal = (project: ProjectItem, triggerEl: HTMLElement | null) => {
    lastTriggerRef.current = triggerEl;
    setModalProject(project);
    setIsModalOpen(true);
    onModalStateChange?.(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    onModalStateChange?.(false);
  }, [onModalStateChange]);

  const handleModalExited = useCallback(() => {
    setModalProject(null);
  }, []);

  const projectTitle = t('projects', currentProject.id, 'title');
  const badgeLabel = currentProject.isDemo ? t('caseStudy', 'demoTag') : t('caseStudy', 'tag');
  const srcSet = `${currentProject.imageSrc.replace('.webp', '-400.webp')} 400w, ${currentProject.imageSrc.replace('.webp', '-669.webp')} 669w, ${currentProject.imageSrc} ${currentProject.width}w`;

  return (
    <>
      <section
        id="projetos"
        ref={container}
        aria-labelledby="projects-title"
        className="scroll-mt-28 px-6 sm:px-10 md:px-16 lg:px-20 mb-28 md:mb-40 relative"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-14 md:mb-20 text-center">
            <span className="project-header font-label text-xs font-semibold tracking-[0.2em] text-rose-accent uppercase mb-4 block">
              {t('caseStudy', 'headerLabel')}
            </span>
            <h2
              id="projects-title"
              className="project-header font-headline text-4xl sm:text-5xl md:text-6xl text-stone-100 letter-spacing-tighter italic font-light"
            >
              {t('caseStudy', 'headerTitle')}
            </h2>
          </div>

          <div
            onKeyDown={handleCarouselKeyDown}
            className="project-stage flex flex-col lg:flex-row gap-8 lg:gap-10 items-center relative"
          >
            {/* Project Display Card */}
            <div
              ref={cardContentRef}
              aria-live="polite"
              aria-atomic="true"
              className="case-card bg-rose-soft/80 border border-rose-border/80 rounded-[3px] p-6 sm:p-10 lg:p-14 relative overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-14 items-center flex-1 w-full ambient-shadow"
            >
              <div className="case-info w-full lg:w-[46%] order-2 lg:order-1">
                <span className="case-switch-item inline-block px-3 py-1 rounded-full bg-rose-pill border border-rose-border text-[#6a443e] font-label text-[0.65rem] font-semibold tracking-[0.15em] uppercase mb-5">
                  {badgeLabel}
                </span>

                <h3 className="case-switch-item font-headline text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.15] mb-5 text-stone-100">
                  {projectTitle}
                </h3>

                <p className="case-switch-item font-body text-base sm:text-lg text-stone-300 mb-8 leading-relaxed">
                  {t('projects', currentProject.id, 'description')}
                </p>

                <dl className="case-switch-item grid grid-cols-2 gap-6 mb-9 pt-6 border-t border-rose-border/70">
                  {currentProject.stats.map((stat) => (
                    <div key={stat.labelKey}>
                      <dt className="font-label text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-1">
                        {t('projects', currentProject.id, 'stats', stat.labelKey)}
                      </dt>
                      <dd className="font-headline text-xl md:text-2xl text-stone-100 m-0">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div ref={magneticZoneRef} className="case-switch-item inline-block">
                  <button
                    ref={detailsBtnRef}
                    type="button"
                    onClick={(e) => openModal(currentProject, e.currentTarget)}
                    className="inline-flex items-center gap-2.5 border-b border-stone-500 hover:border-stone-100 pb-1.5 font-label text-xs font-bold tracking-[0.15em] uppercase text-stone-200 hover:text-stone-100 transition-colors duration-200 cursor-pointer"
                  >
                    <span>{t('caseStudy', 'cta')}</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>

              {/* Accessible Browser-Framed Preview */}
              <div className="case-switch-item w-full lg:w-[54%] order-1 lg:order-2">
                <button
                  type="button"
                  onClick={(e) => openModal(currentProject, e.currentTarget)}
                  aria-label={`${t('caseStudy', 'cta')}: ${projectTitle}`}
                  className="group block w-full text-left rounded-[3px] overflow-hidden border border-stone-800 bg-stone-950 ambient-shadow cursor-pointer p-0"
                >
                  <div className="h-6 bg-stone-900 border-b border-stone-800 flex items-center px-3 gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-stone-700" />
                    <span className="w-2 h-2 rounded-full bg-stone-700" />
                    <span className="w-2 h-2 rounded-full bg-stone-700" />
                    <span className="ml-2 font-label text-[10px] tracking-wider text-stone-400 truncate">
                      {projectTitle}
                    </span>
                  </div>
                  <div className="overflow-hidden bg-stone-950">
                    <img
                      alt={`Prévia da página inicial do projeto ${projectTitle}`}
                      className="w-full aspect-[16/10] object-cover object-top block group-hover:scale-[1.02] transition-transform duration-500"
                      src={currentProject.imageSrc}
                      srcSet={srcSet}
                      sizes="(max-width: 767px) 90vw, (max-width: 1023px) 84vw, 560px"
                      width={currentProject.width}
                      height={currentProject.height}
                      decoding="async"
                      loading="lazy"
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Carousel Controls */}
            <div
              role="group"
              aria-label="Navegação entre projetos"
              className="flex lg:flex-col items-center gap-4 sm:gap-5"
            >
              <button
                type="button"
                onClick={prevProject}
                aria-label={t('caseStudy', 'previous')}
                className="w-11 h-11 border border-stone-700 bg-stone-950 rounded-full flex items-center justify-center text-stone-300 hover:text-stone-100 hover:border-stone-100 hover:bg-rose-soft transition-colors cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                  className="-rotate-90 lg:rotate-0"
                >
                  <path
                    d="M4.5 11.25L9 6.75L13.5 11.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex lg:flex-col items-center gap-1.5" role="tablist" aria-label="Selecionar projeto">
                {projects.map((proj, idx) => {
                  const isActive = idx === activeIndex;
                  const title = t('projects', proj.id, 'title');
                  return (
                    <button
                      key={proj.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Projeto ${idx + 1} de ${projects.length}: ${title}`}
                      onClick={() => selectProject(idx)}
                      className={`w-9 h-9 rounded-full font-label text-xs tracking-widest transition-colors cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-stone-100 text-stone-950 font-bold'
                          : 'text-stone-400 hover:text-stone-100 hover:bg-rose-soft/80'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={nextProject}
                aria-label={t('caseStudy', 'next')}
                className="w-11 h-11 border border-stone-700 bg-stone-950 rounded-full flex items-center justify-center text-stone-300 hover:text-stone-100 hover:border-stone-100 hover:bg-rose-soft transition-colors cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                  className="-rotate-90 lg:rotate-0"
                >
                  <path
                    d="M4.5 6.75L9 11.25L13.5 6.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onExited={handleModalExited}
        project={modalProject}
        returnFocusRef={lastTriggerRef}
      />
    </>
  );
}
