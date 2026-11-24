import { useRef, useState } from 'react';
import { PhoneDemo, WaGlyph } from './PhoneDemo';
import { Signature } from './Signature';
import { mainWa, writeTween } from './helpers';
import { WHATSAPP_DISPLAY, plans, steps, stepsEn, waLink } from './data';
import { finePointer, gsap, prefersReduced, useGSAP } from './motion';
import { BigSignature, Eye, Reveal } from './Fx';
import { useLang, useT } from './lang';
import { useEyes } from './useEyes';

/* ---------- Topo: só o título, enorme, com os olhos ---------- */

export function Hero({ ready }: { ready: boolean }) {
  const t = useT();
  const lang = useLang();
  const root = useRef<HTMLElement>(null);
  useEyes(root, ready, lang);

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
      <h1 id="hero-title" className="hero__title" aria-label={t('Todo site sai assinado.', 'Good sites come signed.')}>
        <span className="hero__line" aria-hidden="true">
          <span>
            {lang === 'en' ? (
              <>G<Eye /><Eye />d sites</>
            ) : (
              <>T<Eye />d<Eye /> site</>
            )}
          </span>
        </span>
        <span className="hero__line hero__line--split" aria-hidden="true">
          {lang === 'en' ? (
            <><span>come</span> <span>signed.</span></>
          ) : (
            <><span>sai</span> <span>assinado.</span></>
          )}
        </span>
      </h1>
      <div className="hero__foot">
        <div className="hero__copy">
          <p className="hero__pain">
            {t(
              'Quem procura o seu serviço no Google e não te acha fecha com o concorrente.',
              'If people search for your service and can’t find you, they book your competitor.',
            )}
          </p>
          <p className="hero__lead">
            {t(
              'Somos a Isabela e o Guilherme. Desenhamos e programamos sites para negócios locais, com botão direto para o seu WhatsApp. A partir de R$ 597.',
              'We are Isabela and Guilherme. We design and build websites for local businesses, with a button straight to your WhatsApp.',
            )}
          </p>
        </div>
        <div className="hero__actions">
          <a className="btn" href={mainWa} target="_blank" rel="noopener noreferrer" data-magnetic>
            <WaGlyph />
            {t('Conversar no WhatsApp', 'Chat on WhatsApp')}
          </a>
          <a className="link" href="#trabalhos">
            {t('Ver trabalhos', 'See our work')}
          </a>
          <p className="trust">{t('Você vê a prévia e só paga se aprovar.', 'You see a preview and only pay if you approve it.')}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Demonstração: o celular que troca de ramo ---------- */

export function Demo() {
  const t = useT();
  const lang = useLang();
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
        <Reveal key={lang} id="try-title">{t('Imagina o seu negócio aqui', 'Picture your business here')}</Reveal>
        <p className="intro-text">{t('Escolha um ramo e toque no botão verde para ver o cliente chegando no WhatsApp.', 'Pick a trade and tap the green button to watch a customer land on WhatsApp.')}</p>
      </div>
      <PhoneDemo />
    </section>
  );
}

/* ---------- Como funciona ---------- */

export function Steps() {
  const t = useT();
  const lang = useLang();
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
          <Reveal key={lang} id="steps-title">{t('Do primeiro oi ao site no ar', 'From hello to live site')}</Reveal>
          <p className="intro-text">{t('Quatro etapas, tudo combinado pelo WhatsApp. Em geral, de uma a duas semanas.', 'Four steps, all agreed on WhatsApp. Usually one to two weeks.')}</p>
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
            {(lang === 'en' ? stepsEn : steps).map((s, i) => (
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
  const t = useT();
  const lang = useLang();
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
          <Reveal key={lang} id="menu-title">{t('Quanto custa', 'Pricing')}</Reveal>
          <p className="intro-text">
            {t(
              'Dois pacotes com preço fechado. Você só paga depois de aprovar a prévia, em até 6x sem juros no cartão.',
              'Two packages with fixed prices. You only pay after approving the preview, in up to 6 interest-free card installments.',
            )}
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
              <p className="plan__summary">{lang === 'en' ? p.summaryEn : p.summary}</p>
              <ul className="plan__items">
                {(lang === 'en' ? p.itemsEn : p.items).map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <a className="btn btn--ink" href={waLink(p.message)} target="_blank" rel="noopener noreferrer" data-magnetic>
                {t('Quero o', 'I want')} {p.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="menu__note">
          {t(
            'Hospedagem sem custo. O domínio (.com.br) fica no seu nome e é pago à parte, cerca de R$ 40 por ano no Registro.br; a gente faz a configuração. Pegamos no máximo 6 sites por mês para dar atenção a cada um.',
            'Hosting at no cost. The domain stays in your name and is paid separately; we set it up. We take at most 6 sites a month so each one gets proper attention.',
          )}
        </p>
      </div>
    </section>
  );
}

/* ---------- Perguntas frequentes ---------- */

const faq: [string, string, string, string][] = [
  ['Preciso pagar alguma coisa antes?', 'Não. A gente desenha a prévia, você abre no celular e só paga depois de aprovar. Dá para parcelar em até 6x sem juros no cartão.',
   'Do I pay anything upfront?', 'No. We build the preview, you open it on your phone and only pay after approving it. Up to 6 interest-free card installments.'],
  ['E se eu não gostar da prévia?', 'Você aponta o que mudar e a gente ajusta. Se mesmo assim não fizer sentido, você não paga nada.',
   'What if I don’t like the preview?', 'You point out what to change and we fix it. If it still isn’t right for you, you pay nothing.'],
  ['O domínio e a hospedagem estão inclusos?', 'A hospedagem não tem custo. O domínio fica no seu nome e é pago à parte, cerca de R$ 40 por ano no Registro.br. A gente faz toda a configuração.',
   'Are domain and hosting included?', 'Hosting has no cost. The domain stays in your name and is paid separately. We handle the whole setup.'],
  ['Quanto tempo leva?', 'Em geral, de uma a duas semanas, do primeiro oi ao site no ar.',
   'How long does it take?', 'Usually one to two weeks, from the first hello to the site going live.'],
  ['Eu preciso entender de site?', 'Não. Tudo é combinado pelo WhatsApp. Você conta como funciona o seu negócio e a gente cuida do resto.',
   'Do I need to know anything about websites?', 'No. Everything happens on WhatsApp. You tell us how your business works and we handle the rest.'],
];

export function Faq() {
  const t = useT();
  const lang = useLang();
  return (
    <section className="faq" id="duvidas" aria-labelledby="faq-title">
      <div className="wrap">
        <Reveal key={lang} id="faq-title">{t('Antes de chamar', 'Before you message us')}</Reveal>
        <div className="faq__list">
          {faq.map(([q, a, qe, ae]) => (
            <details key={q} className="faq__item">
              <summary>{lang === 'en' ? qe : q}</summary>
              <p>{lang === 'en' ? ae : a}</p>
            </details>
          ))}
        </div>
        <a className="btn" href={mainWa} target="_blank" rel="noopener noreferrer" data-magnetic>
          <WaGlyph />
          {t('Pedir minha prévia', 'Ask for my preview')}
        </a>
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
  const t = useT();
  const lang = useLang();
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
          <Reveal key={lang} id="team-title">{t('Quem assina', 'Who signs it')}</Reveal>
          <p>
            {t(
              'A LYSS é uma dupla. Você fala direto com quem desenha e programa o seu site, sem atendente no meio e sem modelo pronto.',
              'LYSS is a duo. You talk directly to the people who design and build your site, no middleman and no template.',
            )}
          </p>
          <p>
            {t(
              'Cada site sai daqui com uma assinatura: a nossa promessa de que ele abre rápido, funciona no celular e leva o cliente até você.',
              'Every site leaves here signed: our promise that it loads fast, works on mobile and brings customers to you.',
            )}
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
  const t = useT();
  const lang = useLang();
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
          <Reveal key={lang} id="closing-title" className="closing__title">
            {t('Me conta o que você faz.', 'Tell us what you do.')}
          </Reveal>
          <p className="closing__text">
            {t(
              'Manda uma mensagem com o nome do seu negócio. A gente responde com uma ideia de como o seu site pode ficar.',
              'Send a message with your business name. We reply with an idea of how your site could look.',
            )}
          </p>
          <a className="btn btn--paper" href={mainWa} target="_blank" rel="noopener noreferrer" data-magnetic>
            <WaGlyph />
            {t('Chamar no WhatsApp', 'Message us on WhatsApp')}
          </a>
          <p className="closing__phone">{t('ou ligue', 'or call')} {WHATSAPP_DISPLAY}</p>
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
  const t = useT();
  return (
    <footer className="footer">
      <BigSignature />
      <div className="wrap footer__row">
        <img src="/logo-lyss-creme.svg" width={928} height={311} alt="LYSS" className="footer__logo" />
        <p>{t('Sites sob medida para negócios locais.', 'Custom websites for local businesses.')} © 2026</p>
        <a className="link" href="#topo">
          {t('Voltar ao topo', 'Back to top')}
        </a>
      </div>
    </footer>
  );
}

/* ---------- Antes e depois: do Instagram ao site ---------- */

export function InstaToSite() {
  const t = useT();
  const lang = useLang();
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const move = (x: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  };
  return (
    <section className="ig2site" aria-labelledby="ig-title">
      <div className="wrap try__head">
        <Reveal key={lang} id="ig-title">{t('Do perfil ao site', 'From profile to website')}</Reveal>
        <p className="intro-text">
          {t('O Dash tinha um Instagram bonito e nenhum lugar para mandar quem chegava. Arraste a linha e veja o site que fizemos para ele.', 'Dash had a nice Instagram and nowhere to send the people who showed up. Drag the line to see the site we built for it.')}
        </p>
      </div>
      <div
        className="ig2site__box"
        ref={box}
        style={{ '--p': `${pos}%` } as React.CSSProperties}
        onPointerDown={(e) => { e.preventDefault(); drag.current = true; (e.currentTarget as Element).setPointerCapture?.(e.pointerId); move(e.clientX); }}
        onPointerMove={(e) => drag.current && move(e.clientX)}
        onPointerUp={() => (drag.current = false)}
        onPointerCancel={() => (drag.current = false)}
      >
        <div className="ig2site__side ig2site__site" aria-hidden="true">
          <picture>
            <source media="(max-width: 700px)" srcSet="/ig-dash/site-m.webp" />
            <img src="/ig-dash/site.webp" width={1100} height={756} alt="" loading="lazy" decoding="async" draggable={false} />
          </picture>
          <span className="ig2site__tag ig2site__tag--r">{t('Site', 'Website')}</span>
        </div>
        <div className="ig2site__side ig2site__ig" aria-hidden="true">
          <div className="mk-ig">
            <p className="mk-ig__user">dashflow</p>
            <div className="mk-ig__top">
              <img className="mk-ig__av" src="/ig-dash/avatar.webp" alt="" draggable={false} />
              <div><b>6</b><small>posts</small></div>
              <div><b>87</b><small>{t('seguidores', 'followers')}</small></div>
              <div><b>112</b><small>{t('seguindo', 'following')}</small></div>
            </div>
            <p className="mk-ig__bio">
              <b>Dash · {t('Relatórios de tráfego com IA', 'AI ad reports')}</b>
              {t('Relatório de Google Ads e Meta Ads pronto num clique. Pra agência de tráfego pequena.', 'Google Ads and Meta Ads reports in one click. For small ad agencies.')}
              <span>{t('link na bio', 'link in bio')}</span>
            </p>
            <div className="mk-ig__hl">
              {(['produto', 'como-funciona', 'dicas', 'novidades'] as const).map((h, i) => (
                <figure key={h}>
                  <img src={`/ig-dash/hl-${h}.webp`} alt="" loading="lazy" draggable={false} />
                  <figcaption>{(lang === 'en' ? ['Product', 'How it works', 'Tips', 'News'] : ['Produto', 'Como funciona', 'Dicas', 'Novidades'])[i]}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mk-ig__grid">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <img key={n} src={`/ig-dash/post${n}.webp`} alt="" loading="lazy" draggable={false} />
              ))}
            </div>
          </div>
          <span className="ig2site__tag">Instagram</span>
        </div>
        <div className="ig2site__handle" aria-hidden="true"><span>‹ ›</span></div>
        <input
          className="ig2site__range"
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t('Comparar Instagram e site', 'Compare Instagram and website')}
        />
      </div>
      <p className="ig2site__note">{t('Dash é um projeto conceito: marca, perfil e números são fictícios.', 'Dash is a concept project: brand, profile and numbers are fictional.')}</p>
    </section>
  );
}
