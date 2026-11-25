import { forwardRef, useId } from 'react';
import type { CSSProperties } from 'react';

type Props = {
  top: string;
  title: string;
  bottom: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Marca de carimbo: moldura dupla, título em Agilov e falhas de tinta.
 * As falhas vêm de um ruído fixo (calculado uma vez, a marca não "ferve").
 */
export const Stamp = forwardRef<SVGSVGElement, Props>(function Stamp({ top, title, bottom, className, style }, ref) {
  const id = useId().replace(/:/g, '');
  return (
    <svg ref={ref} className={`stamp ${className ?? ''}`} style={style} viewBox="0 0 320 200" aria-hidden="true">
      <defs>
        <filter id={`f${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={title.length * 7} result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.7"
            result="holes"
          />
          <feComposite in="SourceGraphic" in2="holes" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#f${id})`} fill="currentColor" stroke="currentColor">
        <rect x="8" y="8" width="304" height="184" rx="18" fill="none" strokeWidth="7" />
        <rect x="22" y="22" width="276" height="156" rx="10" fill="none" strokeWidth="2.5" />
        <text x="160" y="56" textAnchor="middle" stroke="none" className="stamp__small">
          {top}
        </text>
        <text
          x="160"
          y="122"
          textAnchor="middle"
          stroke="none"
          className="stamp__title"
          style={title.length > 8 ? { fontSize: 42 } : undefined}
        >
          {title}
        </text>
        <line x1="70" y1="140" x2="250" y2="140" strokeWidth="2.5" />
        <text x="160" y="164" textAnchor="middle" stroke="none" className="stamp__small">
          {bottom}
        </text>
      </g>
    </svg>
  );
});
