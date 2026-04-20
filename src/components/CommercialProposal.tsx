

interface PackageProps {
  title: string;
  price: string;
  description: string;
  recommended?: boolean;
  features: string[];
  duration: string;
}

const PackageCard = ({ title, price, description, recommended, features, duration }: PackageProps) => (
  <div className={`flex flex-col border border-stone-800 p-8 ${recommended ? 'bg-stone-900/50' : 'bg-transparent'}`}>
    <div className="flex justify-between items-start mb-4">
      <h3 className="font-label text-xs tracking-widest uppercase font-bold text-stone-400">{title}</h3>
      {recommended && (
        <span className="bg-stone-100 text-stone-900 text-[10px] font-bold px-2 py-0.5 tracking-tighter">MAIS ESCOLHIDO</span>
      )}
    </div>
    <div className="mb-2">
      <span className="text-4xl font-headline text-stone-100 italic">{price}</span>
      <span className="text-stone-400 text-xs ml-2">investimento único</span>
    </div>
    <p className="text-stone-400 text-xs font-body mb-8 italic">{description}</p>
    <div className="flex-grow">
      <ul className="space-y-4 mb-12">
        {features.map((feature, idx) => (
          <li key={idx} className="flex gap-3 items-start text-sm text-stone-300">
            {feature}
          </li>
        ))}
      </ul>
    </div>
    <div className="pt-8 border-t border-stone-800">
      <p className="text-[10px] font-label tracking-widest uppercase text-stone-400 mb-2">SUPORTE PÓS-ENTREGA</p>
      <p className="text-stone-100 font-body text-sm">{duration}</p>
    </div>
  </div>
);

export const CommercialProposal = () => {
  const packages = [
    {
      title: "Pacote Essencial",
      price: "R$ 597",
      description: "Pra quem não tem site nenhum e precisa aparecer hoje",
      features: [
        "✅ Site completo de 1 página no ar em até 7 dias",
        "✅ Botão de WhatsApp que manda o cliente direto pra você com 1 toque",
        "✅ Apresentação clara dos seus serviços pra ninguém ter dúvida",
        "✅ Seção \"Quem somos\" pra passar confiança e credibilidade",
        "✅ Funciona perfeitamente no celular (90% dos acessos)",
        "✅ SEO básico configurado — Google consegue te encontrar",
        "✅ Site no ar com hospedagem gratuita e estável",
        "✅ 15 dias de suporte — você pede ajuste, eu resolvo",
        "❌ Domínio não incluso"
      ],
      duration: "15 dias de suporte ilimitado"
    },
    {
      title: "Pacote Profissional",
      price: "R$ 997",
      description: "Pra quem quer um site que realmente converte visita em cliente",
      recommended: true,
      features: [
        "✅ Tudo do Essencial",
        "✅ Galeria de fotos do seu negócio pra gerar confiança",
        "✅ Mapa integrado pra o cliente te encontrar sem esforço",
        "✅ Formulário de contato pra capturar leads qualificados",
        "✅ Domínio .com.br incluso por 1 ano — sem custo extra",
        "✅ 30 dias de suporte — ajuste de texto, foto ou informação",
        "✅ Endereço profissional para Instagram e Google"
      ],
      duration: "30 dias de suporte ilimitado"
    },
    {
      title: "Pacote Completo",
      price: "R$ 1.497",
      description: "Pra quem quer se destacar de todos os concorrentes da região",
      features: [
        "✅ Tudo do Profissional",
        "✅ Site com mais seções e conteúdo — mais autoridade",
        "✅ SEO avançado — palavras-chave e velocidade otimizados",
        "✅ Seção de depoimentos — prova social que converte",
        "✅ Botão de WhatsApp animado e flutuante — visível sempre",
        "✅ Google Analytics instalado — veja suas métricas mensais",
        "✅ 60 dias de suporte completo — dois meses sem preocupação"
      ],
      duration: "60 dias de suporte ilimitado"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e10] text-stone-100 p-8 md:p-24 print:bg-white print:text-black">
      {/* Header / Logo */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-24 print:mb-12">
        <div className="flex items-center gap-4 mb-8 md:mb-0">
          <div className="w-1.5 h-12 bg-stone-100 print:bg-black"></div>
          <div>
            <h1 className="text-3xl font-bold tracking-[0.2em] font-label">DUFFES</h1>
            <p className="text-[10px] tracking-[0.3em] font-label text-stone-400 uppercase mt-1">Surgical Digital Assets</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-label tracking-widest text-stone-400 uppercase">Proposta Comercial</p>
          <p className="text-sm font-body mt-1">Válida por 15 dias</p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-2xl mb-24 print:mb-12">
        <h2 className="text-4xl md:text-5xl font-headline mb-8 italic opacity-90">Invista no que escala.</h2>
        <p className="text-stone-400 font-body text-lg leading-relaxed print:text-stone-700">
          Não construímos apenas sites; arquitetamos sistemas de conversão. 
          Abaixo estão os pacotes moldados para diferentes estágios de operação.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-stone-800 print:border-stone-200">
        {packages.map((pkg, idx) => (
          <PackageCard key={idx} {...pkg} />
        ))}
      </div>

      {/* Custom Projects */}
      <div className="mt-24 p-12 border-l-2 border-stone-100 bg-stone-900/20 print:bg-stone-50 print:border-black">
        <h4 className="font-label text-xs tracking-widest uppercase font-bold text-stone-100 print:text-black mb-4">Projetos Customizados</h4>
        <p className="text-stone-400 text-sm max-w-xl leading-relaxed print:text-stone-700">
          Para ecossistemas mais complexos (SaaS, Dashboards, Fluxos de Automação), 
          realizamos uma consulta técnica prévia. Orçamentos sob consulta.
        </p>
      </div>

      {/* Footer / Contact */}
      <div className="mt-32 pt-8 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-8 print:mt-12">
        <p className="text-[10px] font-label tracking-widest uppercase text-stone-600">© 2026 DUFFES. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <span className="text-[10px] font-label tracking-widest uppercase text-stone-400">guiduffes@gmail.com</span>
        </div>
      </div>

      {/* Print Instructions - Only visible in browser */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-stone-100 text-stone-900 px-6 py-3 font-label text-[10px] tracking-widest uppercase font-bold hover:bg-stone-300 transition-colors shadow-2xl"
        >
          Salvar como PDF (Ctrl+P)
        </button>
      </div>
    </div>
  );
};
