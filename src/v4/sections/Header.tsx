import { useEffect, useState } from 'react';
import { Signature } from '../brand/Signature';
import { sound } from '../brand/sound';
import { useLang, useSetLang, useT } from '../brand/lang';

function SoundToggle() {
  const t = useT();
  const [on, setOn] = useState(sound.on);
  useEffect(() => sound.subscribe(setOn), []);
  return (
    <button
      type="button"
      className={`top__btn top__sound${on ? ' is-on' : ''}`}
      aria-pressed={on}
      onClick={() => sound.set(!on)}
    >
      <span className="top__wave" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {t('Som', 'Sound')}
    </button>
  );
}

function LangToggle() {
  const lang = useLang();
  const setLang = useSetLang();
  return (
    <div className="top__lang" role="group" aria-label={lang === 'en' ? 'Language' : 'Idioma'}>
      <button type="button" lang="pt-BR" aria-pressed={lang === 'pt'} onClick={() => setLang('pt')}>
        PT
      </button>
      <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  );
}

export function Header() {
  const t = useT();
  return (
    <header className="top">
      <a className="top__logo" href="#topo" aria-label={t('LYSS, voltar ao início', 'LYSS, back to top')}>
        <Signature className="top__sig" />
      </a>
      <div className="top__right">
        <p className="top__who">Isabela &amp; Guilherme</p>
        <LangToggle />
        <SoundToggle />
      </div>
    </header>
  );
}
