import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';
import { portfolioData, WHATSAPP_URL } from '../data/mockData';
import type { ProjectItem } from '../data/mockData';

type HeroProps = {
  onOpenProject: (project: ProjectItem, triggerEl: HTMLElement | null) => void;
};

const SHORT_NAMES: Record<ProjectItem['id'], string> = {
  patio: 'Pátio',
  fdm: 'Fábrica CT',
  dashflow: 'Dashflow',
  forma: 'Forma',
};

function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function Hero({ onOpenProject }: HeroProps) {
  const container = useRef<HTMLElement>(null);
  const magneticZoneRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const { t } = useLanguage();

  const projects = portfolioData.caseStudies;
  const [previewIdx, setPreviewIdx] = useState(0);
  const [hasSwitched, setHasSwitched] = useState(false);

  const activeProject = projects[previewIdx];
  const activeTitle = t('projects', activeProject.id, 'title');
  const activeSrcSet = `${activeProject.imageSrc.replace('.webp', '-400.webp')} 400w, ${activeProject.imageSrc.replace('.webp', '-669.webp')} 669w, ${activeProject.imageSrc} ${activeProject.width}w`;

  const line1 = t('hero', 'titleLine1');
  const line2 = t('hero', 'titleLine2');
  const accent = t('hero', 'titleAccent');
  const fullHeadlineLabel = `${line1} ${line2} ${accent}`;

  const normalWords = splitWords(`${line1} ${line2}`);
  const accentWords = splitWords(accent);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
        () => {
          const zone = magneticZoneRef.current;
          const btn = buttonRef.current;
          if (!zone || !btn) return;

          const xTo = gsap.quickTo(btn, 'x', { duration: 0.22, ease: 'power3.out' });
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.22, ease: 'power3.out' });
          let rect: DOMRect | null = null;

          const onEnter = () => {
            rect = btn.getBoundingClientRect();
          };

          const onMove = (e: MouseEvent) => {
            if (!rect) rect = btn.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.14;
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

      return () => mm.revert();
    },
    { scope: container }
  );

  const handleSelectPreview = (index: number) => {
    if (index === previewIdx) return;
    setHasSwitched(true);
    setPreviewIdx(index);
  };

  return (
    <section
      id="inicio"
      ref={container}
      aria-labelledby="hero-title"
      className="px-6 sm:px-10 md:px-14 lg:px-20 pt-5 sm:pt-8 pb-10 sm:pb-14 md:pb-16"
    >
      <div className="max-w-[1220px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Immediate Value Proposition + Primary & Secondary CTAs */}
        <div className="lg:col-span-6 xl:col-span-6">
          <h1
            id="hero-title"
            className="font-headline text-[2.25rem] sm:text-5xl md:text-[3.4rem] xl:text-[3.85rem] leading-[1.1] text-stone-100 letter-spacing-tighter mb-6 sm:mb-7"
          >
            <span className="sr-only">{fullHeadlineLabel}</span>
            {normalWords.map((word, idx) => (
              <span key={word + idx}>
                <span className="hero-word-window" aria-hidden="true" style={{ animationDelay: `${idx * 16}ms` }}>
                  <span className="hero-word">{word}</span>
                </span>{' '}
              </span>
            ))}
            <span className="block mt-1.5" aria-hidden="true">
              <em className="hero-accent-mark italic font-light">
                {accentWords.map((word, idx) => {
                  const isLast = idx === accentWords.length - 1;
                  return (
                    <span key={`aw-${idx}`}>
                      <span className="hero-word-window" style={{ animationDelay: `${120 + idx * 24}ms` }}>
                        <span className="hero-word">{word}</span>
                      </span>
                      {!isLast ? ' ' : ''}
                    </span>
                  );
                })}
                <svg viewBox="0 0 320 22" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    className="hero-accent-path"
                    d="M4 17 C 96 7, 218 7, 316 13"
                    pathLength="1"
                  />
                </svg>
              </em>
            </span>
          </h1>

          <p className="hero-subtitle font-body text-base sm:text-lg md:text-[1.125rem] text-stone-300 leading-relaxed mb-7 sm:mb-8 max-w-[46ch]">
            {t('hero', 'subtitle')}
          </p>

          <div className="hero-cta-enter flex flex-wrap items-center gap-3 sm:gap-4">
            <div ref={magneticZoneRef} className="inline-flex">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                ref={buttonRef}
                className="btn-editorial-primary"
              >
                <span className="btn-roll-label">
                  <span>{t('hero', 'cta')}</span>
                  <span aria-hidden="true">{t('hero', 'cta')}</span>
                </span>
                <span className="btn-editorial-arrow" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8H13M13 8L9 4M13 8L9 12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </div>

            <a href="#projetos" className="btn-editorial-secondary">
              <span>{t('hero', 'secondaryCta')}</span>
              <span className="btn-sec-arrow" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </div>

        {/* Right Column: Masked Real Work Preview + Quick Switcher */}
        <div className="lg:col-span-6 xl:col-span-6">
          <div className="hero-showcase-shell">
            <div className="relative">
              <div className="hero-showcase-backdrop" aria-hidden="true" />

              <div className="hero-preview-frame hero-preview-unveil ambient-shadow">
                {/* Top Browser Chrome */}
                <div className="h-9 bg-[#251b18] border-b border-[#3c2d28] px-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6d5249]" aria-hidden="true" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#523d37]" aria-hidden="true" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3f2f2a]" aria-hidden="true" />
                    <span className="ml-2 font-label text-[0.65rem] tracking-[0.1em] text-[#cbb1a6] truncate">
                      {activeTitle}
                    </span>
                  </div>

                  <span className="font-label text-[0.6rem] uppercase tracking-[0.14em] text-[#e7bfb0] shrink-0">
                    {activeProject.isDemo ? t('caseStudy', 'demoTag') : t('caseStudy', 'tag')}
                  </span>
                </div>

                {/* Interactive Preview Surface */}
                <button
                  type="button"
                  onClick={(e) => onOpenProject(activeProject, e.currentTarget)}
                  aria-label={`${t('hero', 'previewAction')}: ${activeTitle}`}
                  className="hero-preview-trigger relative block w-full text-left p-0 bg-[#161110] cursor-pointer overflow-hidden"
                >
                  <div className="overflow-hidden aspect-[16/10] bg-[#161110]">
                    <img
                      key={activeProject.id}
                      src={activeProject.imageSrc}
                      srcSet={activeSrcSet}
                      sizes="(max-width: 767px) 92vw, (max-width: 1023px) 86vw, 580px"
                      width={activeProject.width}
                      height={activeProject.height}
                      fetchPriority={previewIdx === 0 ? 'high' : 'auto'}
                      decoding="async"
                      alt={`Prévia real da página inicial do projeto ${activeTitle}`}
                      className={`hero-preview-media w-full h-full object-cover object-top block ${
                        hasSwitched ? 'hero-tab-swap' : 'hero-preview-settle'
                      }`}
                    />
                  </div>

                  {/* Persistent bottom bar — clear touch target on mobile and desktop */}
                  <div className="bg-[#211815]/95 border-t border-[#382925] px-4 py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-label text-[0.62rem] uppercase tracking-[0.15em] text-[#b99b90] block">
                        {activeProject.stats[0]?.value} · {activeProject.stats[1]?.value}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-label text-[0.66rem] font-bold uppercase tracking-[0.14em] text-[#faf6f0] shrink-0">
                      <span>{t('hero', 'previewAction')}</span>
                      <span className="hero-preview-cta-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Compact project switcher pills */}
            <div
              role="tablist"
              aria-label="Alternar prévia de projeto na abertura"
              className="relative z-10 mt-5 flex flex-wrap items-center gap-2"
            >
              {projects.map((proj, idx) => {
                const selected = idx === previewIdx;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => handleSelectPreview(idx)}
                    className={`px-3 py-1.5 rounded-full font-label text-[0.64rem] uppercase tracking-[0.13em] cursor-pointer transition-colors duration-200 border ${
                      selected
                        ? 'bg-stone-100 text-stone-950 border-stone-100 font-bold'
                        : 'bg-rose-soft/75 text-stone-300 border-rose-border hover:border-stone-400 hover:text-stone-100'
                    }`}
                  >
                    0{idx + 1} · {SHORT_NAMES[proj.id]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Golden Thread Start Station — right below the first fold row */}
      <div className="max-w-[1220px] mx-auto mt-10 sm:mt-12 flex justify-center">
        <span className="fio-estacao" data-fio-start aria-hidden="true" />
      </div>
    </section>
  );
}
