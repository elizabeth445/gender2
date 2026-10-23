import { eventConfig as event } from '../eventConfig';
import { Artwork } from './Artwork';
export function MomentMark({ name }: { name: string }) {
  const shapes: Record<string, React.ReactNode> = {
    sun: (
      <>
        <circle cx="25" cy="25" r="9" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d="M25 6v5" transform={`rotate(${i * 45} 25 25)`} />
        ))}
      </>
    ),
    fruit: (
      <>
        <path d="M25 17C13 9 7 22 12 33S27 43 28 33C35 42 43 32 39 22S29 16 25 17ZM25 18C23 9 31 7 34 8C34 14 30 17 25 18Z" />
      </>
    ),
    leaf: (
      <>
        <path d="M12 39C11 15 23 8 39 10C40 25 34 39 12 39ZM12 39L32 18M20 31L18 22M26 25L34 26" />
      </>
    ),
    star: (
      <>
        <path d="M25 5L30 19L45 25L30 31L25 45L20 31L5 25L20 19Z" />
        <path d="M39 6v7M36 9h6" />
      </>
    ),
    heart: <path d="M25 40C8 30 6 20 13 14C19 9 24 14 25 17C28 8 41 10 41 21C41 28 31 37 25 40Z" />,
  };
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name] ?? shapes.leaf}
    </svg>
  );
}
export function Schedule() {
  return (
    <section className="schedule section" id="schedule" aria-labelledby="schedule-title">
      <div className="schedule-heading">
        <h2 id="schedule-title">
          Один день.
          <br />
          <em>Стільки щастя.</em>
        </h2>
        <p>
          Без поспіху. У колі своїх.
          <br />І з однією великою несподіванкою.
        </p>
        <Artwork name="giraffe" className="schedule-giraffe" />
      </div>
      <ol className="schedule-list">
        {event.schedule.map((moment, i) => (
          <li key={moment.time} className={i === 3 ? 'main-moment' : ''}>
            <span className="moment-icon">
              <MomentMark name={moment.mark} />
            </span>
            <time>{moment.time}</time>
            <div>
              <h3>{moment.title}</h3>
              <p>{moment.detail}</p>
            </div>
            {i === 3 ? <span className="moment-annotation">Затамуйте подих…</span> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
