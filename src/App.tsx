import { useEffect } from 'react';
import { Artwork, BotanicalMark, BotanicalSprig } from './components/Artwork';
import { Header, Hero } from './components/Hero';
import { Prediction } from './components/Prediction';
import { EventDetails } from './components/EventDetails';
import { Schedule } from './components/Schedule';
import { Surprise } from './components/Surprise';
import { RSVP } from './components/RSVP';
import { Closing } from './components/Closing';
import { StoryVine } from './components/StoryVine';
import { eventConfig as event } from './eventConfig';
export default function App() {
  useEffect(() => {
    document.title = `${event.title} — ${event.parents}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `${event.parents} запрошують розділити радість маленького дива. ${event.dateLabel}, ${event.city}.`,
      );
  }, []);
  return (
    <>
      <a className="skip-link" href="#story">
        До змісту запрошення
      </a>
      <div id="top" />
      <Header />
      <main>
        <Hero />
        <div className="book-chapters">
          <StoryVine />
          <section className="story section" id="story" aria-labelledby="story-title">
            <BotanicalSprig className="story-sprig story-sprig-top" />
            <BotanicalSprig className="story-sprig story-sprig-bottom" />
            <div className="story-picture">
              <div className="illustration-wash" />
              <Artwork name="elephant" />
              <p className="handwritten">Диво вже зовсім близько…</p>
            </div>
            <div className="story-copy">
              <h2 id="story-title">
                Дорогі <em>наші!</em>
              </h2>
              <p className="lead">
                Деякі таємниці надто прекрасні,
                <br className="desktop-break" /> щоб відкривати їх наодинці.
              </p>
              <p>
                У нашій родині скоро станеться маленьке диво, і ми хочемо розділити цю радість із
                вами.
              </p>
              <p>Приходьте разом із нами дізнатися, хто незабаром з’явиться на світ!</p>
              <div className="signature">
                <span>З любов’ю,</span>
                <p>{event.parents}</p>
              </div>
            </div>
          </section>
          <div className="page-turn" aria-hidden="true">
            <span />
            <BotanicalMark />
            <span />
          </div>
          <Prediction />
          <EventDetails />
          <Schedule />
          <Surprise />
          <RSVP />
        </div>
      </main>
      <Closing />
    </>
  );
}
