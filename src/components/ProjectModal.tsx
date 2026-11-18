import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { buildWhatsAppUrl } from '../data/mockData';
import type { ProjectItem } from '../data/mockData';

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExited: () => void;
  project: ProjectItem | null;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function ProjectModal({
  isOpen,
  onClose,
  onExited,
  project,
  returnFocusRef,
}: ProjectModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const wasOpenRef = useRef(false);

  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!project) return;

    if (isOpen) {
      wasOpenRef.current = true;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      const focusRaf = requestAnimationFrame(() => {
        closeBtnRef.current?.focus({ preventScroll: true });
      });

      tlRef.current?.kill();

      if (prefersReducedMotion) {
        if (backdropRef.current) gsap.set(backdropRef.current, { opacity: 1 });
        if (dialogRef.current) gsap.set(dialogRef.current, { opacity: 1, y: 0, scale: 1 });
      } else {
        const tl = gsap.timeline();
        tlRef.current = tl;
        tl.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.18, ease: 'power2.out' }
        ).fromTo(
          dialogRef.current,
          { opacity: 0, y: 14, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.22,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          0
        );
      }

      return () => {
        cancelAnimationFrame(focusRaf);
        tlRef.current?.kill();
      };
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      const triggerEl = returnFocusRef?.current;
      if (triggerEl) {
        requestAnimationFrame(() => {
          triggerEl.focus({ preventScroll: true });
        });
      }

      tlRef.current?.kill();

      if (prefersReducedMotion) {
        onExited();
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            tlRef.current = null;
            onExited();
          },
        });
        tlRef.current = tl;
        tl.to(dialogRef.current, {
          opacity: 0,
          y: 10,
          scale: 0.985,
          duration: 0.16,
          ease: 'power2.in',
        }).to(
          backdropRef.current,
          { opacity: 0, duration: 0.16, ease: 'power2.in' },
          0
        );
      }

      return () => {
        tlRef.current?.kill();
      };
    }
  }, [isOpen, project, prefersReducedMotion, onExited, returnFocusRef]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, project, onClose]);

  if (!project || typeof document === 'undefined') return null;

  const projectTitle = t('projects', project.id, 'title');
  const badgeLabel = project.isDemo ? t('caseStudy', 'demoTag') : t('caseStudy', 'tag');
  const srcSet = `${project.imageSrc.replace('.webp', '-400.webp')} 400w, ${project.imageSrc.replace('.webp', '-669.webp')} 669w, ${project.imageSrc} ${project.width}w`;
  const talkHref = buildWhatsAppUrl(
    `Olá! Vi o projeto ${projectTitle} no portfólio e quero conversar sobre um site.`
  );

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 ${
        isOpen ? '' : 'pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#1e1513]/65 backdrop-blur-[3px]"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative z-10 w-full max-w-[1100px] max-h-[90vh] bg-stone-950 border border-stone-800 rounded-[6px] shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 md:top-5 md:right-5 z-30 bg-stone-950/95 border border-stone-800 hover:border-stone-500 text-stone-200 hover:text-stone-100 px-3.5 py-2 rounded-full uppercase tracking-[0.14em] font-label text-[0.66rem] font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
        >
          <span>{t('projectDetails', 'closeBtn')}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Left Panel: Desktop Framed Site Preview */}
        <div className="hidden md:flex md:w-[52%] bg-[#221916] border-r border-stone-800 p-8 lg:p-11 items-center justify-center">
          <div className="w-full aspect-[16/10] bg-[#16100f] stage-shadow rounded-[5px] overflow-hidden relative border border-[#3d2e29] flex flex-col">
            <div className="h-7 bg-[#261c19] border-b border-[#3d2e29] flex items-center px-3.5 gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#6d5249]" />
              <span className="w-2 h-2 rounded-full bg-[#523d37]" />
              <span className="w-2 h-2 rounded-full bg-[#3f2f2a]" />
              <span className="ml-2 font-label text-[10px] tracking-wider text-[#cbb1a6] truncate">
                {projectTitle}
              </span>
            </div>
            <div className="relative flex-1 bg-[#16100f] overflow-hidden">
              <img
                src={project.imageSrc}
                srcSet={srcSet}
                sizes="540px"
                alt={`Prévia de ${projectTitle}`}
                width={project.width}
                height={project.height}
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Scrollable Case Details */}
        <div className="w-full md:w-[48%] overflow-y-auto p-6 pt-14 sm:p-8 sm:pt-14 md:p-11 lg:p-12">
          {/* Mobile compact preview */}
          <div className="md:hidden mb-6 rounded-[5px] overflow-hidden border border-stone-800 bg-[#1e1614]">
            <div className="h-5 bg-[#281e1b] border-b border-[#3d2e29] flex items-center px-3 gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6d5249]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#523d37]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#3f2f2a]" />
            </div>
            <img
              src={project.imageSrc}
              srcSet={srcSet}
              sizes="(max-width: 767px) 92vw, 500px"
              alt={`Prévia de ${projectTitle}`}
              width={project.width}
              height={project.height}
              decoding="async"
              className="w-full aspect-[16/10] object-cover object-top block"
            />
          </div>

          <div className="max-w-[460px]">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-pill border border-rose-border text-[#6a443e] font-label text-[0.63rem] font-semibold tracking-[0.14em] uppercase mb-3.5">
              {badgeLabel}
            </span>

            <h2
              id="project-modal-title"
              className="font-headline text-3xl sm:text-4xl text-stone-100 leading-tight mb-3"
            >
              {projectTitle}
            </h2>
            <p className="font-body text-stone-300 mb-7 text-base leading-relaxed">
              {t('projects', project.id, 'description')}
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-label text-[0.65rem] font-bold tracking-[0.18em] text-rose-accent uppercase mb-2">
                  {t('projectDetails', 'challengeLabel')}
                </h3>
                <p className="font-body text-sm sm:text-base text-stone-300 leading-relaxed">
                  {t('projects', project.id, 'challenge')}
                </p>
              </div>

              <div>
                <h3 className="font-label text-[0.65rem] font-bold tracking-[0.18em] text-rose-accent uppercase mb-2">
                  {t('projectDetails', 'solutionLabel')}
                </h3>
                <p className="font-body text-sm sm:text-base text-stone-300 leading-relaxed">
                  {t('projects', project.id, 'solution')}
                </p>
              </div>

              <div>
                <h3 className="font-label text-[0.65rem] font-bold tracking-[0.18em] text-rose-accent uppercase mb-2.5">
                  {t('projectDetails', 'stackLabel')}
                </h3>
                <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="px-3 py-1.5 bg-rose-soft/75 border border-stone-800 text-stone-200 font-label text-[0.66rem] uppercase tracking-[0.13em] rounded-[3px]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <a
                href={project.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-link inline-flex items-center justify-center gap-2.5 bg-stone-100 text-stone-950 px-6 py-3.5 rounded-[3px] font-label text-xs tracking-[0.15em] uppercase font-bold hover:bg-[#4a3530] transition-colors duration-200 cursor-pointer no-underline"
              >
                <span>{t('projectDetails', 'liveBtn')}</span>
                <span className="project-link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>

              <a
                href={talkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="project-details-btn inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[3px] border border-stone-700 hover:border-stone-300 font-label text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-stone-200 hover:text-stone-100 no-underline transition-colors duration-200"
              >
                <span>{t('projectDetails', 'talkBtn')}</span>
                <span className="project-details-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
