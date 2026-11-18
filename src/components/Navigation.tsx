import { useEffect, useState } from 'react';
import { WHATSAPP_URL } from '../data/mockData';
import { useLanguage } from '../contexts/useLanguage';

const NAV_ITEMS = [
  { id: 'projetos', key: 'projects' },
  { id: 'servicos', key: 'services' },
  { id: 'metodo', key: 'method' },
  { id: 'sobre', key: 'about' },
] as const;

export function Navigation() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const elements = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-22% 0px -55% 0px',
        threshold: [0.1, 0.35, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`site-header fixed top-0 left-0 w-full z-50 px-5 sm:px-10 md:px-14 lg:px-20 py-3.5 ${
        isScrolled ? 'is-scrolled' : ''
      }`}
    >
      <div className="max-w-[1220px] mx-auto flex justify-between items-center gap-3">
        <a href="#inicio" className="brand-lockup" aria-label="LYSS — voltar ao início">
          <span>{t('nav', 'logo')}</span>
          <small>CRIAÇÃO DE SITES</small>
        </a>

        <nav aria-label="Seções da página" className="hidden md:flex items-center gap-7 lg:gap-9">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`header-nav-link ${activeSection === item.id ? 'is-active' : ''}`}
            >
              {t('nav', item.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <a
            href="#projetos"
            className="md:hidden font-label text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-stone-300 hover:text-stone-100 px-2 py-1.5"
          >
            {t('nav', 'projects')}
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="header-contact"
          >
            <span>{t('nav', 'contact')}</span>
            <span className="header-contact-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
