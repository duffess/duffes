import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { WHATSAPP_URL } from '../data/mockData';
import { useLanguage } from '../contexts/useLanguage';

export function About() {
  const container = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const boxTrigger = container.current?.querySelector('[data-fio-about-box]');
        const copyTrigger = container.current?.querySelector('[data-fio-about-copy]');

        gsap.from('.about-photo-frame', {
          scrollTrigger: {
            trigger: boxTrigger || container.current,
            start: 'top 84%',
            once: true,
          },
          clipPath: 'inset(14% 0% 0% 0%)',
          opacity: 0,
          duration: 0.62,
          ease: 'power3.out',
          clearProps: 'clipPath,opacity',
        });

        gsap.from('.about-copy-item', {
          scrollTrigger: {
            trigger: copyTrigger || container.current,
            start: 'top 84%',
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
    <section
      id="sobre"
      ref={container}
      className="about-section scroll-mt-28 px-6 sm:px-10 md:px-14 lg:px-20 mb-24 md:mb-32"
      aria-labelledby="about-title"
    >
      <div className="max-w-[1220px] mx-auto">
        <div data-fio-about-box className="about-layout ambient-shadow">
          <div className="about-image-wrap">
            <div data-fio-about-img className="about-image-frame about-photo-frame">
              <img
                className="about-image"
                src="/lyss-retrato.webp"
                srcSet="/lyss-retrato-480.webp 480w, /lyss-retrato.webp 720w"
                sizes="(max-width: 767px) 90vw, 440px"
                width={720}
                height={1280}
                decoding="async"
                alt="Retrato da pessoa por trás da LYSS"
                loading="lazy"
              />
            </div>
          </div>

          <div className="about-copy">
            <div data-fio-about-copy>
              <span className="about-label about-copy-item">{t('about', 'label')}</span>
              <h2 id="about-title" className="about-copy-item">
                {t('about', 'titlePrefix')} <em>{t('about', 'titleBrand')}</em>
              </h2>
              <p className="about-copy-item">{t('about', 'description')}</p>
              <div className="about-copy-item mt-7">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-action-link inline-flex items-center gap-2 border-b border-[#b59186] hover:border-stone-100 pb-1.5 font-label text-xs font-bold uppercase tracking-[0.14em] text-[#6a443e] hover:text-stone-100 no-underline transition-colors duration-200"
                >
                  <span>{t('about', 'cta')}</span>
                  <span className="project-link-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
