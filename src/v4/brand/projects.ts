// Projetos (conteúdo de duffes/src/v3/data.ts, só em português).
//
// Vídeos: quando as gravações de tela chegarem, salve em public/<id>.mp4
// (8 a 12 s, 1280 px de largura, sem áudio) e preencha `video` abaixo.
// Enquanto `video` estiver vazio, a folha mostra a imagem.

export type Project = {
  id: string;
  kind: 'Cliente' | 'Estudo';
  title: string;
  place?: string;
  description: string;
  descriptionEn: string;
  details: string[];
  detailsEn: string[];
  image: string;
  imageSmall: string;
  video?: string;
  url: string;
  urlLabel: string;
};

export const projects: Project[] = [
  {
    id: 'marra',
    kind: 'Estudo',
    title: 'Marra',
    place: 'Rio de Janeiro',
    description:
      'Loja de streetwear carioca. Os looks se montam peça por peça, as camisetas giram numa arara em 3D e a rua aparece em movimento.',
    descriptionEn:
      'Rio streetwear store. Looks come together piece by piece, tees spin on a 3D rack and the street shows up in motion.',
    details: ['Provador com oito looks, peça por peça', 'Arara em 3D: arrasta e gira a camiseta', 'Lente de vidro que troca as fotos da rua'],
    detailsEn: ['Fitting room with eight looks, piece by piece', '3D rack: drag and spin the tee', 'Glass lens that swaps the street photos'],
    image: '/marra-preview.webp',
    imageSmall: '/marra-preview-669.webp',
    url: 'https://marra-one.vercel.app/',
    urlLabel: 'marra-one.vercel.app',
  },
  {
    id: 'aury',
    kind: 'Estudo',
    title: 'Aury Lopes Jr.',
    place: 'Porto Alegre e Brasília',
    description:
      'Estudo para um dos nomes do processo penal no Brasil: a advocacia, os livros e as palestras num site só.',
    descriptionEn: 'Study for one of the leading names in Brazilian criminal procedure: practice, books and talks on a single site.',
    details: ['Abertura em WebGL: o templo sai do fosco', 'Obras com link direto para a livraria', 'Contato sigiloso para defesa, parecer ou palestra'],
    detailsEn: ['WebGL opening: the temple rises out of the frost', 'Books linked straight to the bookstore', 'Confidential contact for defence, opinions or talks'],
    image: '/aury-preview.webp',
    imageSmall: '/aury-preview-669.webp',
    url: 'https://aurylopesjr.vercel.app/',
    urlLabel: 'aurylopesjr.vercel.app',
  },
  {
    id: 'fdm',
    kind: 'Cliente',
    title: 'Fábrica de Monstros CT',
    place: 'Campo Grande, Rio de Janeiro',
    description:
      'Centro de treinamento. O site mostra a estrutura e leva quem chega pelo celular direto para a matrícula no WhatsApp.',
    descriptionEn: 'Training centre. The site shows the space and takes mobile visitors straight to sign-up on WhatsApp.',
    details: ['Matrícula direta pelo WhatsApp', 'Estrutura e modalidades em fotos', 'Feito primeiro para o celular'],
    detailsEn: ['Sign-up straight on WhatsApp', 'Space and classes shown in photos', 'Built mobile-first'],
    image: '/fabricademonstros.webp',
    imageSmall: '/fabricademonstros-669.webp',
    url: 'https://lysss.vercel.app/fabricademonstros/',
    urlLabel: 'lysss.vercel.app/fabricademonstros',
  },
  {
    id: 'patio',
    kind: 'Estudo',
    title: 'Pátio Arquitetura',
    description: 'Estudo para um escritório de arquitetura, com bastante espaço para fotografia e uma navegação calma.',
    descriptionEn: 'Study for an architecture office, with room for photography and calm navigation.',
    details: ['Fotografia em tela cheia', 'Navegação calma, sem distração', 'Projetos organizados por obra'],
    detailsEn: ['Full-screen photography', 'Calm, distraction-free navigation', 'Projects organised by build'],
    image: '/patio-preview.webp',
    imageSmall: '/patio-preview-669.webp',
    url: 'https://lysss.vercel.app/patio/',
    urlLabel: 'lysss.vercel.app/patio',
  },
  {
    id: 'forma',
    kind: 'Estudo',
    title: 'Forma Estúdio',
    description:
      'Estudo para um estúdio de casas e apartamentos, com rolagem suave e projetos em destaque. Marca e imagens fictícias.',
    descriptionEn: 'Study for a home and apartment studio, with smooth scrolling and featured projects. Fictional brand and images.',
    details: ['Rolagem suave entre os projetos', 'Projetos em destaque com ficha técnica', 'Marca e imagens fictícias'],
    detailsEn: ['Smooth scrolling between projects', 'Featured projects with specs', 'Fictional brand and images'],
    image: '/forma-preview.webp',
    imageSmall: '/forma-preview-669.webp',
    url: 'https://lysss.vercel.app/forma/',
    urlLabel: 'lysss.vercel.app/forma',
  },
  {
    id: 'dash',
    kind: 'Estudo',
    title: 'Dash',
    description: 'Página de apresentação para um software de análise, com leitura rápida e seções diretas.',
    descriptionEn: 'Landing page for an analytics product, quick to read with straight-to-the-point sections.',
    details: ['Leitura rápida, seções diretas', 'Números do produto em destaque', 'Chamada para teste em cada dobra'],
    detailsEn: ['Quick read, direct sections', 'Product numbers up front', 'Trial call-to-action on every fold'],
    image: '/dash-lp.webp',
    imageSmall: '/dash-lp-669.webp',
    url: 'https://lysss.vercel.app/dashflow/',
    urlLabel: 'lysss.vercel.app/dashflow',
  },
];

/** Textos do projeto no idioma escolhido. */
export function projectText(p: Project, lang: 'pt' | 'en') {
  const en = lang === 'en';
  return {
    kind: en ? (p.kind === 'Cliente' ? 'Client' : 'Study') : p.kind,
    description: en ? p.descriptionEn : p.description,
    details: en ? p.detailsEn : p.details,
  };
}
