// Página de links da LYSS (lysss.vercel.app/links), para a bio do Instagram.
import { useEffect, useRef } from 'react';
import { Eye } from '../v4/brand/Eye';
import { Signature } from '../v4/brand/Signature';
import { useEyes } from '../v4/brand/useEyes';
import { prefersReduced } from '../v4/brand/motion';
import { WHATSAPP_DISPLAY, waLink } from '../v4/brand/data';
import { plans, brl } from '../v4/brand/offer';
import { projects } from '../v4/brand/projects';
import './links.css';

const INSTAGRAM = 'lyss.sites';
const FROM = Math.min(...plans.map((p) => p.price));

const links = [
  { label: 'Portfólio', note: 'Os sites e como trabalhamos', href: '/' },
  { label: 'Instagram', note: `@${INSTAGRAM}`, href: `https://www.instagram.com/${INSTAGRAM}/` },
];

export default function Links() {
  const root = useRef<HTMLElement>(null);
  useEyes(root, true);

  useEffect(() => {
    document.title = 'LYSS · Links';
  }, []);

  const recent = projects.slice(0, 2);
  // Com "reduzir movimento" ligado, a bolinha fica parada.
  const still = prefersReduced();

  return (
    <main className="lk" ref={root}>
      <header className="lk__top">
        <a className="lk__avatar" href="/" aria-label="LYSS, ir para o portfólio">
          {still ? (
            <img src="/lyss-bolinha.webp" alt="" width={240} height={240} />
          ) : (
            <video autoPlay loop muted playsInline poster="/lyss-bolinha.webp" width={240} height={240} aria-hidden="true">
              <source src="/lyss-bolinha.webm" type="video/webm" />
              <source src="/lyss-bolinha.mp4" type="video/mp4" />
            </video>
          )}
        </a>
        <p className="lk__handle">@{INSTAGRAM}</p>
      </header>

      <h1 className="lk__title" aria-label="Todo site sai assinado.">
        <span aria-hidden="true">
          T<Eye />d<Eye /> site
        </span>
        <span aria-hidden="true">sai assinado.</span>
      </h1>
      <p className="lk__lede">
        Sites para pequenos negócios. Você vê a prévia antes de pagar, a partir de {brl(FROM)} em até 6x sem juros.
      </p>

      <a className="lk__cta" href={waLink()} target="_blank" rel="noopener noreferrer">
        <span className="lk__cta-label">Pedir meu site</span>
        <span className="lk__cta-note">WhatsApp {WHATSAPP_DISPLAY}</span>
      </a>

      <ul className="lk__list">
        {links.map((l) => (
          <li key={l.label}>
            <a className="lk__row" href={l.href} {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span className="lk__row-label">{l.label}</span>
              <span className="lk__row-note">{l.note}</span>
            </a>
          </li>
        ))}
      </ul>

      <section className="lk__recent" aria-labelledby="lk-recent">
        <h2 id="lk-recent" className="lk__h2">
          Saiu do forno
        </h2>
        <div className="lk__cards">
          {recent.map((p) => (
            <a key={p.id} className="lk__card" href={p.url} target="_blank" rel="noopener noreferrer">
              <img src={p.imageSmall} alt={`Primeira tela do site ${p.title}`} width={669} height={376} loading="lazy" />
              <span className="lk__card-title">{p.title}</span>
              <span className="lk__card-note">{p.urlLabel}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="lk__foot">
        <Signature className="lk__sig" label="LYSS" />
      </footer>
    </main>
  );
}
