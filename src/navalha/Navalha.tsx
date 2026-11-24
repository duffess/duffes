import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import '../navalha.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * Navalha: site de demonstração para barbearias (marca fictícia).
 * Efeitos inspirados no laboratório da LYSS e em componentes de React Bits / Magic UI,
 * reescritos aqui com GSAP: texto que entra letra a letra, faixa com velocidade da rolagem,
 * contador de números, áudio de WhatsApp, cartões que empilham e botão que vira tela cheia.
 */

const LYSS_WA =
  'https://wa.me/5521992217782?text=' +
  encodeURIComponent('Olá! Vi o site da Navalha e quero um assim para minha barbearia.');

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

const DAYS: [string, string][] = [
  ['Domingo', 'Fechado'],
  ['Segunda', '13h às 20h'],
  ['Terça', '9h às 20h'],
  ['Quarta', '9h às 20h'],
  ['Quinta', '9h às 20h'],
  ['Sexta', '9h às 21h'],
  ['Sábado', '8h às 18h'],
];

const SERVICES = [
  { name: 'Corte', info: 'Máquina e tesoura, lavagem inclusa · 40 min', price: 'R$ 45', icon: 0 },
  { name: 'Barba', info: 'Toalha quente e navalha · 30 min', price: 'R$ 35', icon: 1 },
  { name: 'Corte + barba', info: 'O combo da casa · 1 h', price: 'R$ 70', icon: 2 },
  { name: 'Pigmentação', info: 'Barba ou cabelo · 30 min', price: 'R$ 40', icon: 3 },
  { name: 'Infantil', info: 'Até 10 anos, com paciência · 30 min', price: 'R$ 35', icon: 0 },
];

const RITUAL = [
  { t: 'Toalha quente', p: 'Abre os poros e acalma a pele antes de qualquer lâmina chegar perto.', d: 'M14 22h36v28H14zM14 30h36M14 38h36M22 16c0-4 4-4 4-8M32 16c0-4 4-4 4-8M42 16c0-4 4-4 4-8' },
  { t: 'Navalha', p: 'Lâmina nova para cada cliente, desenho limpo e contorno no capricho.', d: 'M6 40c10-8 26-14 40-14v8H8zM46 26l12-4v10l-12 2' },
  { t: 'Acabamento', p: 'Pente, pomada e espelho na mão. Só sai quando você aprovar.', d: 'M10 20h44v8H10zM14 28v18M20 28v18M26 28v18M32 28v18M38 28v18M44 28v18M50 28v18' },
  { t: 'Café', p: 'Coado na hora. Pode chegar mais cedo só para ele, ninguém vai reparar.', d: 'M12 26h34v12a12 12 0 0 1-12 12h-10a12 12 0 0 1-12-12zM46 30h4a6 6 0 0 1 0 12h-5M22 18c0-3 3-3 3-6M32 18c0-3 3-3 3-6' },
];

const CREW = [
  { n: 'Rafa', p: 'Degradê que parece régua. Atende desde 2014.', tags: ['Degradê', 'Navalhado'] },
  { n: 'Dudu', p: 'O cara da barba. Desenha contorno até em barba rala.', tags: ['Barba', 'Pigmentação'] },
  { n: 'Léo', p: 'Tesoura clássica e paciência com criança.', tags: ['Social', 'Infantil'] },
];

const ICONS = [
  'M22 41 50 6M42 41 14 6',
  'M6 40c10-8 26-14 40-14v8H8zM46 26l12-4v10l-12 2',
  'M32 14v36M14 32h36',
  'M20 54 44 10M38 10h12v10',
];

function Scissors({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
      <circle cx="16" cy="48" r="9" />
      <circle cx="48" cy="48" r="9" />
      <path d="M22 41 50 6M42 41 14 6" />
    </svg>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.6 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.6-.1 1.3Z" />
    </svg>
  );
}

const HEIGHTS = Array.from({ length: 34 }, (_, i) => 6 + Math.round(Math.abs(Math.sin(i * 1.7) * 18 + Math.sin(i * 0.6) * 6)));

/* Áudio de WhatsApp que "toca" (sem som: a onda acende no ritmo) */
function VoiceNote() {
  const [playing, setPlaying] = useState(false);
  const bars = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!playing || !bars.current) return;
    const list = Array.from(bars.current.children);
    let i = 0;
    const id = setInterval(() => {
      list[i]?.classList.add('nv-on');
      i++;
      if (i > list.length) {
        clearInterval(id);
        setPlaying(false);
        list.forEach((b) => b.classList.remove('nv-on'));
      }
    }, 90);
    return () => clearInterval(id);
  }, [playing]);
  return (
    <div className="nv-voice">
      <button type="button" onClick={() => setPlaying(true)} aria-label={playing ? 'Tocando' : 'Tocar áudio'}>
        <svg viewBox="0 0 16 16" fill="currentColor">{playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M4 2l10 6-10 6z" />}</svg>
      </button>
      <div className="nv-wave" ref={bars} aria-hidden="true">
        {HEIGHTS.map((h, i) => (
          <i key={i} style={{ height: h }} />
        ))}
      </div>
      <span style={{ fontSize: 12, color: '#667781' }}>0:07</span>
    </div>
  );
}

export function Navalha() {
  const root = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState(false);
  const today = new Date().getDay();
  const todayHours = DAYS[today][1];

  useEffect(() => {
    document.title = 'Navalha Barbearia | Demonstração LYSS';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setModal(false);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const intro = q('.nv-intro')[0] as HTMLElement | undefined;
      const endIntro = () => {
        intro?.remove();
        document.documentElement.style.overflow = '';
      };

      // Rolagem suave só no computador
      let lenis: Lenis | null = null;
      const tickLenis = (t: number) => lenis?.raf(t * 1000);
      if (!reduced() && fine()) {
        lenis = new Lenis({ lerp: 0.1 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tickLenis);
        gsap.ticker.lagSmoothing(0);
      }

      if (reduced()) {
        endIntro();
        return () => lenis?.destroy();
      }

      // Abertura: a navalha passa e a tela se abre em duas
      document.documentElement.style.overflow = 'hidden';
      lenis?.stop();
      gsap.set(q('.nv-l > span'), { yPercent: 105 });
      const tl = gsap.timeline({ onComplete: () => { endIntro(); lenis?.start(); } });
      tl.to(q('.nv-intro__razor'), { left: '100%', xPercent: 10, duration: 0.9, ease: 'power3.inOut' }, 0.3)
        .to(q('.nv-intro__blade'), { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, 0.3)
        .to(q('.nv-intro__top'), { yPercent: -100, xPercent: -3, duration: 1, ease: 'expo.inOut' }, 1.25)
        .to(q('.nv-intro__bot'), { yPercent: 100, xPercent: 3, duration: 1, ease: 'expo.inOut' }, 1.25)
        .to(q('.nv-intro__blade, .nv-intro__tag, .nv-skip'), { autoAlpha: 0, duration: 0.3 }, 1.25)
        .to(q('.nv-l > span'), { yPercent: 0, duration: 1.1, stagger: 0.05, ease: 'expo.out' }, 1.55)
        .fromTo(q('.nv-hero__cut'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 2.3)
        .to(q('.nv-hero__cut'), { scaleX: 0, transformOrigin: '100% 50%', duration: 0.5, ease: 'power2.inOut' }, 2.85)
        .from(q('.nv-hero__meta > *, .nv-hero__foot > *'), { autoAlpha: 0, y: 20, stagger: 0.06, duration: 0.8, ease: 'expo.out' }, 2);
      q('.nv-skip')[0]?.addEventListener('click', () => tl.progress(1));

      // Poste e faixa reagem à velocidade da rolagem (React Bits: Scroll Velocity)
      const pole = q('.nv-pole i')[0] as HTMLElement;
      const track = q('.nv-band__track')[0] as HTMLElement;
      let y = 0, vel = 0, bx = 0, last = scrollY;
      const tick = (_t: number, dt: number) => {
        const d = scrollY - last;
        last = scrollY;
        vel += (d - vel) * 0.15;
        y = (y + 0.6 + Math.abs(vel) * 0.8) % 79.2;
        pole.style.transform = `translateY(${y}px)`;
        const w = track.scrollWidth / 2;
        bx -= (1 + Math.abs(vel) * 0.9) * (dt / 16);
        if (bx <= -w) bx += w;
        track.style.transform = `translateX(${bx}px) skewX(${gsap.utils.clamp(-10, 10, -vel * 0.4)}deg)`;
      };
      gsap.ticker.add(tick);

      // Letras pulam quando o mouse passa
      if (fine()) q('.nv-l').forEach((l) => l.addEventListener('pointerenter', () => gsap.fromTo(l.firstChild, { yPercent: 0 }, { yPercent: -12, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' })));

      // Números que contam (Magic UI: Number Ticker)
      q('.nv-stat b').forEach((el) => {
        const end = Number((el as HTMLElement).dataset.to);
        const dec = Number((el as HTMLElement).dataset.dec || 0);
        const o = { v: 0 };
        gsap.to(o, {
          v: end, duration: 2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: () => { el.textContent = (el as HTMLElement).dataset.pre! + o.v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }); },
        });
      });

      // Tabela: bolha com o ícone seguindo o mouse; no celular a linha acende no meio da tela
      const fl = q('.nv-float')[0] as HTMLElement;
      if (fine()) {
        const fx = gsap.quickTo(fl, 'x', { duration: 0.5, ease: 'power3' });
        const fy = gsap.quickTo(fl, 'y', { duration: 0.5, ease: 'power3' });
        addEventListener('pointermove', (e) => { fx(e.clientX); fy(e.clientY); });
        q('.nv-row').forEach((r) => {
          r.addEventListener('pointerenter', () => {
            fl.querySelector('path')!.setAttribute('d', ICONS[Number((r as HTMLElement).dataset.i)]);
            gsap.to(fl, { scale: 1, rotate: gsap.utils.random(-15, 15), duration: 0.4, ease: 'back.out(2)' });
          });
          r.addEventListener('pointerleave', () => gsap.to(fl, { scale: 0, duration: 0.3 }));
        });
      } else {
        q('.nv-row').forEach((r) => ScrollTrigger.create({ trigger: r, start: 'top 55%', end: 'bottom 45%', toggleClass: 'nv-is-on' }));
      }

      // Ritual: rolagem lateral no computador
      const mm = gsap.matchMedia();
      mm.add('(min-width: 821px)', () => {
        const tr = q('.nv-ritual__track')[0] as HTMLElement;
        gsap.to(tr, { x: () => -(tr.scrollWidth - innerWidth), ease: 'none', scrollTrigger: { trigger: q('.nv-ritual')[0], start: 'top top', end: () => '+=' + (tr.scrollWidth - innerWidth), pin: true, scrub: 0.6, invalidateOnRefresh: true } });
      });

      // Conversa no WhatsApp: mensagens chegam uma a uma
      ScrollTrigger.create({
        trigger: q('.nv-phone')[0], start: 'top 75%', once: true,
        onEnter: () => q('.nv-msg').forEach((m, i) => setTimeout(() => m.classList.add('nv-in'), i * 700)),
      });

      // Cartões que empilham: o de trás encolhe e escurece
      q('.nv-stack .nv-card').forEach((c, i, all) => {
        if (i === all.length - 1) return;
        gsap.to(c, { scale: 0.92, ease: 'none', scrollTrigger: { trigger: all[i + 1], start: 'top bottom', end: 'top 30%', scrub: true } });
      });

      // Botão que vira tela cheia
      const btn = q('.nv-grow__btn')[0] as HTMLElement;
      gsap.timeline({ scrollTrigger: { trigger: q('.nv-grow')[0], start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
        .to(btn, { width: '100vw', height: '100svh', borderRadius: 0, ease: 'power2.inOut', duration: 1 })
        .to(q('.nv-grow__btn > span'), { autoAlpha: 0, duration: 0.2 }, 0.1)
        .to(q('.nv-grow__in'), { opacity: 1, duration: 0.3 }, 0.75);

      // Títulos e textos gigantes
      q('.nv-h2').forEach((h) => gsap.from(h, { yPercent: 40, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } }));
      gsap.from(q('.nv-giant'), { yPercent: 60, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: q('.nv-giant')[0], start: 'top 95%', once: true } });

      // Cursor
      if (fine()) {
        const c = q('.nv-cur')[0] as HTMLElement;
        const cx = gsap.quickTo(c, 'x', { duration: 0.2 }), cy = gsap.quickTo(c, 'y', { duration: 0.2 });
        addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); c.classList.toggle('nv-hot', !!(e.target as Element).closest?.('a,button')); });
      }

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.remove(tickLenis);
        lenis?.destroy();
        mm.revert();
        document.documentElement.style.overflow = '';
      };
    },
    { scope: root },
  );

  const openWa = (e: React.MouseEvent) => {
    e.preventDefault();
    setModal(true);
  };

  return (
    <div className="nv" ref={root}>
      <div className="nv-intro" aria-hidden="true">
        <div className="nv-intro__half nv-intro__top"><span className="nv-d">Navalha</span></div>
        <div className="nv-intro__half nv-intro__bot"><span className="nv-d">Navalha</span></div>
        <div className="nv-intro__blade" />
        <svg className="nv-intro__razor" viewBox="0 0 160 40" fill="currentColor"><path d="M4 22c18-10 58-15 96-14h6v10H8z" /><rect x="104" y="12" width="54" height="9" rx="4.5" fill="#b8241c" /><circle cx="106" cy="16" r="4" fill="#15130f" /></svg>
        <p className="nv-intro__tag">Barbearia desde 2014 · marca fictícia</p>
        <button type="button" className="nv-skip">Pular</button>
      </div>

      <div className="nv-pole" aria-hidden="true"><i /></div>

      <header className="nv-top">
        <b>Navalha</b>
        <nav><a href="#tabela">Tabela</a><a href="#ritual">O ritual</a><a href="#time">Barbeiros</a><a href="#visita" className="nv-top__cta">Agendar</a></nav>
      </header>

      <main>
        <section className="nv-hero" aria-label="Navalha Barbearia">
          <div className="nv-hero__meta">
            <span><span className="nv-dot" />{today === 0 ? 'Fechado hoje' : `Aberto hoje até ${todayHours.split(' às ')[1]}`}</span>
            <span>Rua das Palmeiras, 120 · Centro</span>
            <span>Sem hora marcada? Chega.</span>
          </div>
          <h1 className="nv-hero__word nv-d" aria-label="Navalha">
            {'NAVALHA'.split('').map((c, i) => <span className="nv-l" key={i} aria-hidden="true"><span>{c}</span></span>)}
            <i className="nv-hero__cut" />
          </h1>
          <div className="nv-hero__foot">
            <p className="nv-hero__lead">Corte, barba e aquele café enquanto espera.</p>
            <a href="#visita" className="nv-seal" onClick={openWa} aria-label="Agendar no WhatsApp">
              <svg className="nv-ring" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="nvc" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs><text><textPath href="#nvc">AGENDAR NO ZAP · AGENDAR NO ZAP · </textPath></text></svg>
              <Scissors className="nv-ico" />
            </a>
          </div>
        </section>

        <div className="nv-band" aria-hidden="true">
          <div className="nv-band__track nv-d">
            {[0, 1].flatMap((k) => ['Corte', 'Barba', 'Pigmentação', 'Sobrancelha', 'Café na faixa'].map((t) => <span key={k + t}>{t}</span>))}
          </div>
        </div>

        <div className="nv-stats">
          <div className="nv-stat"><b data-to="12" data-pre="+" data-dec="0">0</b><span>mil cortes desde 2014</span></div>
          <div className="nv-stat"><b data-to="4.9" data-pre="" data-dec="1">0</b><span>de nota no Google</span></div>
          <div className="nv-stat"><b data-to="3" data-pre="" data-dec="0">0</b><span>cadeiras e nenhuma pressa</span></div>
        </div>

        <section className="nv-menu" id="tabela">
          <div className="nv-menu__head"><h2 className="nv-h2 nv-d">Tabela</h2><p>Preço na parede, sem surpresa no caixa. Pix, cartão ou dinheiro.</p></div>
          <ul>
            {SERVICES.map((s) => (
              <li className="nv-row" data-i={s.icon} key={s.name}>
                <div><h3 className="nv-d">{s.name}</h3><small>{s.info}</small></div><span /><b>{s.price}</b>
              </li>
            ))}
          </ul>
        </section>

        <section className="nv-ritual" id="ritual">
          <div className="nv-ritual__head"><h2 className="nv-h2 nv-d">O ritual</h2></div>
          <div className="nv-ritual__track">
            {RITUAL.map((r, i) => (
              <article className="nv-panel" key={r.t}>
                <span className="nv-panel__n">0{i + 1}</span><div />
                <div>
                  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d={r.d} /></svg>
                  <h3 className="nv-d">{r.t}</h3><p>{r.p}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="nv-chat">
          <div>
            <h2 className="nv-h2 nv-d">Chama no zap</h2>
            <p className="nv-lead">Manda um áudio, uma foto do corte que você quer ou só "tem horário?". A gente responde rápido.</p>
          </div>
          <div className="nv-phone" aria-label="Exemplo de conversa no WhatsApp">
            <div className="nv-msg nv-me"><VoiceNote /><time>17:42</time></div>
            <div className="nv-msg">Fala, chefe! Tem às 18h com o Rafa. Confirmo?<time>17:43</time></div>
            <div className="nv-msg nv-me">Fechou, tô indo 💈<time>17:43</time></div>
          </div>
        </section>

        <section className="nv-crew" id="time">
          <h2 className="nv-h2 nv-d">Barbeiros</h2>
          <div className="nv-stack">
            {CREW.map((c, i) => (
              <article className="nv-card" key={c.n} style={{ '--i': i } as React.CSSProperties}>
                <div className="nv-mono"><span>{c.n[0]}</span></div>
                <div>
                  <h3 className="nv-d">{c.n}</h3><p>{c.p}</p>
                  <div>{c.tags.map((t) => <span className="nv-tag" key={t}>{t}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="nv-grow" aria-label="Agendar">
          <div className="nv-grow__pin">
            <div className="nv-grow__btn">
              <span>Bora agendar?</span>
              <div className="nv-grow__in" style={{ position: 'absolute' }}>
                <h2 className="nv-d">Sua vez.</h2>
                <a href="#" className="nv-big" onClick={openWa}><WaIcon />Agendar no WhatsApp</a>
              </div>
            </div>
          </div>
        </section>

        <section className="nv-visit" id="visita">
          <div className="nv-visit__grid">
            <div>
              <h2 className="nv-h2 nv-d">Passa aqui</h2>
              <ul className="nv-hours">
                {[1, 2, 3, 4, 5, 6, 0].map((i) => (
                  <li key={i} className={i === today ? 'nv-today' : ''}><span>{DAYS[i][0]}{i === today ? ' (hoje)' : ''}</span><span>{DAYS[i][1]}</span></li>
                ))}
              </ul>
              <a href="#" className="nv-big" onClick={openWa}><WaIcon />Agendar no WhatsApp</a>
            </div>
            <div className="nv-map" aria-label="Mapa ilustrativo">
              <svg viewBox="0 0 400 400" fill="none" stroke="#3b4670" strokeWidth="14" strokeLinecap="round"><path d="M-20 120 420 60M-20 260 420 300M120 -20 160 420M290 -20 250 420" /><path d="M-20 190 180 170 420 200" strokeWidth="22" stroke="#4a568a" /><path d="M200 -20 210 420" strokeWidth="6" strokeDasharray="2 18" /></svg>
              <div className="nv-pin"><b>Navalha · Rua das Palmeiras, 120</b><i /></div>
            </div>
          </div>
          <p className="nv-giant nv-d" aria-hidden="true">Navalha</p>
          <div className="nv-foot">
            <span>Site de demonstração. A Navalha é uma barbearia fictícia.</span>
            <span>Quer um site assim? <a href={LYSS_WA} target="_blank" rel="noopener noreferrer">Feito pela LYSS</a></span>
          </div>
        </section>
      </main>

      <div className="nv-float" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d={ICONS[0]} /></svg>
      </div>
      <div className="nv-cur" aria-hidden="true" />

      <div className={`nv-modal ${modal ? 'nv-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="nvmt" onClick={(e) => e.target === e.currentTarget && setModal(false)}>
        <div className="nv-modal__box">
          <h3 className="nv-d" id="nvmt">Aqui abriria o WhatsApp da barbearia</h3>
          <p>Este é um site de demonstração da LYSS. No site da sua barbearia, esse botão leva o cliente direto para o seu WhatsApp, com a mensagem pronta.</p>
          <a className="nv-big" href={LYSS_WA} target="_blank" rel="noopener noreferrer">Quero um site assim</a>
          <button className="nv-x" type="button" onClick={() => setModal(false)}>Continuar vendo</button>
        </div>
      </div>
    </div>
  );
}

export default Navalha;
