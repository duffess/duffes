import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { WHATSAPP_URL } from '../data/mockData';

export function About() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.about-anim', {
          scrollTrigger: {
            trigger: container.current,
            start: 'top 86%',
            once: true,
          },
          y: 18,
          opacity: 0,
          duration: 0.42,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform',
        });
      });
    },
    { scope: container }
  );

  return (
    <section
      id="sobre"
      ref={container}
      className="about-section scroll-mt-28 px-6 sm:px-10 md:px-16 lg:px-20 mb-28 md:mb-40"
      aria-labelledby="about-title"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="about-layout ambient-shadow">
          <div className="about-image-wrap about-anim">
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
          <div className="about-copy about-anim">
            <span className="about-label">OLÁ, QUE BOM TER VOCÊ AQUI</span>
            <h2 id="about-title">
              Por trás da <em>LYSS.</em>
            </h2>
            <p>
              Um espaço para criar sites com cuidado, personalidade e atenção ao que faz seu
              negócio ser único.
            </p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Vamos conversar <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
