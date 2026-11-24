import { useId } from 'react';
import { EYE, IRIS, O_OUTER, PUPIL } from './eyeShape';

/** O "o" da Bagel Fat One que vira olho (mesmo desenho de duffes/src/v3/Fx.tsx). */
export function Eye() {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="eye" viewBox="0 -527 558 529" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`e${id}`}>
          <ellipse className="eye__shape" cx={EYE.cx} cy={EYE.cy} rx={EYE.rx} ry={EYE.rest} />
        </clipPath>
      </defs>
      <g transform="scale(1,-1)">
        <path d={O_OUTER} fill="currentColor" />
        <ellipse className="eye__white eye__shape" cx={EYE.cx} cy={EYE.cy} rx={EYE.rx} ry={EYE.rest} />
        <g clipPath={`url(#e${id})`}>
          <g className="eye__look">
            <circle className="eye__iris" cx={EYE.cx} cy={EYE.cy} r={IRIS.rest} />
            <circle className="eye__pupil" cx={EYE.cx} cy={EYE.cy} r={IRIS.rest * PUPIL.rest} />
            <circle className="eye__glint" cx={EYE.cx - IRIS.rest * 0.32} cy={EYE.cy + IRIS.rest * 0.34} r={IRIS.rest * 0.2} />
          </g>
        </g>
      </g>
    </svg>
  );
}
