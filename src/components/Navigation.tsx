import { useLanguage } from '../contexts/LanguageContext';

export function Navigation() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageSwap = () => {
    if (language === 'pt') setLanguage('en');
    else if (language === 'en') setLanguage('es');
    else setLanguage('pt');
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#0c0e0d] flex justify-between items-center px-8 md:px-12 py-8">
        <div className="font-headline text-2xl font-light tracking-widest text-stone-100">
          {t('nav', 'logo')}
        </div>
        
        <button 
          onClick={handleLanguageSwap}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-100 transition-colors duration-300 font-label text-xs tracking-widest uppercase cursor-pointer"
          aria-label={`Trocar idioma (atual: ${language})`}
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">language</span>
          {language}
        </button>
      </header>

    </>
  );
}
