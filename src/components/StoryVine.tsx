import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionPreference } from '../hooks/useMotionPreference';
gsap.registerPlugin(ScrollTrigger);
export function StoryVine() {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useMotionPreference();
  useGSAP(
    () => {
      if (reduce) return;
      const path = root.current?.querySelector<SVGPathElement>('.vine-stem');
      const chapter = root.current?.parentElement;
      if (!path || !chapter) return;
      const divider = chapter.querySelector('.page-turn');
      if (divider) {
        gsap.from(divider.querySelectorAll('span'), {
          scaleX: 0,
          duration: 1.2,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: divider, start: 'top 85%', once: true },
        });
        gsap.from(divider.querySelector('svg'), {
          rotation: -25,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: divider, start: 'top 85%', once: true },
        });
      }
      const length = path.getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: chapter, start: 'top 65%', end: 'bottom 65%', scrub: 0.4 },
        },
      );
      const leaves = root.current?.querySelectorAll('.vine-leaf');
      leaves?.forEach((leaf, i) =>
        gsap.from(leaf, {
          opacity: 0,
          duration: 0.4,
          scrollTrigger: { trigger: chapter, start: `${12 + i * 15}% 65%`, once: true },
        }),
      );
    },
    { scope: root, dependencies: [reduce], revertOnUpdate: true },
  );
  return (
    <div className="story-vine" ref={root} aria-hidden="true">
      <svg className="vine-line" viewBox="0 0 60 1600" preserveAspectRatio="none" fill="none">
        <path
          className="vine-ghost"
          d="M30 0C-6 135 66 210 30 350S-2 570 30 720S62 950 30 1110S-4 1400 30 1600"
        />
        <path
          className="vine-stem"
          d="M30 0C-6 135 66 210 30 350S-2 570 30 720S62 950 30 1110S-4 1400 30 1600"
        />
      </svg>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <svg
          className="vine-leaf"
          key={i}
          viewBox="0 0 30 45"
          style={{ top: `${12 + i * 15}%`, transform: `rotate(${i % 2 ? -45 : 25}deg)` }}
        >
          <path d="M7 42C-1 25 4 8 24 2C31 21 24 37 7 42Z" />
          <path d="M7 42L23 4" fill="none" />
        </svg>
      ))}
    </div>
  );
}
