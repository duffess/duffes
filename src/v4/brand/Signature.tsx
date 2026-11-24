import { FILLS, VIEWBOX } from './sigPath';

/** A assinatura LYSS inteira, estática (logo e versão sem movimento). */
export function Signature({ className, label }: { className?: string; label?: string }) {
  return (
    <svg
      className={className}
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      fill="currentColor"
    >
      {FILLS.map((s, i) => (
        <path key={i} d={s.d} fillRule={s.ring ? 'evenodd' : 'nonzero'} />
      ))}
    </svg>
  );
}
