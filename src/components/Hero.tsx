import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Artwork, BotanicalMark } from './Artwork';
import { eventConfig as event } from '../eventConfig';
import { useMotionPreference } from '../hooks/useMotionPreference';
gsap.registerPlugin(useGSAP);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);
  const reduce = useMotionPreference();
  const { contextSafe } = useGSAP(
    () => {
      if (reduce) timeline.current?.progress(1);
    },
    { scope: root, dependencies: [reduce] },
  );
  const open = (skip = false) =>
    contextSafe(() => {
      timeline.current?.kill();
      setOpened(true);
      setBusy(!reduce && !skip);
      timeline.current = gsap
        .timeline({ defaults: { ease: 'power2.inOut' }, onComplete: () => setBusy(false) })
        .to('.opening-leaf-left', { xPercent: -75, rotation: -24, autoAlpha: 0, duration: 1.3 }, 0)
        .to(
          '.opening-leaf-right',
          { xPercent: 75, rotation: 24, autoAlpha: 0, duration: 1.3 },
          0.08,
        )
        .fromTo('.hero-answer', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.75 }, 0.55)
        .to(
          '.hero-monkey',
          { rotation: 6, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' },
          0.2,
        )
        .to(
          '.hero-giraffe',
          { rotation: -2, duration: 0.65, yoyo: true, repeat: 1, ease: 'sine.inOut' },
          0.35,
        )
        .to(
          '.corner-leaf',
          { rotation: '+=3', duration: 0.7, yoyo: true, repeat: 1, ease: 'sine.inOut' },
          0.3,
        );
      if (reduce || skip) timeline.current.progress(1);
    })();
  const replay = () =>
    contextSafe(() => {
      timeline.current?.kill();
      gsap.set('.opening-leaf-left, .opening-leaf-right, .hero-answer', { clearProps: 'all' });
      setOpened(false);
      setBusy(false);
    })();
  return (
    <section className={`hero ${opened ? 'is-open' : ''}`} ref={root} aria-labelledby="hero-title">
      <div className="hero-scene" aria-hidden="true">
        <Artwork name="foliage" className="corner-leaf top-left" eager />
        <Artwork name="foliage" className="corner-leaf top-right" eager />
        <Artwork name="giraffe" className="hero-giraffe" eager />
        <Artwork name="elephant" className="hero-elephant" eager />
        <Artwork name="monkey" className="hero-monkey" eager />
        <Artwork name="foliage" className="ground-leaf ground-left" eager />
        <Artwork name="foliage" className="ground-leaf ground-right" eager />
      </div>
      <div className="hero-copy">
        <h1 id="hero-title">
          Маленьке диво
          <br />
          <em>в джунглях</em>
        </h1>
        <p className="hero-intro">
          У наших джунглях скоро з’явиться
          <br />
          дехто дуже особливий…
        </p>
        <div className="invitation-reveal">
          <div className="hero-answer" aria-hidden={!opened}>
            <p className="question">Хлопчик чи дівчинка?</p>
            <p>Запрошуємо вас дізнатися разом!</p>
          </div>
          <div className="leaf-seal" aria-hidden="true">
            <Artwork name="foliage" className="opening-leaf-left" eager />
            <Artwork name="foliage" className="opening-leaf-right" eager />
          </div>
        </div>
        {!opened ? (
          <button className="button primary open-button" onClick={() => open()}>
            Відкрити запрошення <span aria-hidden="true">↗</span>
          </button>
        ) : (
          <a className="button primary open-button" href="#story">
            Наша маленька історія <span aria-hidden="true">↓</span>
          </a>
        )}
        <div className="opening-controls">
          {busy ? (
            <button onClick={() => timeline.current?.progress(1)}>Пропустити анімацію</button>
          ) : opened ? (
            <button onClick={replay}>
              Відтворити ще раз <span aria-hidden="true">↻</span>
            </button>
          ) : (
            <button onClick={() => open(true)}>Відкрити без анімації</button>
          )}
        </div>
      </div>
      <div className="hero-bottom">
        <span>
          {event.shortDate} <i>·</i> {event.time} <i>·</i> {event.city}
        </span>
        <a href="#story" aria-label="Перейти до нашої історії">
          Гортайте нашу історію <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Олена та Артем — на початок">
        <BotanicalMark />
        <span>{event.parents}</span>
      </a>
      <nav aria-label="Основна навігація">
        <a href="#details">Про свято</a>
        <a href="#rsvp" className="nav-rsvp">
          Ми будемо <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
