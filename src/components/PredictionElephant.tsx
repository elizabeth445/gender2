import { useId } from 'react';

// Neutral grey keeps the face and body still; only the two ear regions deform.
const earMap = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="624" viewBox="0 0 600 624"><defs><radialGradient id="l"><stop stop-color="#dba080"/><stop offset="1" stop-color="#808080"/></radialGradient><radialGradient id="r"><stop stop-color="#25a080"/><stop offset="1" stop-color="#808080"/></radialGradient></defs><path fill="#808080" d="M0 0h600v624H0z"/><ellipse cx="100" cy="190" rx="75" ry="120" fill="url(#l)"/><ellipse cx="480" cy="250" rx="95" ry="135" fill="url(#r)"/></svg>',
)}`;

export function PredictionElephant({ name }: { name: 'elephant-blue' | 'elephant-pink' }) {
  const id = `elephant-ears-${useId().replace(/:/g, '')}`;
  return (
    <svg
      className="art prediction-elephant"
      width="600"
      height="624"
      viewBox="0 0 600 624"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id={id}
          x="-30"
          y="-30"
          width="660"
          height="684"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            href={earMap}
            x="0"
            y="0"
            width="600"
            height="624"
            preserveAspectRatio="none"
            result="ears"
          />
          <feDisplacementMap
            className="ear-flutter"
            in="SourceGraphic"
            in2="ears"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <image href={`/art/${name}.webp`} width="600" height="624" filter={`url(#${id})`} />
    </svg>
  );
}
