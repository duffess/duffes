import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import '@fontsource/great-vibes/latin-400.css';
import { COLORS, DEFAULT_WA_MESSAGE, DEFAULT_WA_MESSAGE_EN, WHATSAPP_DISPLAY, waLink } from '../brand/data';
import { gsap, isLite } from '../brand/motion';
import { Signature } from '../brand/Signature';
import { createNameWriter, NAME_FONT } from '../ink/nameInk';
import { createPad } from '../ink/pad';
import { sound } from '../brand/sound';
import { useLang, useT } from '../brand/lang';
import type { PenTarget } from '../scene/ContractPen';

const ContractPen = lazy(() => import('../scene/ContractPen'));

function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/** Cena 7: o contrato. O visitante digita o nome e a caneta assina. */
export function Final({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const penBox = useRef<HTMLDivElement>(null);
  const nameCanvas = useRef<HTMLCanvasElement>(null);
  const padCanvas = useRef<HTMLCanvasElement>(null);
  const pad = useRef<ReturnType<typeof createPad> | null>(null);
  const [drawn, setDrawn] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const [lite] = useState(isLite);
  const lang = useLang();
  const t = useT();
  const [webgl] = useState(hasWebGL);
  const withPen = !reduced && webgl;
  const [name, setName] = useState('');
  const [signedAs, setSignedAs] = useState('');
  const [writing, setWriting] = useState(false);
  const [error, setError] = useState('');
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const target = useMemo<PenTarget>(() => ({ x: 0, y: 0, lift: 140, follow: 3 }), []);
  const writer = useRef<ReturnType<typeof createNameWriter> | null>(null);

  useEffect(() => {
    if (!root.current) return;
    const far = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '100% 0px' });
    const vis = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    far.observe(root.current);
    vis.observe(root.current);
    return () => {
      far.disconnect();
      vis.disconnect();
    };
  }, []);

  /** Posição de um ponto da linha de assinatura no espaço do canvas da caneta. */
  const toCard = (x: number, y: number) => {
    const c = (penBox.current ?? card.current!).getBoundingClientRect();
    const s = slot.current!.getBoundingClientRect();
    return { x: s.left - c.left + x, y: s.top - c.top + y };
  };

  // Caneta em repouso: paira sobre o começo da linha, esperando o nome.
  const rest = () => {
    if (!card.current || !slot.current) return;
    const p = toCard(30, slot.current.clientHeight * 0.55);
    Object.assign(target, { x: p.x, y: p.y, lift: 70, follow: 3 });
  };
  useEffect(() => {
    if (!withPen) return;
    rest();
    const onResize = () => !writing && rest();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [withPen, near]); // eslint-disable-line react-hooks/exhaustive-deps

  // A pessoa assina com a própria mão; a caneta 3D acompanha.
  useEffect(() => {
    const c = padCanvas.current;
    if (!c) return;
    const last = { x: 0, y: 0 };
    pad.current = createPad(c, COLORS.vinho, {
      move(p) {
        if (p.pressing) sound.scratch(0.25 + p.speed * 0.75);
        if (!withPen || writing) return;
        if (p.x < 0) {
          // soltou: a pena sobe um pouco onde parou
          Object.assign(target, { lift: 34, follow: 8 });
          return;
        }
        last.x = p.x;
        last.y = p.y;
        const q = toCard(p.x, p.y);
        Object.assign(target, { x: q.x, y: q.y, lift: p.pressing ? 0 : 26, follow: p.pressing ? 40 : 14 });
      },
      leave() {
        if (withPen) rest();
      },
      stroke() {
        setDrawn(true);
        // quem desenha substitui a assinatura automática
        writer.current?.draw(0);
      },
    });
    return () => pad.current?.destroy();
  }, [withPen, writing]); // eslint-disable-line react-hooks/exhaustive-deps

  const needName = () => {
    const n = name.trim().replace(/\s+/g, ' ');
    if (!n) {
      setError(t('Escreva seu nome ou o do seu negócio primeiro.', 'Type your name or your business name first.'));
      input.current?.focus();
    }
    return n;
  };

  const confirmDrawn = () => {
    const n = needName();
    if (!n) return;
    setError('');
    setSignedAs(n);
    if (withPen) Object.assign(target, { lift: 90, follow: 3 });
  };

  const clearDrawn = () => {
    pad.current?.clear();
    setDrawn(false);
    setSignedAs('');
  };

  const sign = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const n = needName();
    if (!n || writing) return;
    setError('');
    pad.current?.clear();
    setDrawn(false);
    await document.fonts.load(`60px ${NAME_FONT}`).catch(() => null);
    const c = nameCanvas.current!;
    writer.current ??= createNameWriter(c, COLORS.vinho);
    const w = writer.current;
    w.layout(n);
    if (!withPen) {
      w.draw(1);
      setSignedAs(n);
      return;
    }
    setWriting(true);
    setSignedAs('');
    const state = { t: 0 };
    const start = toCard(w.start().x, w.start().y);
    // a caneta desce até o começo da linha antes de escrever
    Object.assign(target, { x: start.x, y: start.y, lift: 0, follow: 9 });
    w.draw(0);
    gsap
      .timeline({
        onComplete: () => {
          setWriting(false);
          setSignedAs(n);
          // assinou: sobe e descansa no fim da linha
          Object.assign(target, { lift: 90, follow: 3 });
        },
      })
      .to({}, { duration: 0.45 })
      .to(state, {
        t: 1,
        duration: w.duration(),
        ease: 'power1.inOut',
        onUpdate: () => {
          const tip = w.draw(state.t);
          sound.scratch(0.55);
          const p = toCard(tip.x, tip.y);
          Object.assign(target, { x: p.x, y: p.y, lift: 0, follow: 30 });
        },
      });
  };

  const message = signedAs
    ? t(
        `Olá! Assinei o contrato no site da LYSS como "${signedAs}". Quero um site assim.`,
        `Hi! I signed the contract on the LYSS site as "${signedAs}". I want a site like this.`,
      )
    : t(DEFAULT_WA_MESSAGE, DEFAULT_WA_MESSAGE_EN);
  const fill = <span className="contract__fill">{name.trim() || '________________'}</span>;

  return (
    <section className="final" id="contrato" ref={root} aria-labelledby="final-title">
      <div className="final__inner">
        <div className="final__head">
          <p className="kicker kicker--light">{t('Último passo', 'Last step')}</p>
          <h2 id="final-title" className="final__title">
            {t('Falta só a sua assinatura.', 'All it needs is your signature.')}
          </h2>
          <p className="final__lead">
            {t(
              'Escreva seu nome e assine com a sua mão, ou deixe a caneta assinar por você. Depois é só chamar a gente no WhatsApp: a conversa começa daí.',
              'Type your name and sign with your own hand, or let the pen sign for you. Then just message us on WhatsApp: the conversation starts there.',
            )}
          </p>
        </div>

        <article className="contract" ref={card} aria-labelledby="contract-title">
          <p className="contract__no">{t('Contrato Nº 002 · o 001 foi lá em cima', 'Contract No. 002 · No. 001 was up top')}</p>
          <h3 id="contract-title" className="contract__title">
            {t('Site sob medida', 'Custom website')}
          </h3>
          {lang === 'en' ? (
            <p className="contract__body">
              LYSS (Isabela &amp; Guilherme) hereby agrees to design a website that looks like {fill}, with a button
              straight to WhatsApp. The preview comes before payment: you only pay if you approve it, in up to 6
              interest-free payments.
            </p>
          ) : (
            <p className="contract__body">
              Pelo presente, a LYSS (Isabela &amp; Guilherme) se compromete a desenhar um site com a cara de {fill}, com
              botão direto para o WhatsApp. A prévia vem antes do pagamento: você só paga se aprovar, em até 6x sem
              juros.
            </p>
          )}

          <form className="contract__form" onSubmit={sign} noValidate>
            <label htmlFor="contract-name">{t('Seu nome ou o do seu negócio', 'Your name or your business name')}</label>
            <div className="contract__row">
              <input
                ref={input}
                id="contract-name"
                type="text"
                autoComplete="name"
                maxLength={28}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'contract-error' : undefined}
                placeholder={t('Ex.: Barbearia do Zé', 'E.g. Joe’s Barbershop')}
              />
              <button className="btn btn--ghost" type="submit" disabled={writing}>
                {t('A caneta assina por mim', 'Let the pen sign for me')}
              </button>
            </div>
            {error && (
              <p id="contract-error" className="contract__error" role="alert">
                {error}
              </p>
            )}
          </form>

          <div className="contract__sigs">
            <div className="contract__sig">
              <Signature className="contract__lyss" label={t('Assinatura da LYSS', 'LYSS signature')} />
              <p>LYSS · Isabela &amp; Guilherme</p>
            </div>
            <div className="contract__sig contract__sig--you">
              <div className={`contract__slot${drawn || writing || signedAs ? ' is-inked' : ''}`} ref={slot}>
                <canvas
                  ref={nameCanvas}
                  className="contract__name"
                  role="img"
                  aria-label={signedAs ? `${t('Assinatura', 'Signature')}: ${signedAs}` : t('Espaço para a sua assinatura', 'Space for your signature')}
                />
                <canvas ref={padCanvas} className="contract__pad" aria-hidden="true" />
                <p className="contract__hint" aria-hidden="true">
                  {lite ? t('Assine aqui com o dedo', 'Sign here with your finger') : t('Assine aqui com o mouse', 'Sign here with your mouse')}
                </p>
              </div>
              <p>{signedAs || name.trim() || t('Você', 'You')}</p>
            </div>
          </div>

          <div className="contract__after">
            {drawn && !signedAs && (
              <div className="contract__padbtns">
                <button className="btn" type="button" onClick={confirmDrawn}>
                  {t('Pronto, assinei', 'Done, I signed')}
                </button>
                <button className="linkbtn" type="button" onClick={clearDrawn}>
                  {t('Limpar', 'Clear')}
                </button>
              </div>
            )}
            {drawn && signedAs && (
              <div className="contract__padbtns">
                <button className="linkbtn" type="button" onClick={clearDrawn}>
                  {t('Assinar de novo', 'Sign again')}
                </button>
              </div>
            )}
            <p aria-live="polite">{signedAs ? t(`Combinado, ${signedAs}. Agora é só chamar a gente.`, `Deal, ${signedAs}. Now just message us.`) : ''}</p>
            <a
              className={`btn btn--wa${signedAs ? ' is-ready' : ''}`}
              href={waLink(message)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('Chamar no WhatsApp', 'Message us on WhatsApp')}
              <span className="sr-only">{t(' (abre o WhatsApp em outra aba)', ' (opens WhatsApp in a new tab)')}</span>
            </a>
          </div>

          {withPen && near && (
            <div className="contract__pen" ref={penBox} aria-hidden="true">
              <Suspense fallback={null}>
                <ContractPen target={target} running={visible} lite={lite} />
              </Suspense>
            </div>
          )}
        </article>
      </div>

      <footer className="foot">
        <Signature className="foot__sig" />
        <p>{t('Todo site sai assinado.', 'Good sites come signed.')}</p>
        <p>
          <a href={waLink(t(DEFAULT_WA_MESSAGE, DEFAULT_WA_MESSAGE_EN))} target="_blank" rel="noopener noreferrer">
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </p>
        <p>© {new Date().getFullYear()} LYSS · Isabela &amp; Guilherme</p>
      </footer>
    </section>
  );
}
