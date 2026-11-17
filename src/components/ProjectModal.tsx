import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';
import { useReducedMotion } from '../hooks/useReducedMotion';
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
  const externalIconRef = useRef<SVGSVGElement>(null);
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
            duration: 0.24,
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

  const handleLinkEnter = () => {
    if (prefersReducedMotion || !externalIconRef.current) return;
    gsap.to(externalIconRef.current, {
      x: 2,
      y: -2,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleLinkLeave = () => {
    if (prefersReducedMotion || !externalIconRef.current) return;
    gsap.to(externalIconRef.current, {
      x: 0,
      y: 0,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

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
        className="fixed inset-0 bg-[#2b1f1c]/45 backdrop-blur-[2px]"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative z-10 w-full max-w-[1120px] max-h-[90vh] bg-stone-950 border border-stone-800 rounded-[3px] shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-30 bg-stone-950/95 border border-stone-800 hover:border-stone-500 text-stone-200 hover:text-stone-100 px-3.5 py-2 rounded-full uppercase tracking-[0.14em] font-label text-[0.68rem] font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
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

        {/* Left Panel: Desktop Live/Image Preview */}
        <div className="hidden md:flex md:w-[52%] bg-rose-soft/85 border-r border-stone-800 p-8 lg:p-12 items-center justify-center">
          <div className="w-full aspect-[16/10] bg-stone-950 ambient-shadow rounded-[3px] overflow-hidden relative border border-stone-800 flex flex-col">
            <div className="h-7 bg-stone-900 border-b border-stone-800 flex items-center px-3.5 gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-stone-700" />
              <span className="w-2 h-2 rounded-full bg-stone-700" />
              <span className="w-2 h-2 rounded-full bg-stone-700" />
              <span className="ml-2 font-label text-[10px] tracking-wider text-stone-400 truncate">
                {projectTitle}
              </span>
            </div>
            <div className="relative flex-1 bg-stone-950 overflow-hidden">
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
              {isOpen && !project.isDemo && (
                <iframe
                  src={project.linkUrl}
                  className="absolute inset-0 w-full h-full border-none bg-stone-950"
                  title={`Prévia interativa de ${projectTitle}`}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Scrollable Details (includes compact preview on mobile) */}
        <div className="w-full md:w-[48%] overflow-y-auto p-6 pt-14 sm:p-8 sm:pt-14 md:p-12 lg:p-14">
          {/* Mobile compact preview */}
          <div className="md:hidden mb-6 rounded-[3px] overflow-hidden border border-stone-800 bg-stone-900">
            <div className="h-5 bg-stone-900 border-b border-stone-800 flex items-center px-3 gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
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
            <span className="inline-block px-3 py-1 rounded-full bg-rose-pill border border-rose-border text-[#6a443e] font-label text-[0.65rem] font-semibold tracking-[0.15em] uppercase mb-4">
              {badgeLabel}
            </span>

            <h2
              id="project-modal-title"
              className="font-headline text-3xl sm:text-4xl lg:text-5xl text-stone-100 leading-tight mb-3"
            >
              {projectTitle}
            </h2>
            <p className="font-body text-stone-300 mb-8 text-base leading-relaxed">
              {t('projects', project.id, 'description')}
            </p>

            <div className="space-y-7 mb-9">
              <div>
                <h3 className="font-label text-[0.66rem] font-bold tracking-[0.18em] text-rose-accent uppercase mb-2">
                  {t('projectDetails', 'challengeLabel')}
                </h3>
                <p className="font-body text-sm sm:text-base text-stone-300 leading-relaxed">
                  {t('projects', project.id, 'challenge')}
                </p>
              </div>

              <div>
                <h3 className="font-label text-[0.66rem] font-bold tracking-[0.18em] text-rose-accent uppercase mb-2">
                  {t('projectDetails', 'solutionLabel')}
                </h3>
                <p className="font-body text-sm sm:text-base text-stone-300 leading-relaxed">
                  {t('projects', project.id, 'solution')}
                </p>
              </div>

              <div>
                <h3 className="font-label text-[0.66rem] font-bold tracking-[0.18em] text-rose-accent uppercase mb-3">
                  {t('projectDetails', 'stackLabel')}
                </h3>
                <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="px-3 py-1.5 bg-rose-soft/70 border border-stone-800 text-stone-300 font-label text-[0.68rem] uppercase tracking-[0.14em] rounded-[2px]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={project.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={handleLinkEnter}
              onMouseLeave={handleLinkLeave}
              className="inline-flex items-center gap-3 bg-stone-100 text-stone-950 px-7 py-3.5 rounded-[2px] font-label text-xs tracking-[0.16em] uppercase font-bold hover:bg-[#4a3530] transition-colors duration-300 cursor-pointer"
            >
              <span>{t('projectDetails', 'liveBtn')}</span>
              <svg
                ref={externalIconRef}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  d="M4 10L10 4M10 4H5M10 4V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
