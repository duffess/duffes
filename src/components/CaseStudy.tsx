import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData, WHATSAPP_URL } from '../data/mockData';
import type { ProjectItem } from '../data/mockData';
import { useLanguage } from '../contexts/useLanguage';

type CaseStudyProps = {
  onOpenProject: (project: ProjectItem, triggerEl: HTMLElement | null) => void;
};

const stickyPreviewQuery = '(min-width: 1024px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)';

function ProjectArtwork({ project, title }: { project: ProjectItem; title?: string }) {
  const { imageSrc, width, height } = project;
  const srcSet = `${imageSrc.replace('.webp', '-400.webp')} 400w, ${imageSrc.replace('.webp', '-669.webp')} 669w, ${imageSrc} ${width}w`;

  return (
    <div className="overflow-hidden aspect-[16/10] bg-[#140e0d]">
      <img
        src={imageSrc}
        srcSet={srcSet}
        sizes="(max-width: 1023px) 92vw, 590px"
        width={width}
        height={height}
        decoding="async"
        loading="lazy"
        alt={title ? `Prévia da página inicial do projeto ${title}` : ''}
        className="project-preview-media w-full h-full object-cover object-top block"
      />
    </div>
  );
}

export function CaseStudy({ onOpenProject }: CaseStudyProps) {
  const container = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();
  const projects = portfolioData.caseStudies;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const headTrigger = container.current?.querySelector('[data-fio-proj-head]');
        gsap.from('.showcase-heading-item', {
          scrollTrigger: {
            trigger: headTrigger || container.current,
            start: 'top 84%',
            once: true,
          },
          y: 26,
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.62,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter',
        });

        const cards = gsap.utils.toArray<HTMLElement>('.project-card-reveal', container.current);
        cards.forEach((card, index) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              once: true,
            },
            y: 26,
            opacity: 0,
            duration: 0.56,
            delay: index % 2 === 1 ? 0.08 : 0,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          });
        });
      });

      mm.add(stickyPreviewQuery, () => {
        const cards = gsap.utils.toArray<HTMLElement>('.project-card', container.current);
        cards.forEach((card, index) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'top 56%',
            end: 'bottom 56%',
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
            onRefresh: (trigger) => {
              if (trigger.isActive) setActiveIndex(index);
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <section
      id="projetos"
      ref={container}
      aria-labelledby="projects-title"
      className="showcase-stage scroll-mt-16 px-6 sm:px-10 md:px-14 lg:px-20 py-20 sm:py-24 md:py-32 mb-24 md:mb-32"
    >
      <div className="max-w-[1220px] mx-auto">
        {/* Section Header */}
        <div data-fio-proj-head className="max-w-[680px] lg:max-w-[430px] xl:max-w-[540px] mb-14 md:mb-24">
          <span className="showcase-heading-item font-label text-xs font-semibold tracking-[0.2em] text-[#e2b2a0] uppercase mb-3.5 block">
            {t('caseStudy', 'headerLabel')} · 0{projects.length}
          </span>
          <h2
            id="projects-title"
            className="showcase-heading-item font-headline text-3xl sm:text-5xl md:text-[3.35rem] leading-[1.1] text-[#faf6f0] letter-spacing-tighter mb-5"
          >
            {t('caseStudy', 'headerTitle')}
          </h2>
          <p className="showcase-heading-item font-body text-base sm:text-lg text-[#cbb6ad] leading-relaxed">
            {t('caseStudy', 'headerSubtitle')}
          </p>
        </div>

        {/* Spacious Project Showcase Grid */}
        <div data-fio-proj-grid className="project-gallery mb-12 md:mb-16">
          <div className="project-gallery-cards">
            {projects.map((project, idx) => {
              const projectTitle = t('projects', project.id, 'title');
              const badgeLabel = project.isDemo
                ? t('caseStudy', 'demoTag')
                : t('caseStudy', 'tag');

              return (
                <article
                  key={project.id}
                  onFocusCapture={() => setActiveIndex(idx)}
                  className="project-card project-card-reveal stage-shadow flex flex-col"
                >
                  {/* Browser Frame + Clickable Site Preview */}
                  <a
                    href={project.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('caseStudy', 'liveCta')}: ${projectTitle}`}
                    className="project-inline-artwork project-preview-trigger block bg-[#16100f] border-b border-[#3d2e29] no-underline text-inherit"
                  >
                    <div className="h-8 bg-[#211815] border-b border-[#382a25] px-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#6d5249]" aria-hidden="true" />
                        <span className="w-2 h-2 rounded-full bg-[#523d37]" aria-hidden="true" />
                        <span className="w-2 h-2 rounded-full bg-[#3f2f2a]" aria-hidden="true" />
                        <span className="ml-2 font-label text-[0.65rem] tracking-[0.12em] text-[#b99e93] uppercase">
                          0{idx + 1} / 0{projects.length}
                        </span>
                      </div>

                      {/* Visible tap/open cue on mobile and desktop */}
                      <span className="inline-flex items-center gap-1 font-label text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-[#e7bfb0]">
                        <span>{t('caseStudy', 'liveCta')}</span>
                        <span className="project-link-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </span>
                    </div>

                    <ProjectArtwork project={project} title={projectTitle} />
                  </a>

                  {/* Card Copy & Explicit Actions */}
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full font-label text-[0.62rem] font-semibold tracking-[0.14em] uppercase border ${
                          project.isDemo
                            ? 'bg-[#362824] border-[#523d37] text-[#dcc4ba]'
                            : 'bg-[#432d27] border-[#6e4a40] text-[#f5ddd4]'
                        }`}
                      >
                        {badgeLabel}
                      </span>

                      <span className="font-label text-[0.65rem] uppercase tracking-[0.15em] text-[#b59b90]">
                        {project.stats.map((s) => s.value).join(' · ')}
                      </span>
                    </div>

                    <h3 className="font-headline text-2xl sm:text-3xl text-[#faf6f0] leading-snug mb-3">
                      {projectTitle}
                    </h3>

                    <p className="font-body text-sm sm:text-base text-[#cbb6ad] leading-relaxed mb-6">
                      {t('projects', project.id, 'description')}
                    </p>

                    <ul
                      aria-label="Tecnologias utilizadas"
                      className="flex flex-wrap gap-1.5 mb-7 list-none p-0 m-0 mt-auto"
                    >
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="px-2.5 py-1 bg-[#211815] border border-[#3d2e29] rounded-[3px] font-label text-[0.62rem] uppercase tracking-[0.13em] text-[#c8b1a7]"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-5 border-t border-[#3b2c27] flex flex-wrap items-center justify-between gap-4">
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link inline-flex items-center gap-2 bg-[#faf6f0] text-[#241a17] hover:bg-[#f0dfd7] px-4 py-2.5 rounded-[3px] font-label text-[0.68rem] font-bold uppercase tracking-[0.14em] no-underline transition-colors duration-200"
                      >
                        <span>{t('caseStudy', 'liveCta')}</span>
                        <span className="project-link-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </a>

                      <button
                        type="button"
                        onClick={(e) => onOpenProject(project, e.currentTarget)}
                        className="project-details-btn inline-flex items-center gap-2 py-2 font-label text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#e6c3b5] hover:text-[#faf6f0] bg-transparent border-0 cursor-pointer transition-colors duration-200"
                      >
                        <span>{t('caseStudy', 'detailsCta')}</span>
                        <span className="project-details-arrow" aria-hidden="true">
                          →
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="project-gallery-preview" aria-hidden="true">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="project-gallery-slide"
                data-project={project.id}
                data-active={index === activeIndex}
              >
                <div className="project-gallery-frame">
                  <p>{t('projects', project.id, 'title')}</p>
                  <ProjectArtwork project={project} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Project Callout Banner */}
        <div data-fio-proj-banner>
          <div className="project-card-reveal rounded-[6px] border border-[#4a3731] bg-[#2a1f1c] p-6 sm:p-9 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div data-fio-proj-banner-copy className="max-w-[560px] lg:max-w-[410px] xl:max-w-[490px]">
              <span className="font-label text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#e2b2a0] block mb-2">
                0{projects.length + 1} · {t('caseStudy', 'nextCardLabel')}
              </span>
              <h3 className="font-headline text-2xl sm:text-3xl text-[#faf6f0] leading-snug mb-2">
                {t('caseStudy', 'nextCardTitle')}
              </h3>
              <p className="font-body text-sm sm:text-base text-[#cbb6ad] leading-relaxed m-0">
                {t('caseStudy', 'nextCardDesc')}
              </p>
            </div>

            <a
              data-fio-proj-banner-cta
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="project-action-link inline-flex items-center justify-center gap-2.5 bg-[#faf6f0] text-[#241a17] hover:bg-[#f0dfd7] px-6 py-3.5 rounded-[3px] font-label text-xs font-bold uppercase tracking-[0.14em] no-underline transition-colors duration-200 shrink-0"
            >
              <span>{t('caseStudy', 'nextCardCta')}</span>
              <span className="project-link-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
