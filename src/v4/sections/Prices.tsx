import { useEffect, useRef } from 'react';
import { brl, plans } from '../brand/offer';
import { waLink } from '../brand/data';
import { Stamp } from '../brand/Stamp';
import { gsap, ScrollTrigger } from '../brand/motion';
import { sound } from '../brand/sound';
import { useLang, useT } from '../brand/lang';

/** Cena 6: preço fechado, como uma tabela de preços de balcão. */
export function Prices({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLElement>(null);
  const seal = useRef<SVGSVGElement>(null);
  const lang = useLang();
  const t = useT();

  // Uma batida só: o carimbo da garantia cai quando a tabela aparece.
  useEffect(() => {
    if (reduced || !seal.current) return;
    gsap.set(seal.current, { autoAlpha: 0 });
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top 35%',
      once: true,
      onEnter: () => {
        gsap.delayedCall(0.18, sound.thud);
        gsap.fromTo(
          seal.current,
          { autoAlpha: 0, scale: 1.4, y: -30 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.18, ease: 'power4.in' },
        );
      },
    });
    return () => st.kill();
  }, [reduced]);

  return (
    <section className="prices" id="precos" ref={root} aria-labelledby="prices-title">
      <div className="prices__head">
        <p className="kicker kicker--light">{t('Preços', 'Pricing')}</p>
        <h2 id="prices-title" className="prices__title">
          {t('Preço fechado. Sem surpresa no fim.', 'Fixed price. No surprises at the end.')}
        </h2>
        <p className="prices__promise">
          <strong>{t('Você vê a prévia e só paga se aprovar.', 'You see a preview and only pay if you approve it.')}</strong>{' '}
          {t(
            'Depois, dá para parcelar em até 6x sem juros no cartão.',
            'Then you can split it into up to 6 interest-free card payments.',
          )}
        </p>
        <Stamp
          ref={seal}
          className="prices__seal"
          top={t('GARANTIA LYSS', 'LYSS PROMISE')}
          title={t('Só paga', 'Pay only')}
          bottom={t('se aprovar', 'if you approve')}
        />
      </div>

      <ul className="prices__list">
        {plans.map((p) => (
          <li key={p.id} className="plan">
            <div className="plan__top">
              <h3 className="plan__name">{p.name}</h3>
              <span className="plan__dots" aria-hidden="true" />
              <p className="plan__price">
                <span className="sr-only">{t('Preço: ', 'Price: ')}</span>
                {brl(p.price)}
              </p>
            </div>
            <p className="plan__parcel">
              {t('ou 6x de ', 'or 6 interest-free payments of ')}
              {brl(Math.round((p.price / 6) * 100) / 100)}
              {t(' sem juros', '')}
            </p>
            <p className="plan__summary">{lang === 'en' ? p.en.summary : p.summary}</p>
            <ul className="plan__items">
              {(lang === 'en' ? p.en.items : p.items).map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <a className="btn btn--light" href={waLink(lang === 'en' ? p.en.message : p.message)} target="_blank" rel="noopener noreferrer">
              {t('Pedir minha prévia', 'Ask for my preview')}
              <span className="sr-only">
                {t(` do pacote ${p.name} (abre o WhatsApp em outra aba)`, ` for the ${p.name} plan (opens WhatsApp in a new tab)`)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
