import { useLanguage } from '../contexts/LanguageContext';

const copy = {
  pt: {
    label: 'Oferta de lançamento', title: 'Seu site, do primeiro passo ao ar.',
    description: 'Uma página profissional para apresentar seu negócio e facilitar o contato com seus clientes.',
    price: 'R$ 497', priceNote: 'Pagamento único · para os 5 primeiros clientes',
    includes: 'O que está incluído', items: ['Uma landing page com até 6 seções', 'Design adaptado para celular e computador', 'Botão de contato e configuração para o Google', 'Até 2 rodadas de ajustes', 'Domínio e hospedagem por 1 ano'],
    renewal: 'Após o primeiro ano, a renovação do domínio e da hospedagem fica por conta do cliente, conforme os valores do fornecedor.',
    custom: 'Projetos com mais páginas ou funcionalidades recebem orçamento separado.', cta: 'Conversar sobre meu site'
  },
  en: {
    label: 'Launch offer', title: 'Your website, from first idea to launch.',
    description: 'A professional page to introduce your business and help customers get in touch.',
    price: 'R$ 497', priceNote: 'One-time payment · for the first 5 clients',
    includes: 'What is included', items: ['One landing page with up to 6 sections', 'Responsive design for mobile and desktop', 'Contact button and basic Google setup', 'Up to 2 rounds of revisions', 'Domain and hosting for 1 year'],
    renewal: 'After the first year, the client pays for domain and hosting renewal at the provider’s rates.',
    custom: 'Projects with more pages or features are quoted separately.', cta: 'Discuss my website'
  },
  es: {
    label: 'Oferta de lanzamiento', title: 'Tu sitio, de la idea a la publicación.',
    description: 'Una página profesional para presentar tu negocio y facilitar el contacto con tus clientes.',
    price: 'R$ 497', priceNote: 'Pago único · para los primeros 5 clientes',
    includes: 'Qué incluye', items: ['Una landing page de hasta 6 secciones', 'Diseño adaptable a móvil y ordenador', 'Botón de contacto y configuración básica para Google', 'Hasta 2 rondas de ajustes', 'Dominio y alojamiento durante 1 año'],
    renewal: 'Después del primer año, la renovación del dominio y alojamiento corre por cuenta del cliente, según los precios del proveedor.',
    custom: 'Los proyectos con más páginas o funcionalidades se presupuestan por separado.', cta: 'Hablar sobre mi sitio'
  }
};

export function Pricing() {
  const { language } = useLanguage();
  const content = copy[language];
  return (
    <section id="valores" className="px-8 md:px-24 mb-40 md:mb-48" aria-labelledby="pricing-title">
      <div className="border-t border-stone-800 pt-12 md:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-6">
          <span className="font-label text-xs tracking-widest uppercase text-stone-400 block mb-6">{content.label}</span>
          <h2 id="pricing-title" className="font-headline text-4xl md:text-6xl text-stone-100 leading-tight tracking-tight mb-6">{content.title}</h2>
          <p className="font-body text-lg text-stone-400 leading-relaxed max-w-lg">{content.description}</p>
        </div>
        <div className="lg:col-span-6 border border-stone-800 bg-stone-900/40 p-8 md:p-12">
          <p className="font-headline text-5xl md:text-6xl text-stone-100 mb-3">{content.price}</p>
          <p className="font-label text-xs tracking-wide text-stone-400 mb-10">{content.priceNote}</p>
          <h3 className="font-label text-xs tracking-widest uppercase text-stone-300 mb-5">{content.includes}</h3>
          <ul className="space-y-3 mb-8">
            {content.items.map(item => <li key={item} className="flex gap-3 font-body text-sm text-stone-300 leading-relaxed"><span className="text-stone-500" aria-hidden="true">↗</span>{item}</li>)}
          </ul>
          <p className="font-body text-sm text-stone-400 leading-relaxed mb-3">{content.renewal}</p>
          <p className="font-body text-sm text-stone-400 leading-relaxed">{content.custom}</p>
          <a href="mailto:guiduffes@gmail.com?subject=Quero%20um%20site" className="inline-flex items-center gap-3 mt-8 border-b border-stone-500 pb-2 font-label text-xs uppercase tracking-widest text-stone-100 hover:border-stone-100 transition-colors">{content.cta}<span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
