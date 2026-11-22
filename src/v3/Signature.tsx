import { forwardRef, useId } from 'react';
import lyss from './sig-lyss';
import sites from './sig-sites';

type SigData = {
  viewBox: string;
  pen: number;
  strokes: { fill: string; ring: boolean; center: string }[];
};

const DATA: Record<'lyss' | 'sites', SigData> = { lyss, sites };

type Props = {
  name: 'lyss' | 'sites';
  className?: string;
  label?: string;
  /** Começa escondida, esperando drawSignature(). */
  hidden?: boolean;
};

/**
 * Assinatura à mão da marca. O desenho é a forma preenchida da caneta;
 * a máscara é o traço central, que dá para "escrever" animando o dashoffset.
 */
export const Signature = forwardRef<SVGSVGElement, Props>(function Signature(
  { name, className, label, hidden = false },
  ref,
) {
  const id = useId().replace(/:/g, '');
  const d = DATA[name];
  return (
    <svg
      ref={ref}
      className={className}
      viewBox={d.viewBox}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <mask id={`m${id}`} maskUnits="userSpaceOnUse">
        {d.strokes.map((s, i) => (
          <path
            key={i}
            data-c=""
            d={s.center}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={d.pen}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset={hidden ? 1 : 0}
          />
        ))}
      </mask>
      <g mask={`url(#m${id})`} fill="currentColor">
        {d.strokes.map((s, i) => (
          <path key={i} d={s.fill} fillRule={s.ring ? 'evenodd' : 'nonzero'} />
        ))}
      </g>
    </svg>
  );
});
