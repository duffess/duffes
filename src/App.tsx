import { useState, lazy, Suspense } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Process } from './components/Process';
import { CaseStudy } from './components/CaseStudy';
import { Pricing } from './components/Pricing';
import { Footer } from './components/LayoutBlocks';

const CommercialProposal = lazy(() =>
  import('./components/CommercialProposal').then((m) => ({ default: m.CommercialProposal }))
);

function App() {
  const [isProposal] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('proposta') === 'true' || params.get('proposal') === 'true';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isProposal) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0e0e10]" />}>
        <CommercialProposal />
      </Suspense>
    );
  }

  return (
    <>
      <div inert={isModalOpen || undefined}>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <Navigation />
        <main id="conteudo" tabIndex={-1} className="pt-20 md:pt-24 focus:outline-none">
          <Hero />
          <About />
          <Process />
          <CaseStudy onModalStateChange={setIsModalOpen} />
          <Pricing />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
