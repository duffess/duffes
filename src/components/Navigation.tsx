import { WHATSAPP_URL } from '../data/mockData';

export function Navigation() {
  return (
    <header className="site-header fixed top-0 left-0 w-full z-50 px-6 sm:px-10 md:px-16 lg:px-20 py-4">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-4">
        <a href="#inicio" className="brand-lockup" aria-label="LYSS — voltar ao início">
          <span>LYSS</span>
          <small>CRIAÇÃO DE SITES</small>
        </a>

        <nav aria-label="Seções da página" className="hidden md:flex items-center gap-8">
          <a href="#sobre" className="header-nav-link">
            Sobre
          </a>
          <a href="#metodo" className="header-nav-link">
            Método
          </a>
          <a href="#projetos" className="header-nav-link">
            Projetos
          </a>
          <a href="#valores" className="header-nav-link">
            Valores
          </a>
        </nav>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="header-contact"
        >
          Vamos conversar <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
