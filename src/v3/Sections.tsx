import { useRef } from 'react';
import { PhoneDemo, WaGlyph } from './PhoneDemo';
import { Signature } from './Signature';
import { mainWa, writeTween } from './helpers';
import { WHATSAPP_DISPLAY, plans, steps, waLink } from './data';
import { finePointer, gsap, prefersReduced, useGSAP } from './motion';
import { BigSignature, Eye, Reveal } from './Fx';
import { useEyes } from './useEyes';

/* ---------- Topo: só o título, enorme, com os olhos ---------- */

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  useEyes(root, ready);

  // Saída: o título afunda e some enquanto a página desce.
  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.to('.hero__title', {
        yPercent: 22,
        scale: 0.92,
        autoAlpha: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (prefersReduced()) return;
      if (!ready) {
        gsap.set('.hero__line > span', { yPercent: 108 });
        gsap.set('.hero__foot > *', { autoAlpha: 0, y: 24 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.hero__line > span', { yPercent: 108 }, { yPercent: 0, duration: 1.3, stagger: 0.1 }).fromTo(
        '.hero__foot > *',
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 },
        0.45,
      );
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section className="hero" id="topo" ref={root} aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero__title" aria-label="Todo site sai assinado.">
        <span className="hero__line" aria-hidden="true">
          <span>
            T<Eye />d<Eye /> site
          </span>
        </span>
        <span className="hero__line hero__line--split" aria-hidden="true">
          <span>sai</span> <span>assinado.</span>
        </span>
      </h1>
      <div className="hero__foot">
        <p className="hero__lead">
          Somos a Isabela e o Guilherme. Desenhamos e programamos sites para negócios locais, com botão direto para o
          seu WhatsApp. A partir de R$ 497.
        </p>
        <div className="hero__actions">
          <a className="btn" href={mainWa} target="_blank" rel="noopener noreferrer" data-magnetic>
            <WaGlyph />
            Conversar no WhatsApp
          </a>
          <a className="link" href="#trabalhos">
            Ver trabalhos
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Demonstração: o celular que troca de ramo ---------- */

export function Demo() {
  const root = useRef<HTMLElement>(null);

  // No computador, o celular inclina com o mouse.
  useGSAP(
    () => {
      if (prefersReduced() || !finePointer()) return;
      const phone = root.current?.querySelector<HTMLElement>('.phone');
      if (!phone) return;
      gsap.set(phone, { transformPerspective: 900 });
      const rx = gsap.quickTo(phone, 'rotationX', { duration: 0.8, ease: 'power3' });
      const ry = gsap.quickTo(phone, 'rotationY', { duration: 0.8, ease: 'power3' });
      const move = (e: PointerEvent) => {
        ry((e.clientX / window.innerWidth - 0.5) * 22);
        rx(-(e.clientY / window.innerHeight - 0.5) * 14);
      };
      window.addEventListener('pointermove', move, { passive: true });
      return () => window.removeEventListener('pointermove', move);
    },
    { scope: root },
  );

  return (
    <section className="try" id="exemplo" ref={root} aria-labelledby="try-title">
      <div className="wrap try__head">
        <Reveal id="try-title">Imagina o seu negócio aqui</Reveal>
        <p className="intro-text">Escolha um ramo e toque no botão verde para ver o cliente chegando no WhatsApp.</p>
      </div>
      <PhoneDemo />
    </section>
  );
}

/* ---------- Como funciona ---------- */

export function Steps() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('.step');
      if (prefersReduced()) {
        items.forEach((el) => el.classList.add('is-on'));
        return;
      }
      // A linha desce junto com a rolagem: um recorte que vai abrindo de cima para baixo,
      // com a ponta da caneta acompanhando.
      const st = { trigger: '.steps__list', start: 'top 72%', end: 'bottom 72%', scrub: 0.8 };
      gsap.fromTo('.steps__ink', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: st });
      const ink = root.current?.querySelector<SVGSVGElement>('.steps__ink');
      const path = ink?.querySelector('path');
      const tip = root.current?.querySelector<HTMLElement>('.steps__tip');
      if (ink && path && tip) {
        const len = path.getTotalLength();
        const place = gsap.quickSetter(tip, 'css');
        const follow = { p: 0 };
        place({ x: ink.clientWidth / 2, y: 0 });
        gsap.to(follow, {
          p: 1,
          ease: 'none',
          scrollTrigger: st,
          onUpdate: () => {
            const pt = path.getPointAtLength(follow.p * len);
            place({ x: (pt.x / 40) * ink.clientWidth, y: (pt.y / 1000) * ink.clientHeight });
          },
        });
      }
      items.forEach((el) =>
        gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 72%', toggleClass: 'is-on' },
        }),
      );
    },
    { scope: root },
  );

  return (
    <section className="steps" id="como-funciona" ref={root} aria-labelledby="steps-title">
      <div className="wrap steps__grid">
        <div className="steps__head">
          <Reveal id="steps-title">Do primeiro oi ao site no ar</Reveal>
          <p className="intro-text">Quatro etapas, tudo combinado pelo WhatsApp. Em geral, de uma a duas semanas.</p>
        </div>
        <div className="steps__body">
          <svg className="steps__ink" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M20 0C34 120 6 240 20 360S6 600 20 720 34 900 20 1000"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="steps__track" aria-hidden="true">
            <span className="steps__tip" />
          </span>
          <ol className="steps__list">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step__num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="h3">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- Preços ---------- */

export function Pricing() {
  const root = useRef<HTMLElement>(null);

  // O selo cai na seção como um carimbo.
  useGSAP(
    () => {
      if (prefersReduced()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.menu__list', start: 'top 78%', once: true } });
      tl.from('.menu__stamp', { scale: 2.6, rotation: -48, autoAlpha: 0, duration: 0.5, ease: 'power4.in' })
        .to('.menu .wrap', { y: 6, duration: 0.06, yoyo: true, repeat: 3, ease: 'none' })
        .from('.plan', { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' }, 0.1);
    },
    { scope: root },
  );

  return (
    <section className="menu" id="precos" ref={root} aria-labelledby="menu-title">
      <div className="wrap">
        <img
          className="menu__stamp"
          src="/selo-vinho.svg"
          width={1000}
          height={1000}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="menu__head">
          <Reveal id="menu-title">Quanto custa</Reveal>
          <p className="intro-text">
            Dois pacotes com preço fechado. Domínio e hospedagem ficam no seu nome, e a gente configura tudo.
          </p>
        </div>
        <ul className="menu__list">
          {plans.map((p) => (
            <li key={p.id} className="plan">
              <div className="plan__row">
                <h3 className="plan__name">{p.name}</h3>
                <span className="plan__dots" aria-hidden="true" />
                <p className="plan__price">{p.price}</p>
              </div>
              <p className="plan__summary">{p.summary}</p>
              <ul className="plan__items">
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <a className="btn btn--ink" href={waLink(p.message)} target="_blank" rel="noopener noreferrer" data-magnetic>
                Quero o {p.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Quem faz ---------- */

const people = [
  { name: 'Isabela', photo: '/isabela', alt: 'Retrato da Isabela, de óculos e cabelo longo' },
  { name: 'Guilherme', photo: '/guilherme', alt: 'Retrato do Guilherme, de óculos' },
];

export function Team() {
  const root = useRef<HTMLElement>(null);
  const sig = useRef<SVGSVGElement>(null);
  const reduced = prefersReduced();

  useGSAP(
    () => {
      const svg = sig.current;
      if (!svg || reduced) return;
      const write = writeTween(svg, 1.8);
      gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 85%', once: true, onEnter: () => write.play() } });
      gsap.from('.person', {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.team__people', start: 'top 80%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section className="team" id="quem-faz" ref={root} aria-labelledby="team-title">
      <div className="wrap team__grid">
        <div className="team__copy">
          <Reveal id="team-title">Quem assina</Reveal>
          <p>
            A LYSS é uma dupla. Você fala direto com quem desenha e programa o seu site, sem atendente no meio e sem
            modelo pronto.
          </p>
          <p>
            Cada site sai daqui com uma assinatura: a nossa promessa de que ele abre rápido, funciona no celular e leva o
            cliente até você.
          </p>
          <Signature ref={sig} name="lyss" className="team__sig" hidden={!reduced} label="Assinatura Lyss" />
        </div>
        <ul className="team__people">
          {people.map((p) => (
            <li key={p.name} className="person">
              <img
                src={`${p.photo}.webp`}
                srcSet={`${p.photo}-480.webp 480w, ${p.photo}.webp 800w`}
                sizes="(max-width: 700px) 46vw, 22vw"
                width={800}
                height={1000}
                alt={p.alt}
                loading="lazy"
                decoding="async"
              />
              <p className="person__name">{p.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Fechamento ---------- */

export function Closing() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.to('.closing__seal', {
        rotation: 200,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
      });
    },
    { scope: root },
  );

  return (
    <section className="closing" id="contato" ref={root} aria-labelledby="closing-title">
      <div className="wrap closing__grid">
        <div>
          <Reveal id="closing-title" className="closing__title">
            Me conta o que você faz.
          </Reveal>
          <p className="closing__text">
            Manda uma mensagem com o nome do seu negócio. A gente responde com uma ideia de como o seu site pode ficar.
          </p>
          <a className="btn btn--paper" href={mainWa} target="_blank" rel="noopener noreferrer" data-magnetic>
            <WaGlyph />
            Chamar no WhatsApp
          </a>
          <p className="closing__phone">ou ligue {WHATSAPP_DISPLAY}</p>
        </div>
        <img
          className="closing__seal"
          src="/selo-creme.svg"
          width={1000}
          height={1000}
          alt="Selo: todo site sai assinado, Lyss, sites sob medida"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <BigSignature />
      <div className="wrap footer__row">
        <img src="/logo-lyss-creme.svg" width={928} height={311} alt="LYSS" className="footer__logo" />
        <p>Sites sob medida para negócios locais. © 2026</p>
        <a className="link" href="#topo">
          Voltar ao topo
        </a>
      </div>
    </footer>
  );
}
