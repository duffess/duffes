// Etapas e pacotes (conteúdo de duffes/src/v3/data.ts). Confira os pacotes antes de publicar.

export type Step = { title: string; text: string; seal: string; en: { title: string; text: string; seal: string } };

export const steps: Step[] = [
  {
    title: 'Conversa',
    text: 'Você conta o que faz, quem são seus clientes e o que o site precisa resolver. Tudo pelo WhatsApp.',
    seal: 'pelo WhatsApp',
    en: { title: 'Chat', text: 'You tell us what you do, who your customers are and what the site needs to solve. All on WhatsApp.', seal: 'on WhatsApp' },
  },
  {
    title: 'Desenho',
    text: 'A gente desenha e programa uma página com a cara do seu negócio, não de um modelo pronto.',
    seal: 'sob medida',
    en: { title: 'Design', text: 'We design and code a page that looks like your business, not like a template.', seal: 'made to measure' },
  },
  {
    title: 'Ajustes',
    text: 'Você abre a prévia no seu celular, aponta o que quer mudar e a gente acerta antes de publicar.',
    seal: 'na sua tela',
    en: { title: 'Tweaks', text: 'You open the preview on your phone, point out changes and we fix them before launch.', seal: 'on your screen' },
  },
  {
    title: 'Assinatura',
    text: 'O site vai ao ar no seu endereço. A gente assina e entrega funcionando.',
    seal: 'no ar',
    en: { title: 'Signature', text: 'The site goes live on your domain. We sign it and hand it over working.', seal: 'live' },
  },
];

export type Plan = {
  id: string;
  name: string;
  price: number;
  summary: string;
  items: string[];
  message: string;
  en: { summary: string; items: string[]; message: string };
};

export const plans: Plan[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    price: 997,
    summary: 'Uma página para o seu negócio ser encontrado e chamado.',
    items: [
      'Página única com até seis seções',
      'Feita primeiro para o celular',
      'Botão do WhatsApp com mensagem pronta',
      'Título e descrição para aparecer no Google',
      'Publicada no seu domínio',
      'Duas rodadas de ajustes',
    ],
    message: 'Olá! Quero saber mais sobre o site Essencial.',
    en: {
      summary: 'One page so your business gets found and contacted.',
      items: [
        'Single page with up to six sections',
        'Built mobile-first',
        'WhatsApp button with a ready message',
        'Title and description for Google',
        'Published on your domain',
        'Two rounds of tweaks',
      ],
      message: "Hi! I'd like to know more about the Essencial site.",
    },
  },
  {
    id: 'completo',
    name: 'Completo',
    price: 1397,
    summary: 'Para quem quer mostrar tudo o que faz, com mais páginas.',
    items: [
      'Tudo o que vem no Essencial',
      'Até cinco páginas: serviços, fotos, cardápio, sobre',
      'Galeria de fotos do seu espaço ou do seu trabalho',
      'Formulário de contato além do WhatsApp',
      'Três rodadas de ajustes',
    ],
    message: 'Olá! Quero saber mais sobre o site Completo.',
    en: {
      summary: 'For businesses that want to show everything they do, across more pages.',
      items: [
        'Everything in Essencial',
        'Up to five pages: services, photos, menu, about',
        'Photo gallery of your space or work',
        'Contact form besides WhatsApp',
        'Three rounds of tweaks',
      ],
      message: "Hi! I'd like to know more about the Completo site.",
    },
  },
];

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: Number.isInteger(v) ? 0 : 2 });
