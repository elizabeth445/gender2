import { useEffect, useState } from 'react';
import { eventConfig as event } from '../eventConfig';
import { configuredDirections, downloadCalendar } from '../lib/calendar';
import { Artwork } from './Artwork';
function Countdown() {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, new Date(event.startsAt).getTime() - Date.now()),
  );
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, new Date(event.startsAt).getTime() - Date.now()));
    const timer = window.setInterval(update, 1000);
    document.addEventListener('visibilitychange', update);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  const seconds = Math.floor(remaining / 1000);
  const values = [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
  return (
    <div className="countdown-wrap">
      <p className="countdown-label">
        {remaining ? 'До нашої особливої зустрічі' : 'Наш особливий день настав!'}
      </p>
      <div className="countdown" role="timer" aria-label="Час до свята">
        {values.map((value, index) => (
          <div key={index}>
            <span className="countdown-number">{String(value).padStart(2, '0')}</span>
            <span className="countdown-unit">{['Днів', 'Годин', 'Хвилин', 'Секунд'][index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export function EventDetails() {
  const directions = configuredDirections();
  const weekday = new Intl.DateTimeFormat('uk-UA', {
    weekday: 'long',
    timeZone: event.timeZone,
  }).format(new Date(event.startsAt));
  return (
    <section className="details-section" id="details" aria-labelledby="details-title">
      <div className="details-inner section">
        <div className="details-heading">
          <h2 id="details-title">
            У календарі —<br />
            <em>трішки дива</em>
          </h2>
          <Artwork name="foliage" className="details-leaf" />
        </div>
        <div className="details-content">
          <Countdown />
          <div className="event-facts">
            <div>
              <span className="fact-label">Коли зустрічаємось</span>
              <p>{event.dateLabel}</p>
              <span>
                {weekday.charAt(0).toUpperCase() + weekday.slice(1)}, о {event.time}
              </span>
            </div>
            <div>
              <span className="fact-label">Де шукати наші джунглі</span>
              <p>{event.city}</p>
              <span>{event.address || event.location}</span>
            </div>
          </div>
          <p className="arrival-note">{event.arrivalNote}</p>
          <div className="detail-actions">
            <button className="button" onClick={downloadCalendar}>
              Додати в календар <span aria-hidden="true">＋</span>
            </button>
            {directions ? (
              <a className="text-link" href={directions} target="_blank" rel="noreferrer">
                Як дістатися
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
