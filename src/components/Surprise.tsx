import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Artwork, BotanicalSprig } from './Artwork';
import { useMotionPreference } from '../hooks/useMotionPreference';
gsap.registerPlugin(ScrollTrigger);
export function Surprise() {
  const [revealed, setRevealed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduce = useMotionPreference();
  useGSAP(
    () => {
      if (reduce) return;
      gsap
        .timeline({
          defaults: { ease: 'sine.inOut' },
          scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
        })
        .fromTo(
          '.monkey-character',
          { x: 0, y: 0, xPercent: -14, yPercent: -1, rotation: -7, autoAlpha: 0 },
          { xPercent: 0, yPercent: 4, rotation: 0, autoAlpha: 1, duration: 0.85 },
        )
        .to('.monkey-character', { xPercent: 4, yPercent: 5.5, rotation: 3, duration: 0.45 })
        .to('.monkey-character', { xPercent: 0, yPercent: 4, rotation: 0, duration: 0.6 });
    },
    { scope: root, dependencies: [reduce], revertOnUpdate: true },
  );
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
        <div className="surprise-monkey" aria-hidden="true">
          <img
            className="monkey-branch"
            src="/art/monkey-branch.webp"
            width="600"
            height="900"
            alt=""
            loading="lazy"
          />
          <img
            className="monkey-character"
            src="/art/monkey-character.webp"
            width="600"
            height="900"
            alt=""
            loading="lazy"
          />
        </div>
        <div className="surprise-reveal">
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
          {revealed ? 'Сховати секрет' : 'Зазирнути під листочок'}
        </button>
        <span className="sr-only" role="status">
          {revealed ? 'Найцікавіше ще попереду!' : ''}
        </span>
        <BotanicalSprig className="surprise-sprig" />
      </div>
    </aside>
  );
}
