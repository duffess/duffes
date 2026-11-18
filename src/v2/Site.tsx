import { PhoneDemo, WaGlyph } from './PhoneDemo';
import { About } from './About';
import { Closing } from './Closing';
import { LitWords, ScrambleLines } from './TextFx';
import { Traveler } from './Traveler';

const HERO_LINES = ['Sites que fazem', 'o cliente chamar', 'no WhatsApp.'];
import {
  DEFAULT_WA_MESSAGE,
  PRICE_FROM,
  deliverables,
  projects,
  steps,
  waLink,
} from './data';

const mainWa = waLink(DEFAULT_WA_MESSAGE);

function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#topo" className="nav__logo" aria-label="LYSS, voltar ao início">
          LYSS
        </a>
        <nav className="nav__links" aria-label="Seções">
          <a href="#trabalhos">Trabalhos</a>
          <a href="#incluso">O que vem</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#quem-faz">Quem faz</a>
        </nav>
        <a className="btn btn--small" href={mainWa} target="_blank" rel="noopener noreferrer">
          <WaGlyph />
          WhatsApp
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="topo" aria-labelledby="hero-title">
      <div className="hero__copy">
        <h1 id="hero-title" className="hero__title">
          <ScrambleLines lines={HERO_LINES} />
        </h1>
        <p className="hero__lead">
          Crio páginas sob medida para negócios do bairro: rápidas no celular, prontas para aparecer no Google e com um
          botão direto para a sua conversa.
        </p>
        <div className="hero__actions">
          <a className="btn" href={mainWa} target="_blank" rel="noopener noreferrer">
            <WaGlyph />
            Conversar sobre meu site
          </a>
          <a className="link" href="#trabalhos">
            Ver trabalhos
          </a>
        </div>
      </div>
      <PhoneDemo />
    </section>
  );
}

function Work() {
  return (
    <section className="section work" id="trabalhos" aria-labelledby="work-title">
      <div className="section__head">
        <h2 id="work-title" className="h2">
          <LitWords text="Trabalhos" />
        </h2>
        <p className="section__intro">
          Um site publicado para cliente e estudos que fiz para mostrar como cada ramo pode ter a sua cara.
        </p>
      </div>

      <ol className="work__list">
        {projects.map((p, i) => (
          <li key={p.id} className={`project ${i === 0 ? 'project--feature' : ''}`}>
            <a className="project__frame" href={p.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
              <span className="project__bar">{p.urlLabel}</span>
              <img
                src={p.image}
                srcSet={p.srcSet}
                sizes={i === 0 ? '(max-width: 900px) 92vw, 60vw' : '(max-width: 900px) 92vw, 44vw'}
                width={p.width}
                height={p.height}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </a>
            <div className="project__text">
              <span className={`tag tag--${p.kind}`}>{p.kind === 'cliente' ? 'Cliente' : 'Demonstração'}</span>
              <h3 className="h3">{p.title}</h3>
              {p.place && <p className="project__place">{p.place}</p>}
              <p>{p.description}</p>
              <a className="link" href={p.url} target="_blank" rel="noopener noreferrer">
                Abrir o site de {p.title}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Included() {
  return (
    <section className="section included" id="incluso" aria-labelledby="included-title">
      <div className="included__aside">
        <h2 id="included-title" className="h2">
          <LitWords text="O que vem no seu site" />
        </h2>
        <p className="section__intro">
          Uma página com até seis seções, ou um site maior quando o seu negócio pedir. Em todos eles:
        </p>
        {PRICE_FROM && (
          <p className="price">
            A partir de <strong>{PRICE_FROM}</strong>
          </p>
        )}
      </div>
      <ul className="included__list">
        {deliverables.map((d) => (
          <li key={d.title}>
            <h3 className="h4">{d.title}</h3>
            <p>{d.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Steps() {
  return (
    <section className="section steps" id="como-funciona" aria-labelledby="steps-title">
      <div className="section__head">
        <h2 id="steps-title" className="h2">
          <LitWords text="Como funciona" />
        </h2>
        <p className="section__intro">Quatro etapas, tudo combinado pelo WhatsApp.</p>
      </div>
      <ol className="steps__list">
        {steps.map((s, i) => (
          <li key={s.title} className="step">
            <span className="step__num" aria-hidden="true">
              {i + 1}
            </span>
            <h3 className="h4">{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Site() {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Nav />
      <Traveler />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Work />
        <Included />
        <Steps />
        <About />
        <Closing />
      </main>
      <footer className="footer">
        <span className="footer__logo">LYSS</span>
        <span>Sites para negócios locais. © 2026</span>
      </footer>
    </>
  );
}
