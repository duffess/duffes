import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';
import { WHATSAPP_URL } from '../data/mockData';

const deliverablesByLang = {
  pt: [
    {
      title: 'Estrutura pensada para o seu negócio',
      detail: 'Landing pages com até 6 seções objetivas ou páginas sob medida conforme o que você precisa apresentar.',
    },
    {
      title: 'Celular e computador com a mesma clareza',
      detail: 'Design responsivo pensado para leitura confortável, carregamento leve e navegação direta em telas pequenas.',
    },
    {
      title: 'Caminho direto para o contato e Google',
      detail: 'Botões claros de conversa pelo WhatsApp e configuração inicial de títulos, metadados e indexação.',
    },
    {
      title: 'Revisão próxima e publicação acompanhada',
      detail: 'Até 2 rodadas de ajustes alinhadas ao escopo, com configuração de domínio e hospedagem para colocar o site no ar.',
    },
  ],
  en: [
    {
      title: 'Structure tailored to your business',
      detail: 'Focused landing pages up to 6 sections or custom layouts shaped around your goals.',
    },
    {
      title: 'Clear reading on mobile and desktop',
      detail: 'Responsive design crafted for smooth navigation and fast loading across screen sizes.',
    },
    {
      title: 'Direct contact and Google setup',
      detail: 'Clear WhatsApp contact actions and foundational metadata setup for search visibility.',
    },
    {
      title: 'Guided revisions and launch',
      detail: 'Up to 2 agreed revision rounds plus domain and hosting configuration to go live smoothly.',
    },
  ],
  es: [
    {
      title: 'Estructura pensada para tu negocio',
      detail: 'Landing pages de hasta 6 secciones o páginas a medida según lo que necesites presentar.',
    },
    {
      title: 'Claridad en móvil y ordenador',
      detail: 'Diseño adaptable pensado para lectura cómoda y carga ligera en cualquier pantalla.',
    },
    {
      title: 'Contacto directo y presencia en Google',
      detail: 'Botones claros hacia WhatsApp y configuración inicial de metadatos para buscadores.',
    },
    {
      title: 'Revisión cercana y publicación guiada',
      detail: 'Hasta 2 rondas de ajustes acordadas, con configuración de dominio y alojamiento.',
    },
  ],
};

export function Pricing() {
  const container = useRef<HTMLElement>(null);
  const { language, t } = useLanguage();
  const items = deliverablesByLang[language];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const leftTrigger = container.current?.querySelector('[data-fio-serv-left]');
        const cardTrigger = container.current?.querySelector('[data-fio-serv-card]');

        gsap.from('.services-text-item', {
          scrollTrigger: {
            trigger: leftTrigger || container.current,
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

        gsap.from('.services-card-item', {
          scrollTrigger: {
            trigger: cardTrigger || container.current,
            start: 'top 85%',
            once: true,
          },
          y: 20,
          opacity: 0,
          duration: 0.52,
          stagger: 0.07,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      });
    },
    { scope: container }
  );

  return (
    <section
      id="servicos"
      ref={container}
      className="scroll-mt-28 px-6 sm:px-10 md:px-14 lg:px-20 mb-24 md:mb-32"
      aria-labelledby="services-title"
    >
      <div className="max-w-[1220px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div data-fio-serv-left className="lg:col-span-5">
          <span className="services-text-item font-label text-xs font-semibold tracking-[0.2em] uppercase text-rose-accent block mb-3.5">
            {t('services', 'label')}
          </span>
          <h2
            id="services-title"
            className="services-text-item font-headline text-3xl sm:text-5xl md:text-[3.25rem] text-stone-100 leading-[1.12] letter-spacing-tighter mb-5"
          >
            {t('services', 'title')}
          </h2>
          <p className="services-text-item font-body text-base sm:text-lg text-stone-300 leading-relaxed mb-7 max-w-[42ch]">
            {t('services', 'description')}
          </p>

          <div className="services-text-item">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-editorial-primary"
            >
              <span className="btn-roll-label">
                <span>{t('services', 'cta')}</span>
                <span aria-hidden="true">{t('services', 'cta')}</span>
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

        <div data-fio-serv-card className="lg:col-span-7 border border-rose-border bg-rose-soft/75 rounded-[6px] p-6 sm:p-9 md:p-11 ambient-shadow">
          <h3 className="services-card-item font-label text-xs font-bold tracking-[0.18em] uppercase text-stone-200 pb-5 mb-6 border-b border-rose-border/80">
            {t('services', 'includes')}
          </h3>

          <ul className="space-y-5 mb-7 list-none p-0 m-0">
            {items.map((item) => (
              <li key={item.title} className="services-card-item flex items-start gap-3.5">
                <span
                  className="w-5 h-5 rounded-full bg-rose-pill border border-rose-border text-rose-accent font-bold text-xs inline-flex items-center justify-center mt-0.5 shrink-0"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div>
                  <h4 className="font-headline text-lg sm:text-xl text-stone-100 leading-snug mb-1">
                    {item.title}
                  </h4>
                  <p className="font-body text-sm sm:text-base text-stone-300 leading-relaxed m-0">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="services-card-item pt-5 border-t border-rose-border/75 space-y-2">
            <p className="font-body text-xs sm:text-sm text-stone-400 leading-relaxed m-0">
              {t('services', 'domainNote')}
            </p>
            <p className="font-body text-xs sm:text-sm text-stone-400 leading-relaxed m-0">
              {t('services', 'scopeNote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
