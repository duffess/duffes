import { DEFAULT_WA_MESSAGE, DEFAULT_WA_MESSAGE_EN, waLink } from '../brand/data';
import { useT } from '../brand/lang';

/** Sempre à mão, em todas as cenas. */
export function WaButton() {
  const t = useT();
  return (
    <a className="wa" href={waLink(t(DEFAULT_WA_MESSAGE, DEFAULT_WA_MESSAGE_EN))} target="_blank" rel="noopener noreferrer">
      <span className="wa__dot" aria-hidden="true" />
      <span className="wa__label">{t('Chamar no WhatsApp', 'Message us on WhatsApp')}</span>
      <span className="sr-only">{t(' (abre o WhatsApp em outra aba)', ' (opens WhatsApp in a new tab)')}</span>
    </a>
  );
}
