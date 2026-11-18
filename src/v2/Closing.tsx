import { useEffect, useRef } from 'react';
import { WaGlyph } from './PhoneDemo';
import { DEFAULT_WA_MESSAGE, WHATSAPP_DISPLAY, waLink } from './data';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Efeito adaptado do "Laboratório Creative Romão" (07 · celular vira botão vira tela).
// Uma camada do tamanho da tela recortada por clip-path: celular -> pílula -> tela cheia.

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function Closing() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current!;
    const layer = layerRef.current!;
    const screen = screenRef.current!;
    const pill = pillRef.current!;
    const fin = finalRef.current!;
    const title = titleRef.current!;
    const cta = ctaRef.current!;
    let pending = false;

    const frame = () => {
      pending = false;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = track.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      const p = clamp(-r.top / (r.height - vh));

      const navH = document.querySelector('.nav')?.getBoundingClientRect().height ?? 64;
      const titleH = title.offsetHeight;
      const chMax = vh - 2 * (navH + titleH + 28);
      const cw = Math.max(120, Math.min(240, vw * 0.56, chMax / 2.05));
      const ch = cw * 2.05;
      title.style.bottom = `${vh / 2 + ch / 2 + 20}px`;

      const phone = [cw, ch, 34];
      const lying = [ch * 0.62, cw * 0.62, 30];
      const pillShape = [Math.min(300, vw - 40), 72, 36];
      const full = [vw, vh, 0];
      const a1 = clamp(p / 0.25);
      const a2 = clamp((p - 0.25) / 0.15);
      const a3 = clamp((p - 0.55) / 0.35);
      let f: number[];
      if (p < 0.25) f = phone.map((v, i) => lerp(v, lying[i], ease(a1)));
      else if (p < 0.55) f = lying.map((v, i) => lerp(v, pillShape[i], ease(a2)));
      else f = pillShape.map((v, i) => lerp(v, full[i], ease(a3)));
      const [w, h, rr] = f;
      const t = (vh - h) / 2;
      const l = (vw - w) / 2;
      layer.style.clipPath = `inset(${t}px ${l}px ${t}px ${l}px round ${rr}px)`;

      // A tela do celular encolhe junto e some antes de o celular deitar,
      // para nada vazar para fora do recorte.
      screen.style.width = `${cw}px`;
      screen.style.height = `${ch}px`;
      screen.style.setProperty('--k', String(cw / 280));
      screen.style.transform = `translate(-50%,-50%) scale(${lerp(1, 0.8, ease(clamp(a1 / 0.6)))})`;
      screen.style.opacity = String(1 - clamp(a1 / 0.45));
      pill.style.opacity = String(clamp((p - 0.33) / 0.08) * (1 - clamp((p - 0.6) / 0.06)));
      title.style.opacity = String(1 - clamp((p - 0.5) / 0.1));

      const fo = clamp((p - 0.78) / 0.12);
      fin.style.opacity = String(fo);
      fin.classList.toggle('is-full', p > 0.92);
      fin.style.pointerEvents = fo > 0.9 ? 'auto' : 'none';
      cta.tabIndex = fo > 0.9 ? 0 : -1;
    };

    const onScroll = () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(frame);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', frame);
    frame();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', frame);
    };
  }, [reduced]);

  return (
    <section
      ref={trackRef}
      className={`closing ${reduced ? 'closing--static' : ''}`}
      aria-labelledby="closing-title"
    >
      <div className="closing__stage">
        <p ref={titleRef} className="closing__lead-in" aria-hidden="true">
          O próximo pode ser o seu.
        </p>
        <div ref={layerRef} className="closing__layer">
          <div ref={screenRef} className="closing__screen" aria-hidden="true">
            <div className="mini">
              <div className="mini__status">
                <span>9:41</span>
                <span className="mini__bars">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="mini__nav">
                <span className="mini__brand">Seu negócio</span>
                <span className="mini__menu">
                  <i />
                  <i />
                </span>
              </div>
              <div className="mini__hero">
                <span className="mini__photo" />
                <p className="mini__tagline">O que você faz, do jeito que o seu cliente procura.</p>
                <p className="mini__open">
                  <span className="mini__dot" />
                  Aberto agora
                </p>
              </div>
              <ul className="mini__list">
                <li>
                  <span>Serviços</span>
                  <span>Ver todos</span>
                </li>
                <li>
                  <span>Onde fica</span>
                  <span>Mapa</span>
                </li>
                <li>
                  <span>Horários</span>
                  <span>Hoje até 19h</span>
                </li>
              </ul>
              <span className="mini__wa">
                <WaGlyph />
                Chamar no WhatsApp
              </span>
            </div>
          </div>
          <div ref={pillRef} className="closing__pill" aria-hidden="true">
            <WaGlyph />
            Quero o meu site
          </div>
          <div ref={finalRef} className={`closing__final ${reduced ? 'is-full' : ''}`}>
            <div className="closing__inner">
              <h2 id="closing-title" className="closing__title">
                Me conta o que
                <span className="closing__fill"> você faz.</span>
              </h2>
              <p className="closing__text">
                Mande uma mensagem dizendo o seu ramo e o que você quer mostrar. Eu respondo com uma ideia de como o
                seu site pode ficar.
              </p>
              <a
                ref={ctaRef}
                className="btn btn--light btn--halo"
                href={waLink(DEFAULT_WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={reduced ? 0 : -1}
              >
                <WaGlyph />
                Chamar no WhatsApp
              </a>
              <p className="closing__number">{WHATSAPP_DISPLAY}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
