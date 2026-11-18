// Conteúdo do site. Edite aqui sem mexer no layout.

export const WHATSAPP_NUMBER = '5521992217782';
export const WHATSAPP_DISPLAY = '(21) 99221-7782';

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_WA_MESSAGE = 'Olá! Quero conversar sobre um site para o meu negócio.';

// Preencha para mostrar o preço inicial na seção "O que vem no seu site".
// Exemplo: 'R$ 497'. Deixe null para esconder.
export const PRICE_FROM: string | null = null;

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
  kind: 'cliente' | 'demo';
  title: string;
  place?: string;
  description: string;
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
      'Site de um centro de treinamento, feito para quem chega pelo celular: mostra a estrutura e leva direto para a matrícula no WhatsApp.',
    image: '/fabricademonstros.webp',
    srcSet: '/fabricademonstros-400.webp 400w, /fabricademonstros-669.webp 669w, /fabricademonstros.webp 1280w',
    width: 1280,
    height: 634,
    url: 'https://fabricademonstros.vercel.app/',
    urlLabel: 'fabricademonstros.vercel.app',
  },
  {
    id: 'patio',
    kind: 'demo',
    title: 'Pátio Arquitetura',
    description:
      'Estudo para um escritório de arquitetura, com bastante espaço para fotografia e uma navegação calma.',
    image: '/patio-preview.webp',
    srcSet: '/patio-preview-400.webp 400w, /patio-preview-669.webp 669w, /patio-preview.webp 1224w',
    width: 1224,
    height: 873,
    url: '/patio/index.html',
    urlLabel: 'lysss.vercel.app/patio',
  },
  {
    id: 'forma',
    kind: 'demo',
    title: 'Forma Estúdio',
    description:
      'Estudo para um estúdio de casas e apartamentos, com rolagem suave e projetos em destaque. Marca e imagens fictícias.',
    image: '/forma-preview.webp',
    srcSet: '/forma-preview-400.webp 400w, /forma-preview-669.webp 669w, /forma-preview.webp 1280w',
    width: 1280,
    height: 720,
    url: '/forma/index.html',
    urlLabel: 'lysss.vercel.app/forma',
  },
  {
    id: 'dashflow',
    kind: 'demo',
    title: 'Dashflow',
    description:
      'Página de apresentação para um software de análise, com leitura rápida e seções diretas.',
    image: '/dash-lp.webp',
    srcSet: '/dash-lp-400.webp 400w, /dash-lp-669.webp 669w, /dash-lp.webp 1600w',
    width: 1600,
    height: 791,
    url: 'https://bespoke-torte-bcc555.netlify.app/',
    urlLabel: 'bespoke-torte-bcc555.netlify.app',
  },
];

export const deliverables = [
  {
    title: 'Feito primeiro para o celular',
    text: 'É por ele que seu cliente vai chegar. O site abre rápido e fica fácil de ler numa tela pequena, sem perder nada no computador.',
  },
  {
    title: 'Botão direto para o seu WhatsApp',
    text: 'Quem gostou do que viu fala com você em um toque, com uma mensagem já começada.',
  },
  {
    title: 'Pronto para aparecer no Google',
    text: 'Título, descrição e indexação configurados para o seu negócio ser encontrado quando alguém procurar.',
  },
  {
    title: 'No ar com o seu endereço',
    text: 'Eu configuro o domínio e a hospedagem. Você recebe o site publicado e funcionando.',
  },
  {
    title: 'Duas rodadas de ajustes',
    text: 'Você testa a prévia no seu celular e a gente acerta os detalhes antes de publicar.',
  },
];

export const steps = [
  { title: 'Conversa', text: 'Você me conta o que faz, quem são seus clientes e o que o site precisa resolver.' },
  { title: 'Criação', text: 'Eu desenho e programo uma página com a cara do seu negócio.' },
  { title: 'Ajustes', text: 'Você abre a prévia no celular e no computador. Ajustamos o que foi combinado.' },
  { title: 'No ar', text: 'O site é publicado no seu domínio, pronto para receber visitas.' },
];
