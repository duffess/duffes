import { waLink } from '../brand/data';
import { Signature } from '../brand/Signature';
import { useT } from '../brand/lang';
import { DEFAULT_WA_MESSAGE, DEFAULT_WA_MESSAGE_EN } from '../brand/data';

/** Cena 3: o papel creme onde a assinatura já secou. Sem simulação, sem custo. */
export function InkSection() {
  const t = useT();
  return (
    <section className="ink" id="conteudo" aria-labelledby="ink-title">
      <Signature className="ink__sig" />
      <div className="ink__inner">
        <p className="kicker">{t('LYSS · estúdio de duas pessoas', 'LYSS · a two-person studio')}</p>
        <h2 id="ink-title" className="ink__title">
          {t('Seu negócio, com site de verdade.', 'Your business, with a real website.')}
        </h2>
        <p className="ink__body">
          {t(
            'Somos a Isabela e o Guilherme. Desenhamos e colocamos no ar sites sob medida para barbearias, estúdios e restaurantes. Quem entra no seu site já encontra o botão para falar com você no WhatsApp.',
            'We are Isabela and Guilherme. We design and launch custom websites for barbershops, studios and restaurants. Anyone who visits your site finds a button to talk to you on WhatsApp.',
          )}
        </p>
        <div className="ink__cta">
          <a className="btn" href={waLink(t(DEFAULT_WA_MESSAGE, DEFAULT_WA_MESSAGE_EN))} target="_blank" rel="noopener noreferrer">
            {t('Quero um site assim', 'I want a site like this')}
            <span className="sr-only">{t(' (abre o WhatsApp em outra aba)', ' (opens WhatsApp in a new tab)')}</span>
          </a>
          <p className="ink__note">{t('Você vê a prévia e só paga se aprovar.', 'You see a preview and only pay if you approve it.')}</p>
        </div>
      </div>
    </section>
  );
}
