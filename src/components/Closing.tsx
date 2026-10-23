import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Artwork, BotanicalMark } from './Artwork';
import { eventConfig as event } from '../eventConfig';
import { useMotionPreference } from '../hooks/useMotionPreference';
gsap.registerPlugin(ScrollTrigger);
export function Closing() {
  const root = useRef<HTMLElement>(null);
  const reduce = useMotionPreference();
  useGSAP(
    () => {
      if (reduce) return;
      gsap.fromTo(
        '.closing-butterfly',
        { x: -30, y: 5, rotation: -15 },
        {
          x: 60,
          y: -35,
          rotation: 15,
          duration: 3,
          ease: 'sine.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 60%', once: true },
        },
      );
      gsap.to('.closing-leaf', {
        rotation: '+=4',
        duration: 1.6,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut',
        scrollTrigger: { trigger: root.current, start: 'top 65%', once: true },
      });
    },
    { scope: root, dependencies: [reduce], revertOnUpdate: true },
  );
  return (
    <footer className="closing" ref={root}>
      <div className="closing-text">
        <BotanicalMark />
        <p className="closing-quote">
          Найкращі миті — ті,
          <br />
          які ми розділяємо разом.
        </p>
        <h2>
          Чекаємо <em>на вас!</em>
        </h2>
        <p className="closing-parents">{event.parents}</p>
        <p className="closing-date">
          {event.shortDate} <span>·</span> {event.city}
        </p>
        <svg
          className="closing-butterfly"
          width="43"
          height="38"
          viewBox="0 0 50 40"
          aria-hidden="true"
        >
          <path
            d="M25 23C-1-6 2 35 24 25C4 46 32 41 25 24C53 0 45-8 26 22C51 34 42 44 26 25"
            fill="#c4a370"
            opacity=".75"
          />
          <path d="M24 29l3-13" stroke="#716b5a" fill="none" />
        </svg>
      </div>
      <div className="closing-art" aria-hidden="true">
        <Artwork name="giraffe" className="closing-giraffe" />
        <Artwork name="elephant" className="closing-elephant" />
        <Artwork name="foliage" className="closing-leaf closing-leaf-left" />
        <Artwork name="foliage" className="closing-leaf closing-leaf-right" />
      </div>
      <div className="colophon">
        <span>Маленьке диво. Велика любов.</span>
        <a href="#top">
          На початок <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
