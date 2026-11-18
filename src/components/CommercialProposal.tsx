import { WHATSAPP_URL } from '../data/mockData';

export function CommercialProposal() {
  return (
    <div className="min-h-screen bg-[#faf6f0] text-stone-100 px-6 sm:px-12 md:px-20 py-20 flex items-center justify-center">
      <div className="max-w-xl border border-rose-border bg-rose-soft/75 rounded-[6px] p-8 sm:p-12 ambient-shadow">
        <span className="font-label text-xs font-semibold uppercase tracking-[0.18em] text-rose-accent block mb-3">
          LYSS · CRIAÇÃO DE SITES
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl text-stone-100 leading-tight mb-4">
          Cada projeto é desenhado de acordo com a sua necessidade.
        </h1>
        <p className="font-body text-base text-stone-300 leading-relaxed mb-8">
          Me conte sobre o seu negócio e os objetivos da sua página para alinharmos o formato ideal do seu site.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-editorial-primary"
        >
          <span>Conversar sobre meu projeto</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
