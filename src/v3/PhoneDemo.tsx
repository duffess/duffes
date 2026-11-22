import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { niches, waLink } from './data';
import { useReducedMotion } from '../hooks/useReducedMotion';

function NicheIcon({ id }: { id: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (id) {
    case 'barbearia':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
          <circle cx="13" cy="36" r="6" />
          <circle cx="35" cy="36" r="6" />
          <path d="M17 31 34 6M31 31 14 6" />
        </svg>
      );
    case 'academia':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
          <path d="M14 24h20" />
          <rect x="7" y="15" width="7" height="18" rx="2" />
          <rect x="34" y="15" width="7" height="18" rx="2" />
          <path d="M4 20v8M44 20v8" />
        </svg>
      );
    case 'clinica':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
          <path d="M24 12c-4-5-15-5-15 6 0 8 3 12 4 20 1 5 5 5 6 0l2-8c1-3 5-3 6 0l2 8c1 5 5 5 6 0 1-8 4-12 4-20 0-11-11-11-15-6Z" />
        </svg>
      );
    case 'restaurante':
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
          <path d="M6 26h36a18 18 0 0 1-36 0Z" />
          <path d="M18 18c0-3 3-3 3-6M26 18c0-3 3-3 3-6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" {...common}>
          <circle cx="24" cy="22" r="5" />
          <path d="M24 17c-2-6 2-11 0-11s2 5 0 11M29 22c6-2 11 2 11 0s-5 2-11 0M24 27c2 6-2 11 0 11s-2-5 0-11M19 22c-6 2-11-2-11 0s5-2 11 0" />
          <path d="M24 38v6" />
        </svg>
      );
  }
}

export function PhoneDemo() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [userTookOver, setUserTookOver] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const niche = niches[index];

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || userTookOver || !visible) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % niches.length);
      setChatOpen(false);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduced, userTookOver, visible]);

  const choose = (i: number) => {
    setUserTookOver(true);
    setIndex(i);
    setChatOpen(false);
  };

  const themeStyle = {
    '--m-bg': niche.theme.bg,
    '--m-fg': niche.theme.fg,
    '--m-accent': niche.theme.accent,
    '--m-soft': niche.theme.soft,
    '--m-on-accent': niche.theme.onAccent,
  } as CSSProperties;

  return (
    <div className="demo" ref={rootRef}>
      <div className="phone" role="group" aria-label={`Exemplo de site para ${niche.label.toLowerCase()}`}>
        <div className="phone__screen" style={themeStyle}>
          <div className="mock" key={niche.id} data-animate={!reduced || undefined}>
            <div className="mock__status" aria-hidden="true">
              <span>9:41</span>
              <span className="mock__status-icons">
                <i />
                <i />
                <i />
              </span>
            </div>
            <header className="mock__nav">
              <span className="mock__brand">{niche.name}</span>
              <span className="mock__menu" aria-hidden="true">
                <i />
                <i />
              </span>
            </header>

            <div className="mock__hero">
              <div className="mock__icon">
                <NicheIcon id={niche.id} />
              </div>
              <p className="mock__tagline">{niche.tagline}</p>
              <p className="mock__open">
                <span className="mock__dot" aria-hidden="true" />
                {niche.status}
              </p>
            </div>

            <ul className="mock__list">
              {niche.items.map((item) => (
                <li key={item.title}>
                  <span>{item.title}</span>
                  <span className="mock__detail">{item.detail}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="mock__wa"
              onClick={() => {
                setUserTookOver(true);
                setChatOpen(true);
              }}
            >
              <WaGlyph />
              Chamar no WhatsApp
            </button>
          </div>

          <div className={`chat ${chatOpen ? 'is-open' : ''}`} aria-hidden={!chatOpen}>
            <div className="chat__head">
              <button
                type="button"
                className="chat__back"
                onClick={() => setChatOpen(false)}
                tabIndex={chatOpen ? 0 : -1}
                aria-label="Voltar ao site"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </button>
              <span className="chat__avatar" aria-hidden="true">
                {niche.name.charAt(0)}
              </span>
              <span className="chat__who">
                <strong>{niche.name}</strong>
                <span>online</span>
              </span>
            </div>
            <div className="chat__body">
              <p className="chat__day">Hoje</p>
              <p className="chat__bubble">
                {niche.chat}
                <span className="chat__time">9:42</span>
              </p>
              <p className="chat__typing" aria-label="Digitando">
                <i />
                <i />
                <i />
              </p>
            </div>
            <p className="chat__note">Exemplo: o cliente toca no botão e cai direto na sua conversa.</p>
          </div>
        </div>
      </div>

      <div className="demo__controls">
        <p className="demo__prompt" id="demo-prompt">
          Veja como ficaria para
        </p>
        <div className="demo__chips" role="group" aria-labelledby="demo-prompt">
          {niches.map((n, i) => (
            <button
              key={n.id}
              type="button"
              className="chip"
              aria-pressed={i === index}
              onClick={() => choose(i)}
            >
              {n.label}
            </button>
          ))}
        </div>
        <a
          className="demo__ask"
          href={waLink(`Olá! Quero um site assim para ${niche.ownerPhrase}.`)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Quero um site assim para {niche.ownerPhrase}
        </a>
      </div>
    </div>
  );
}

export function WaGlyph() {
  return (
    <svg className="wa-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.7 11.5 11.5 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z"
      />
    </svg>
  );
}
