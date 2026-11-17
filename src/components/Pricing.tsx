import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/useLanguage';
import { WHATSAPP_URL } from '../data/mockData';

const copy = {
  pt: {
    label: 'Oferta de lançamento',
    title: 'Seu site, do primeiro passo ao ar.',
    description: 'Uma página profissional para o seu negócio.',
    price: 'R$ 497',
    priceNote: 'Pagamento único',
    includes: 'O que está incluído',
    items: [
      'Uma landing page com até 6 seções',
      'Design adaptado para celular e computador',
      'Botão de contato e configuração para o Google',
      'Até 2 rodadas de ajustes',
      'Domínio e hospedagem por 1 ano',
    ],
    renewal:
      'Após 1 ano, domínio e hospedagem são renovados pelo cliente, conforme valores do fornecedor.',
    custom: 'Mais páginas ou funcionalidades? Orçamento à parte.',
    cta: 'Conversar sobre meu site',
  },
  en: {
    label: 'Launch offer',
    title: 'Your website, from first idea to launch.',
    description: 'A professional page to introduce your business and help customers get in touch.',
    price: 'R$ 497',
    priceNote: 'One-time payment',
    includes: 'What is included',
    items: [
      'One landing page with up to 6 sections',
      'Responsive design for mobile and desktop',
      'Contact button and basic Google setup',
      'Up to 2 rounds of revisions',
      'Domain and hosting for 1 year',
    ],
    renewal:
      'After the first year, the client pays for domain and hosting renewal at the provider’s rates.',
    custom: 'Projects with more pages or features are quoted separately.',
    cta: 'Discuss my website',
  },
  es: {
    label: 'Oferta de lanzamiento',
    title: 'Tu sitio, de la idea a la publicación.',
    description:
      'Una página profesional para presentar tu negocio y facilitar el contacto con tus clientes.',
    price: 'R$ 497',
    priceNote: 'Pago único',
    includes: 'Qué incluye',
    items: [
      'Una landing page de hasta 6 secciones',
      'Diseño adaptable a móvil y ordenador',
      'Botón de contacto y configuración básica para Google',
      'Hasta 2 rondas de ajustes',
      'Dominio y alojamiento durante 1 año',
    ],
    renewal:
      'Después del primer año, la renovación del dominio y alojamiento corre por cuenta del cliente, según los precios del proveedor.',
    custom: 'Los proyectos con más páginas o funcionalidades se presupuestan por separado.',
    cta: 'Hablar sobre mi sitio',
  },
};

export function Pricing() {
  const container = useRef<HTMLElement>(null);
  const { language } = useLanguage();
  const content = copy[language];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.pricing-anim', {
          scrollTrigger: {
            trigger: container.current,
            start: 'top 86%',
            once: true,
          },
          y: 18,
          opacity: 0,
          duration: 0.4,
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
      id="valores"
      ref={container}
      className="scroll-mt-28 px-6 sm:px-10 md:px-16 lg:px-20 mb-28 md:mb-36"
      aria-labelledby="pricing-title"
    >
      <div className="max-w-[1200px] mx-auto border-t border-stone-800 pt-14 md:pt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5 pricing-anim">
          <span className="font-label text-xs font-semibold tracking-[0.2em] uppercase text-rose-accent block mb-4">
            {content.label}
          </span>
          <h2
            id="pricing-title"
            className="font-headline text-4xl sm:text-5xl md:text-[3.5rem] text-stone-100 leading-[1.12] letter-spacing-tighter mb-6"
          >
            {content.title}
          </h2>
          <p className="font-body text-lg text-stone-300 leading-relaxed max-w-md">
            {content.description}
          </p>
        </div>

        <div className="lg:col-span-7 pricing-anim border border-rose-border bg-rose-soft/75 rounded-[3px] p-7 sm:p-10 md:p-12 ambient-shadow">
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-8 mb-8 border-b border-rose-border/80">
            <p className="font-headline text-5xl sm:text-6xl text-stone-100 leading-none">
              {content.price}
            </p>
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-stone-950 border border-rose-border font-label text-xs font-semibold tracking-[0.14em] uppercase text-[#6a443e]">
              {content.priceNote}
            </span>
          </div>

          <h3 className="font-label text-xs font-bold tracking-[0.18em] uppercase text-stone-200 mb-5">
            {content.includes}
          </h3>

          <ul className="space-y-3.5 mb-8 list-none p-0 m-0">
            {content.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-body text-sm sm:text-base text-stone-200 leading-relaxed"
              >
                <span className="text-rose-accent font-semibold mt-0.5 shrink-0" aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-rose-border/70 space-y-2 mb-8">
            <p className="font-body text-xs sm:text-sm text-stone-400 leading-relaxed">
              {content.renewal}
            </p>
            <p className="font-body text-xs sm:text-sm text-stone-400 leading-relaxed">
              {content.custom}
            </p>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-stone-100 text-stone-950 px-7 py-4 rounded-[2px] font-label text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#4a3530] transition-colors duration-300"
          >
            <span>{content.cta}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
