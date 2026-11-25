// Conteúdo do site. Edite aqui sem mexer no layout.

export const WHATSAPP_NUMBER = '5521992217782';
export const WHATSAPP_DISPLAY = '(21) 99221-7782';

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WA_MESSAGE = 'Olá! Quero conversar sobre um site para o meu negócio.';

export type NicheTheme = {
  bg: string;
  fg: string;
  accent: string;
  soft: string;
  onAccent: string;
};

export type Niche = {
  id: string;
  label: string;
  ownerPhrase: string;
  name: string;
  tagline: string;
  status: string;
  items: { title: string; detail: string }[];
  chat: string;
  theme: NicheTheme;
};

// Negócios fictícios usados só na demonstração do celular.
export const niches: Niche[] = [
  {
    id: 'barbearia',
    label: 'Barbearia',
    ownerPhrase: 'minha barbearia',
    name: 'Navalha',
    tagline: 'Corte, barba e aquele café enquanto espera.',
    status: 'Aberto hoje até 20h',
    items: [
      { title: 'Corte', detail: '40 min' },
      { title: 'Barba', detail: '30 min' },
      { title: 'Corte + barba', detail: '1h' },
    ],
    chat: 'Oi! Vi o site de vocês. Tem horário amanhã à tarde?',
    theme: { bg: '#1f1b18', fg: '#f3e9da', accent: '#c9a25b', soft: '#2d2723', onAccent: '#1f1b18' },
  },
  {
    id: 'academia',
    label: 'Academia',
    ownerPhrase: 'minha academia',
    name: 'Ferro Forte',
    tagline: 'Musculação, funcional e luta no mesmo lugar.',
    status: 'Aberto das 6h às 22h',
    items: [
      { title: 'Musculação', detail: 'Todos os dias' },
      { title: 'Funcional', detail: 'Seg, qua, sex' },
      { title: 'Muay thai', detail: 'Ter e qui' },
    ],
    chat: 'Opa! Queria agendar uma aula experimental.',
    theme: { bg: '#16181c', fg: '#f4f4f2', accent: '#ff7a1a', soft: '#23262c', onAccent: '#16181c' },
  },
  {
    id: 'clinica',
    label: 'Clínica',
    ownerPhrase: 'minha clínica',
    name: 'Sorrir Odonto',
    tagline: 'Cuidado com calma, do check-up ao aparelho.',
    status: 'Atendimento com hora marcada',
    items: [
      { title: 'Limpeza', detail: '45 min' },
      { title: 'Clareamento', detail: 'Avaliação' },
      { title: 'Ortodontia', detail: 'Avaliação' },
    ],
    chat: 'Boa tarde! Gostaria de marcar uma avaliação.',
    theme: { bg: '#f3faf8', fg: '#0f3b39', accent: '#139a8f', soft: '#dcefeb', onAccent: '#ffffff' },
  },
  {
    id: 'restaurante',
    label: 'Restaurante',
    ownerPhrase: 'meu restaurante',
    name: 'Cantina da Vila',
    tagline: 'Comida caseira, prato do dia e entrega no bairro.',
    status: 'Almoço das 11h às 15h',
    items: [
      { title: 'Prato do dia', detail: 'Seg a sex' },
      { title: 'Feijoada', detail: 'Sábado' },
      { title: 'Entrega', detail: 'No bairro' },
    ],
    chat: 'Oi! Vocês entregam aqui na rua de trás?',
    theme: { bg: '#fff4e6', fg: '#4a1b12', accent: '#cf3f28', soft: '#fbe2c8', onAccent: '#ffffff' },
  },
  {
    id: 'salao',
    label: 'Salão',
    ownerPhrase: 'meu salão',
    name: 'Studio Flor',
    tagline: 'Cabelo, unhas e sobrancelha sem pressa.',
    status: 'Aberto hoje até 19h',
    items: [
      { title: 'Escova', detail: '50 min' },
      { title: 'Coloração', detail: '2h' },
      { title: 'Unhas', detail: '1h' },
    ],
    chat: 'Oii! Tem vaga pra escova no sábado de manhã?',
    theme: { bg: '#fff1f4', fg: '#5a1f3a', accent: '#d94f84', soft: '#f9d5df', onAccent: '#ffffff' },
  },
];

export type Project = {
  id: string;
  kind: 'cliente' | 'estudo';
  title: string;
  place?: string;
  description: string;
  descriptionEn: string;
  details: [string, string][];
  image: string;
  srcSet: string;
  width: number;
  height: number;
  url: string;
  urlLabel: string;
};

export const projects: Project[] = [
  {
    id: 'fdm',
    kind: 'cliente',
    title: 'Fábrica de Monstros CT',
    place: 'Campo Grande, Rio de Janeiro',
    description:
      'Centro de treinamento. O site mostra a estrutura e leva quem chega pelo celular direto para a matrícula no WhatsApp.',
    image: '/fabricademonstros.webp',
    srcSet: '/fabricademonstros-669.webp 669w, /fabricademonstros.webp 1280w',
    width: 1280,
    height: 634,
    descriptionEn: 'Training centre. The site shows the space and takes mobile visitors straight to sign-up on WhatsApp.',
    details: [
      ['Matrícula direta pelo WhatsApp', 'Sign-up straight on WhatsApp'],
      ['Estrutura e modalidades em fotos', 'Space and classes shown in photos'],
      ['Feito primeiro para o celular', 'Built mobile-first'],
    ],
    url: '/fabricademonstros/',
    urlLabel: 'lysss.vercel.app/fabricademonstros',
  },
  {
    id: 'patio',
    kind: 'estudo',
    title: 'Pátio Arquitetura',
    description: 'Estudo para um escritório de arquitetura, com bastante espaço para fotografia e uma navegação calma.',
    image: '/patio-preview.webp',
    srcSet: '/patio-preview-669.webp 669w, /patio-preview.webp 1224w',
    width: 1224,
    height: 873,
    descriptionEn: 'Study for an architecture office, with room for photography and calm navigation.',
    details: [
      ['Fotografia em tela cheia', 'Full-screen photography'],
      ['Navegação calma, sem distração', 'Calm, distraction-free navigation'],
      ['Projetos organizados por obra', 'Projects organised by build'],
    ],
    url: '/patio/',
    urlLabel: 'lysss.vercel.app/patio',
  },
  {
    id: 'forma',
    kind: 'estudo',
    title: 'Forma Estúdio',
    description:
      'Estudo para um estúdio de casas e apartamentos, com rolagem suave e projetos em destaque. Marca e imagens fictícias.',
    image: '/forma-preview.webp',
    srcSet: '/forma-preview-669.webp 669w, /forma-preview.webp 1280w',
    width: 1280,
    height: 720,
    descriptionEn: 'Study for a home and apartment studio, with smooth scrolling and featured projects. Fictional brand and images.',
    details: [
      ['Rolagem suave entre os projetos', 'Smooth scrolling between projects'],
      ['Projetos em destaque com ficha técnica', 'Featured projects with specs'],
      ['Marca e imagens fictícias', 'Fictional brand and images'],
    ],
    url: '/forma/',
    urlLabel: 'lysss.vercel.app/forma',
  },
  {
    id: 'dashflow',
    kind: 'estudo',
    title: 'Dash',
    description: 'Página de apresentação para um software de análise, com leitura rápida e seções diretas.',
    image: '/dash-lp.webp',
    srcSet: '/dash-lp-669.webp 669w, /dash-lp.webp 1600w',
    width: 1600,
    height: 791,
    descriptionEn: 'Landing page for an analytics product, quick to read with straight-to-the-point sections.',
    details: [
      ['Leitura rápida, seções diretas', 'Quick read, direct sections'],
      ['Números do produto em destaque', 'Product numbers up front'],
      ['Chamada para teste em cada dobra', 'Trial call-to-action on every fold'],
    ],
    url: '/dashflow/',
    urlLabel: 'lysss.vercel.app/dashflow',
  },
];

export const stepsEn = [
  { title: 'Chat', text: 'You tell us what you do, who your customers are and what the site needs to solve. All on WhatsApp.' },
  { title: 'Design', text: 'We design and code a page that looks like your business, not like a template.' },
  { title: 'Tweaks', text: 'You open the preview on your phone, point out changes and we fix them before launch.' },
  { title: 'Signature', text: 'The site goes live on your domain. We sign it and hand it over working.' },
];

export const steps = [
  {
    title: 'Conversa',
    text: 'Você conta o que faz, quem são seus clientes e o que o site precisa resolver. Tudo pelo WhatsApp.',
  },
  { title: 'Desenho', text: 'A gente desenha e programa uma página com a cara do seu negócio, não de um modelo pronto.' },
  {
    title: 'Ajustes',
    text: 'Você abre a prévia no seu celular, aponta o que quer mudar e a gente acerta antes de publicar.',
  },
  { title: 'Assinatura', text: 'O site vai ao ar no seu endereço. A gente assina e entrega funcionando.' },
];

// Pacotes. Confira o que entra em cada um antes de publicar.
export type Plan = {
  id: string;
  name: string;
  price: string;
  summary: string;
  items: string[];
  summaryEn: string;
  itemsEn: string[];
  message: string;
};

export const plans: Plan[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    price: 'R$ 997',
    summary: 'Uma página para o seu negócio ser encontrado e chamado.',
    items: [
      'Página única com até seis seções',
      'Feita primeiro para o celular',
      'Botão do WhatsApp com mensagem pronta',
      'Título e descrição para aparecer no Google',
      'Publicada no seu domínio',
      'Duas rodadas de ajustes',
    ],
    summaryEn: 'One page so your business gets found and contacted.',
    itemsEn: ['Single page with up to six sections', 'Built mobile-first', 'WhatsApp button with a ready message', 'Title and description for Google', 'Published on your domain', 'Two rounds of tweaks'],
    message: 'Olá! Quero saber mais sobre o site Essencial.',
  },
  {
    id: 'completo',
    name: 'Completo',
    price: 'R$ 1.397',
    summary: 'Para quem quer mostrar tudo o que faz, com mais páginas.',
    items: [
      'Tudo o que vem no Essencial',
      'Até cinco páginas: serviços, fotos, cardápio, sobre',
      'Galeria de fotos do seu espaço ou do seu trabalho',
      'Formulário de contato além do WhatsApp',
      'Três rodadas de ajustes',
    ],
    summaryEn: 'For businesses that want to show everything they do, across more pages.',
    itemsEn: ['Everything in Essencial', 'Up to five pages: services, photos, menu, about', 'Photo gallery of your space or work', 'Contact form besides WhatsApp', 'Three rounds of tweaks'],
    message: 'Olá! Quero saber mais sobre o site Completo.',
  },
];
