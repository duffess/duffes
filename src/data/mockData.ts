export type ProjectStat = {
  labelKey: string;
  value: string;
};

export type ProjectItem = {
  id: 'patio' | 'forma' | 'dashflow' | 'fdm';
  imageSrc: string;
  width: number;
  height: number;
  isDemo: boolean;
  stats: ProjectStat[];
  tags: string[];
  linkUrl: string;
};

export const WHATSAPP_NUMBER = '5521992217782';

export const WHATSAPP_URL =
  'https://wa.me/5521992217782?text=Ol%C3%A1!%20Quero%20conversar%20sobre%20meu%20projeto%20de%20site.';

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const portfolioData: { caseStudies: ProjectItem[] } = {
  caseStudies: [
    {
      id: 'patio',
      imageSrc: '/patio-preview.webp',
      width: 1224,
      height: 873,
      isDemo: true,
      stats: [
        { labelKey: 'category', value: 'Arquitetura' },
        { labelKey: 'format', value: 'Conceito' },
      ],
      tags: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
      linkUrl: '/patio/index.html',
    },
    {
      id: 'fdm',
      imageSrc: '/fabricademonstros.webp',
      width: 1280,
      height: 634,
      isDemo: false,
      stats: [
        { labelKey: 'category', value: 'Fitness' },
        { labelKey: 'format', value: 'Landing Page' },
      ],
      tags: ['React', 'Vite', 'Tailwind CSS', 'Mobile-First'],
      linkUrl: 'https://fabricademonstros.vercel.app/',
    },
    {
      id: 'dashflow',
      imageSrc: '/dash-lp.webp',
      width: 1600,
      height: 791,
      isDemo: false,
      stats: [
        { labelKey: 'category', value: 'SaaS' },
        { labelKey: 'format', value: 'Landing Page' },
      ],
      tags: ['React 19', 'Vite', 'Tailwind V4', 'UI/UX'],
      linkUrl: 'https://bespoke-torte-bcc555.netlify.app/',
    },
    {
      id: 'forma',
      imageSrc: '/forma-preview.webp',
      width: 1280,
      height: 720,
      isDemo: true,
      stats: [
        { labelKey: 'category', value: 'Arquitetura' },
        { labelKey: 'format', value: 'Conceito' },
      ],
      tags: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'Lenis'],
      linkUrl: '/forma/index.html',
    },
  ],
};
