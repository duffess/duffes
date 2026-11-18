import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';
import { WHATSAPP_URL } from '../data/mockData';

export function CallToAction() {
  return null;
}

export function Footer() {
  const container = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const copyTrigger = container.current?.querySelector('[data-fio-footer-copy]');
        gsap.from('.footer-anim', {
          scrollTrigger: {
            trigger: copyTrigger || container.current,
            start: 'top 86%',
            once: true,
          },
          y: 24,
          opacity: 0,
          filter: 'blur(5px)',
          duration: 0.58,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter',
        });
      });
    },
    { scope: container }
  );

  return (
    <footer
      ref={container}
      className="bg-rose-soft/70 border-t border-rose-border text-stone-100 px-6 sm:px-10 md:px-14 lg:px-20 pt-20 pb-14 w-full"
    >
      <div className="max-w-[1220px] mx-auto flex flex-col items-center text-center">
        <div className="max-w-[460px] sm:max-w-[500px]">
          <div data-fio-footer-copy>
            <span className="footer-anim font-label text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent block mb-3.5">
              {t('footer', 'eyebrow')}
            </span>
            <h2 className="footer-anim font-headline text-3xl sm:text-5xl md:text-[3.5rem] mb-4 leading-[1.12] letter-spacing-tighter text-stone-100">
              {t('footer', 'title')}
            </h2>
            <p className="footer-anim font-body text-base sm:text-lg text-stone-300 leading-relaxed m-0">
              {t('footer', 'subtitle')}
            </p>
          </div>

          {/* Golden Thread Terminating Station — lands right at the last CTA button */}
          <div className="mt-20 mb-3.5 flex justify-center">
            <span className="fio-estacao" data-fio-end aria-hidden="true" />
          </div>

          <div className="footer-anim">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial-primary"
            >
              <span className="btn-roll-label">
                <span>{t('footer', 'cta')}</span>
                <span aria-hidden="true">{t('footer', 'cta')}</span>
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
        </div>

        <div className="footer-anim w-full mt-16 pt-8 border-t border-rose-border/75 flex flex-col md:flex-row justify-between items-center gap-6">
          <a href="#inicio" className="brand-lockup" aria-label="LYSS — voltar ao início">
            <span>{t('nav', 'logo')}</span>
            <small>CRIAÇÃO DE SITES</small>
          </a>

          <nav aria-label="Navegação do rodapé" className="flex flex-wrap justify-center gap-6">
            <a href="#projetos" className="header-nav-link">
              {t('nav', 'projects')}
            </a>
            <a href="#servicos" className="header-nav-link">
              {t('nav', 'services')}
            </a>
            <a href="#metodo" className="header-nav-link">
              {t('nav', 'method')}
            </a>
            <a href="#sobre" className="header-nav-link">
              {t('nav', 'about')}
            </a>
          </nav>

          <p className="font-label text-[0.65rem] tracking-[0.14em] text-stone-400 uppercase m-0">
            {t('footer', 'copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
