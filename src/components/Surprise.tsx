import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Artwork, BotanicalSprig } from './Artwork';
import { useMotionPreference } from '../hooks/useMotionPreference';
export function Surprise() {
  const [revealed, setRevealed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduce = useMotionPreference();
  useGSAP(
    () => {
      gsap.to('.surprise-leaf', {
        rotation: revealed ? 35 : 0,
        xPercent: revealed ? 35 : 0,
        opacity: revealed ? 0.1 : 1,
        duration: reduce ? 0 : 0.8,
        ease: 'power2.inOut',
      });
      gsap.to('.surprise-secret', {
        autoAlpha: revealed ? 1 : 0,
        duration: reduce ? 0 : 0.5,
        delay: revealed && !reduce ? 0.25 : 0,
      });
    },
    { scope: root, dependencies: [revealed, reduce], revertOnUpdate: true },
  );
  return (
    <aside className="surprise section" ref={root} aria-label="Маленький секрет від мавпеняти">
      <div className="surprise-scene">
        <Artwork name="monkey" className="surprise-monkey" />
        <div className="surprise-secret" id="surprise-secret" aria-hidden={!revealed}>
          <p>
            Найцікавіше
            <br />
            <em>ще попереду!</em>
          </p>
          <span>І воно варте очікування.</span>
        </div>
        <button
          className="surprise-leaf"
          aria-label={revealed ? 'Закрити листочок' : 'Відкрити листочок'}
          aria-expanded={revealed}
          aria-controls="surprise-secret"
          onClick={() => setRevealed(!revealed)}
        >
          <Artwork name="foliage" />
        </button>
      </div>
      <div className="surprise-copy">
        <h2>
          Маленький секрет
          <br />
          <em>від мавпеняти</em>
        </h2>
        <p>
          Здається, цей бешкетник щось знає.
          <br />
          Зазирнемо під листочок?
        </p>
        <button
          className="text-link"
          aria-expanded={revealed}
          aria-controls="surprise-secret"
          onClick={() => setRevealed(!revealed)}
        >
          {revealed ? 'Сховати секрет' : 'Зазирнути під листочок'} <span aria-hidden="true">↗</span>
        </button>
        <span className="sr-only" role="status">
          {revealed ? 'Найцікавіше ще попереду!' : ''}
        </span>
        <BotanicalSprig className="surprise-sprig" />
      </div>
    </aside>
  );
}
