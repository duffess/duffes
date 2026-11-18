import { useCallback, useRef, useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { CaseStudy } from './components/CaseStudy';
import { Pricing as Services } from './components/Pricing';
import { Process } from './components/Process';
import { About } from './components/About';
import { Footer } from './components/LayoutBlocks';
import { ProjectModal } from './components/ProjectModal';
import { GoldenThread } from './components/GoldenThread';
import type { ProjectItem } from './data/mockData';

function App() {
  const stageRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProjectModal = useCallback((project: ProjectItem, triggerEl: HTMLElement | null) => {
    lastTriggerRef.current = triggerEl;
    setModalProject(project);
    setIsModalOpen(true);
  }, []);

  const closeProjectModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalExited = useCallback(() => {
    setModalProject(null);
  }, []);

  return (
    <>
      <div inert={isModalOpen || undefined}>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>

        <Navigation />

        <div id="fio-stage" ref={stageRef} className="relative">
          <GoldenThread containerRef={stageRef} />

          <main id="conteudo" tabIndex={-1} className="pt-20 md:pt-24 focus:outline-none">
            <Hero onOpenProject={openProjectModal} />
            <CaseStudy onOpenProject={openProjectModal} />
            <Services />
            <Process />
            <About />
          </main>

          <Footer />
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeProjectModal}
        onExited={handleModalExited}
        project={modalProject}
        returnFocusRef={lastTriggerRef}
      />
    </>
  );
}

export default App;
