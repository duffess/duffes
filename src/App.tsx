import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { useEffect, useState, lazy, Suspense } from 'react';

// Lazy load below-the-fold components
const Manifesto = lazy(() => import('./components/Manifesto').then(m => ({ default: m.Manifesto })));
const Pillars = lazy(() => import('./components/Pillars').then(m => ({ default: m.Pillars })));
const Process = lazy(() => import('./components/Process').then(m => ({ default: m.Process })));
const CaseStudy = lazy(() => import('./components/CaseStudy').then(m => ({ default: m.CaseStudy })));
const Footer = lazy(() => import('./components/LayoutBlocks').then(m => ({ default: m.Footer })));
const CommercialProposal = lazy(() => import('./components/CommercialProposal').then(m => ({ default: m.CommercialProposal })));

function App() {
  const [isProposal, setIsProposal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('proposta') === 'true' || params.get('proposal') === 'true') {
      setIsProposal(true);
    }
  }, []);

  if (isProposal) {
    return <CommercialProposal />;
  }

  return (
    <>
      <Navigation />
      <main className="pt-32 pb-20">
        <Hero />
        <Suspense fallback={<div className="h-20" />}>
          <Manifesto />
          <Pillars />
          <Process />
          <CaseStudy />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
