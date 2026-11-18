export type Language = 'pt' | 'en' | 'es';

export const translations = {
  pt: {
    nav: {
      logo: 'LYSS',
      projects: 'Projetos',
      services: 'Serviços',
      method: 'Método',
      about: 'Sobre',
      contact: 'Conversar',
    },
    hero: {
      eyebrow: 'LYSS · CRIAÇÃO DE SITES',
      titleLine1: 'Crio sites que apresentam',
      titleLine2: 'seu negócio com',
      titleAccent: 'clareza e presença.',
      subtitle:
        'Páginas feitas sob medida para celular e computador, pensadas para mostrar o seu trabalho e facilitar a chegada de novos clientes.',
      cta: 'Conversar sobre meu projeto',
      secondaryCta: 'Ver projetos',
      previewLabel: 'Prévia de trabalho',
      previewAction: 'Abrir projeto',
      previewDetails: 'Ver ficha',
    },
    manifesto: {
      label: 'Abordagem',
      quote:
        'Um site pensado com cuidado para apresentar o seu trabalho, transmitir confiança e aproximar você de novos clientes.',
    },
    pillars: {
      p1Label: '01 / CLAREZA',
      p1Title: 'Prazo combinado desde o início',
      p1Desc: 'Cada entrega tem um cronograma claro, alinhado ao escopo do seu projeto.',
      p2Label: '02 / PROXIMIDADE',
      p2Title: 'Conversa direta',
      p2Desc:
        'Atendimento próximo para alinhar ideias, tirar dúvidas e acompanhar cada etapa pelo WhatsApp.',
      p3Label: '03 / CUIDADO TÉCNICO',
      p3Title: 'Bonito e fácil de navegar',
      p3Desc:
        'Páginas adaptadas para celular e computador, com atenção à leitura, velocidade e organização.',
    },
    caseStudy: {
      headerLabel: 'Trabalhos Selecionados',
      headerTitle: 'Cada projeto com a identidade do negócio.',
      headerSubtitle:
        'Projetos publicados e estudos demonstrativos construídos do zero. Toque ou clique em qualquer trabalho para abrir o site ou ver como foi pensado.',
      tag: 'Projeto publicado',
      demoTag: 'Projeto demonstrativo',
      liveCta: 'Abrir site ao vivo',
      detailsCta: 'Ver detalhes',
      nextCardLabel: 'Seu projeto aqui',
      nextCardTitle: 'Quer apresentar seu negócio com esse cuidado?',
      nextCardDesc:
        'Me conte sobre sua área e o que você precisa mostrar. Definimos juntos a estrutura ideal para o seu site.',
      nextCardCta: 'Conversar sobre meu projeto',
    },
    services: {
      label: 'O que eu entrego',
      title: 'Seu site, do primeiro passo ao ar.',
      description:
        'Cuido da estrutura, do visual e da publicação para que você tenha uma página profissional pronta para receber visitas e gerar conversas.',
      includes: 'Presente em cada projeto',
      scopeNote:
        'Landing pages objetivas ou sites com mais seções e funcionalidades são desenhados sob medida conforme o momento do seu negócio.',
      domainNote:
        'Inclui configuração inicial de domínio e hospedagem para deixar tudo publicado e funcionando.',
      cta: 'Conversar sobre meu projeto',
    },
    method: {
      eyebrow: 'Passo a passo',
      title: 'Como funciona',
      subtitle: 'Um processo direto e acompanhado de perto, sem etapas confusas.',
      s1Label: '01 / Diagnóstico',
      s1Desc: 'Conversamos sobre seu negócio, seu público e o objetivo principal do site.',
      s2Label: '02 / Criação',
      s2Desc: 'Desenho e desenvolvo uma página exclusiva, com a identidade do seu trabalho.',
      s3Label: '03 / Ajustes',
      s3Desc: 'Você navega pela prévia no celular e no computador e alinhamos os ajustes combinados.',
      s4Label: '04 / Publicação',
      s4Desc: 'Seu site vai ao ar com domínio configurado, rápido e pronto para receber visitas.',
    },
    about: {
      label: 'OLÁ, QUE BOM TER VOCÊ AQUI',
      titlePrefix: 'Por trás da',
      titleBrand: 'LYSS.',
      description:
        'Um espaço dedicado a criar sites com cuidado visual, código leve e atenção ao que torna cada negócio único.',
      cta: 'Conversar pelo WhatsApp',
    },
    projectDetails: {
      closeBtn: 'Fechar',
      challengeLabel: 'O Desafio',
      solutionLabel: 'A Solução',
      stackLabel: 'Tecnologias',
      liveBtn: 'Abrir site ao vivo',
      talkBtn: 'Quero um projeto com esse cuidado',
    },
    footer: {
      eyebrow: 'Próximo passo',
      title: 'Vamos tirar seu site do papel?',
      subtitle:
        'Me chame no WhatsApp para contar o que você faz e o que espera do seu novo site.',
      cta: 'Conversar sobre meu projeto',
      copyright: '© 2026 LYSS · CRIAÇÃO DE SITES. TODOS OS DIREITOS RESERVADOS.',
    },
    projects: {
      patio: {
        title: 'Pátio Arquitetura',
        description:
          'Site demonstrativo para um escritório de arquitetura, com direção editorial, espaço para fotografia e transições suaves.',
        challenge:
          'Criar uma presença digital para um escritório fictício, dando espaço à fotografia e a uma identidade visual marcante.',
        solution:
          'Uma página responsiva com direção editorial, projetos navegáveis e animações sutis. Marca e projetos são fictícios; as imagens são ilustrativas.',
        stats: { category: 'Segmento', format: 'Projeto' },
      },
      fdm: {
        title: 'Fábrica de Monstros CT',
        description:
          'Landing page com foco em contato direto e matrículas para um centro de treinamento no Rio de Janeiro.',
        challenge:
          'Criar uma presença digital alinhada à identidade intensa do espaço físico, facilitando a apresentação da estrutura e o contato de novos alunos.',
        solution:
          'Interface em modo escuro com destaque em laranja para orientar a leitura e os botões de ação, pensada especialmente para navegação no celular.',
        stats: { category: 'Segmento', format: 'Formato' },
      },
      dashflow: {
        title: 'Dashflow Landing Page',
        description:
          'Landing page para apresentação clara e objetiva de uma plataforma SaaS de análise com IA.',
        challenge:
          'Apresentar um software B2B de inteligência analítica de forma clara, moderna e fácil de compreender logo no primeiro acesso.',
        solution:
          'Interface escura de alto contraste construída com React e Vite, com leitura rápida, seções diretas e carregamento leve.',
        stats: { category: 'Segmento', format: 'Formato' },
      },
      forma: {
        title: 'Forma Estúdio',
        description:
          'Site demonstrativo para um estúdio de arquitetura residencial, inspirado em luz natural e navegação fluida.',
        challenge:
          'Criar uma presença digital serena para um estúdio fictício especializado em casas e apartamentos.',
        solution:
          'Uma página responsiva com navegação animada, rolagem suave e projetos em destaque. A marca e os projetos são fictícios; as imagens foram geradas por IA.',
        stats: { category: 'Segmento', format: 'Projeto' },
      },
    },
  },
  en: {
    nav: {
      logo: 'LYSS',
      projects: 'Projects',
      services: 'Services',
      method: 'Method',
      about: 'About',
      contact: 'Let’s talk',
    },
    hero: {
      eyebrow: 'LYSS · WEB DESIGN',
      titleLine1: 'I craft websites that present',
      titleLine2: 'your business with',
      titleAccent: 'clarity and presence.',
      subtitle:
        'Custom pages built for mobile and desktop, designed to showcase your work and make it easy for clients to reach out.',
      cta: 'Discuss my project',
      secondaryCta: 'Explore projects',
      previewLabel: 'Work preview',
      previewAction: 'Open project',
      previewDetails: 'Case details',
    },
    manifesto: {
      label: 'Approach',
      quote:
        'A thoughtfully crafted website to present your work, build trust, and connect you with new clients.',
    },
    pillars: {
      p1Label: '01 / CLARITY',
      p1Title: 'Clear timeline from day one',
      p1Desc: 'Every project follows a transparent schedule aligned with your scope.',
      p2Label: '02 / ACCESS',
      p2Title: 'Direct communication',
      p2Desc: 'Close guidance and clear updates at every stage via WhatsApp.',
      p3Label: '03 / CRAFT',
      p3Title: 'Refined and easy to use',
      p3Desc: 'Responsive pages crafted for fast loading, clean reading, and mobile usability.',
    },
    caseStudy: {
      headerLabel: 'Selected Works',
      headerTitle: 'Every website shaped around its brand.',
      headerSubtitle:
        'Live client pages and concept studies built from scratch. Select any project to visit the live page or inspect its details.',
      tag: 'Live project',
      demoTag: 'Concept study',
      liveCta: 'Open live site',
      detailsCta: 'View details',
      nextCardLabel: 'Your project next',
      nextCardTitle: 'Want to present your business with this level of care?',
      nextCardDesc:
        'Tell me about your work and goals, and we will shape the right structure for your website.',
      nextCardCta: 'Discuss my project',
    },
    services: {
      label: 'What I deliver',
      title: 'Your website, from first idea to launch.',
      description:
        'From structure and visual design to launch setup, so you have a professional page ready to welcome visitors.',
      includes: 'Included in every build',
      scopeNote:
        'Focused landing pages or multi-section websites are tailored to fit your business goals.',
      domainNote: 'Includes initial domain and hosting setup so your site goes live smoothly.',
      cta: 'Discuss my project',
    },
    method: {
      eyebrow: 'Step by step',
      title: 'How it works',
      subtitle: 'A straightforward, collaborative process from briefing to launch.',
      s1Label: '01 / Discovery',
      s1Desc: 'We talk about your business, audience, and main website goals.',
      s2Label: '02 / Design & Build',
      s2Desc: 'I design and build a custom page aligned with your brand identity.',
      s3Label: '03 / Refinement',
      s3Desc: 'You review the preview on mobile and desktop and we refine the agreed details.',
      s4Label: '04 / Launch',
      s4Desc: 'Your website goes live with domain configured and ready for visitors.',
    },
    about: {
      label: 'GLAD YOU ARE HERE',
      titlePrefix: 'Behind',
      titleBrand: 'LYSS.',
      description:
        'A studio space focused on crafting websites with visual care, clean code, and attention to what makes your business unique.',
      cta: 'Chat on WhatsApp',
    },
    projectDetails: {
      closeBtn: 'Close',
      challengeLabel: 'The Challenge',
      solutionLabel: 'The Solution',
      stackLabel: 'Technologies',
      liveBtn: 'Open live site',
      talkBtn: 'Start a similar project',
    },
    footer: {
      eyebrow: 'Next step',
      title: 'Ready to bring your website to life?',
      subtitle: 'Reach out on WhatsApp to share what you do and what you need.',
      cta: 'Discuss my project',
      copyright: '© 2026 LYSS · WEB DESIGN. ALL RIGHTS RESERVED.',
    },
    projects: {
      patio: {
        title: 'Pátio Architecture',
        description:
          'Concept website for an architecture studio featuring editorial typography, spacious photography, and subtle motion.',
        challenge:
          'Create a digital presence for a fictional architecture studio with an expressive visual identity.',
        solution:
          'A responsive editorial page with browsable projects and subtle animations. The studio and projects are fictional; the images are illustrative.',
        stats: { category: 'Industry', format: 'Project' },
      },
      fdm: {
        title: 'Fábrica de Monstros CT',
        description:
          'Landing page focused on direct inquiries and memberships for a training center.',
        challenge:
          'Create a digital presence aligned with the energy of the physical space, making facilities and enrollment easy to explore.',
        solution:
          'Dark interface with high-contrast orange accents guiding mobile visitors to action.',
        stats: { category: 'Industry', format: 'Format' },
      },
      dashflow: {
        title: 'Dashflow Landing Page',
        description: 'Landing page introducing an AI analytics SaaS platform with clarity.',
        challenge:
          'Present an analytical B2B platform in a clear, modern way from the very first screen.',
        solution:
          'High-contrast dark interface built with React and Vite for fast loading and scannable sections.',
        stats: { category: 'Industry', format: 'Format' },
      },
      forma: {
        title: 'Forma Studio',
        description:
          'Concept website for a residential architecture studio inspired by natural light and smooth navigation.',
        challenge:
          'Create a calm digital presence for a fictional studio specializing in houses and apartments.',
        solution:
          'A responsive page with animated navigation, smooth scrolling, and featured projects. Fictional brand and AI-generated imagery.',
        stats: { category: 'Industry', format: 'Project' },
      },
    },
  },
  es: {
    nav: {
      logo: 'LYSS',
      projects: 'Proyectos',
      services: 'Servicios',
      method: 'Método',
      about: 'Sobre',
      contact: 'Hablemos',
    },
    hero: {
      eyebrow: 'LYSS · CREACIÓN DE SITIOS',
      titleLine1: 'Creo sitios que presentan',
      titleLine2: 'tu negocio con',
      titleAccent: 'claridad y presencia.',
      subtitle:
        'Páginas a medida para móvil y ordenador, pensadas para mostrar tu trabajo y acercarte a nuevos clientes.',
      cta: 'Hablar sobre mi proyecto',
      secondaryCta: 'Ver proyectos',
      previewLabel: 'Vista previa',
      previewAction: 'Abrir proyecto',
      previewDetails: 'Ver ficha',
    },
    manifesto: {
      label: 'Enfoque',
      quote:
        'Un sitio pensado con cuidado para presentar tu trabajo, transmitir confianza y acercarte a nuevos clientes.',
    },
    pillars: {
      p1Label: '01 / CLARIDAD',
      p1Title: 'Plazo acordado desde el inicio',
      p1Desc: 'Cada entrega cuenta con un cronograma claro alineado al alcance del proyecto.',
      p2Label: '02 / CERCANÍA',
      p2Title: 'Conversación directa',
      p2Desc: 'Atención cercana para resolver dudas y acompañar cada etapa por WhatsApp.',
      p3Label: '03 / DETALLE TÉCNICO',
      p3Title: 'Atractivo y fácil de usar',
      p3Desc: 'Páginas adaptadas a móvil y escritorio con foco en lectura y velocidad.',
    },
    caseStudy: {
      headerLabel: 'Trabajos Seleccionados',
      headerTitle: 'Cada proyecto con la identidad del negocio.',
      headerSubtitle:
        'Sitios publicados y proyectos demostrativos creados desde cero. Toca o haz clic para visitar el sitio o ver sus detalles.',
      tag: 'Proyecto publicado',
      demoTag: 'Proyecto demostrativo',
      liveCta: 'Abrir sitio en vivo',
      detailsCta: 'Ver detalles',
      nextCardLabel: 'Tu próximo sitio',
      nextCardTitle: '¿Quieres presentar tu negocio con este cuidado?',
      nextCardDesc:
        'Cuéntame sobre tu actividad y definimos juntos la estructura ideal para tu sitio.',
      nextCardCta: 'Hablar sobre mi proyecto',
    },
    services: {
      label: 'Qué entrego',
      title: 'Tu sitio, del primer paso a la publicación.',
      description:
        'Me encargo de la estructura, el diseño y la publicación para que tengas una página profesional lista para recibir visitas.',
      includes: 'Incluido en cada proyecto',
      scopeNote:
        'Landing pages objetivas o sitios con más secciones se adaptan a las necesidades de tu negocio.',
      domainNote:
        'Incluye configuración inicial de dominio y alojamiento para dejar todo en línea.',
      cta: 'Hablar sobre mi proyecto',
    },
    method: {
      eyebrow: 'Paso a paso',
      title: 'Cómo funciona',
      subtitle: 'Un proceso directo y acompañado de cerca en cada etapa.',
      s1Label: '01 / Diagnóstico',
      s1Desc: 'Conversamos sobre tu negocio, tu público y el objetivo del sitio.',
      s2Label: '02 / Creación',
      s2Desc: 'Diseño y desarrollo una página con la identidad de tu trabajo.',
      s3Label: '03 / Ajustes',
      s3Desc: 'Revisas la vista previa en móvil y escritorio y aplicamos los ajustes acordados.',
      s4Label: '04 / Publicación',
      s4Desc: 'Tu sitio sale al aire configurado y listo para recibir visitas.',
    },
    about: {
      label: 'QUÉ BUENO TENERTE AQUÍ',
      titlePrefix: 'Detrás de',
      titleBrand: 'LYSS.',
      description:
        'Un espacio dedicado a crear sitios con cuidado visual, código ligero y atención a lo que hace único a tu negocio.',
      cta: 'Hablar por WhatsApp',
    },
    projectDetails: {
      closeBtn: 'Cerrar',
      challengeLabel: 'El Desafío',
      solutionLabel: 'La Solución',
      stackLabel: 'Tecnologías',
      liveBtn: 'Abrir sitio en vivo',
      talkBtn: 'Quiero un sitio con este cuidado',
    },
    footer: {
      eyebrow: 'Siguiente paso',
      title: '¿Llevamos tu sitio del papel a la web?',
      subtitle: 'Escríbeme por WhatsApp para contarme sobre tu negocio y tu proyecto.',
      cta: 'Hablar sobre mi proyecto',
      copyright: '© 2026 LYSS · CREACIÓN DE SITIOS. TODOS LOS DERECHOS RESERVADOS.',
    },
    projects: {
      patio: {
        title: 'Pátio Arquitectura',
        description:
          'Sitio demostrativo para un estudio de arquitectura con dirección editorial y transiciones suaves.',
        challenge:
          'Crear una presencia digital para un estudio ficticio con una identidad visual expresiva.',
        solution:
          'Una página adaptable de estilo editorial con proyectos navegables y animaciones sutiles. Marca e imágenes ilustrativas.',
        stats: { category: 'Sector', format: 'Proyecto' },
      },
      fdm: {
        title: 'Fábrica de Monstros CT',
        description:
          'Landing page enfocada en contacto e inscripciones para un centro de entrenamiento.',
        challenge:
          'Reflejar la identidad intensa del espacio físico facilitando el contacto desde el móvil.',
        solution: 'Interfaz oscura con acentos en naranja pensada para navegación móvil.',
        stats: { category: 'Sector', format: 'Formato' },
      },
      dashflow: {
        title: 'Dashflow Landing Page',
        description: 'Landing page para presentar una plataforma SaaS de análisis con IA.',
        challenge:
          'Presentar un software analítico B2B con claridad desde el primer vistazo.',
        solution:
          'Interfaz oscura de alto contraste construida con React y Vite para lectura rápida.',
        stats: { category: 'Sector', format: 'Formato' },
      },
      forma: {
        title: 'Forma Estudio',
        description:
          'Sitio demostrativo para un estudio de arquitectura residencial inspirado en la luz natural.',
        challenge:
          'Crear una presencia digital serena para un estudio ficticio de casas y apartamentos.',
        solution:
          'Página adaptable con navegación animada y proyectos destacados. Marca ficticia e imágenes generadas con IA.',
        stats: { category: 'Sector', format: 'Proyecto' },
      },
    },
  },
};
