import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { eventConfig as event } from '../eventConfig';
import { BotanicalMark } from './Artwork';
import { readSaved, saveLocal } from '../lib/storage';
import { useMotionPreference } from '../hooks/useMotionPreference';
type Answer = { name: string; attendance: 'yes' | 'no'; message: string };
function validAnswer(value: unknown): value is Answer {
  if (typeof value !== 'object' || value === null) return false;
  const answer = value as Record<string, unknown>;
  return (
    typeof answer.name === 'string' &&
    answer.name.trim().length >= 2 &&
    answer.name.length <= 80 &&
    (answer.attendance === 'yes' || answer.attendance === 'no') &&
    typeof answer.message === 'string' &&
    answer.message.length <= 1000
  );
}
export function RSVP() {
  const [saved] = useState(() => readSaved('rsvp', validAnswer));
  const [name, setName] = useState(saved?.name ?? '');
  const [attendance, setAttendance] = useState<'yes' | 'no' | ''>(saved?.attendance ?? '');
  const [message, setMessage] = useState(saved?.message ?? '');
  const [submitted, setSubmitted] = useState(!!saved);
  const [stored, setStored] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; attendance?: string }>({});
  const root = useRef<HTMLElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const firstRadio = useRef<HTMLInputElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const reduce = useMotionPreference();
  useGSAP(
    () => {
      if (!submitted) return;
      gsap.from('.rsvp-confirmation', {
        opacity: 0,
        scale: 0.97,
        duration: reduce ? 0 : 0.5,
        ease: 'power2.out',
      });
      if (!saved) confirmation.current?.focus({ preventScroll: true });
    },
    { scope: root, dependencies: [submitted, reduce], revertOnUpdate: true },
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (name.trim().length < 2)
      nextErrors.name = 'Будь ласка, введіть ім’я — щонайменше 2 символи.';
    if (!attendance) nextErrors.attendance = 'Оберіть, чи зможете приєднатися.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      if (nextErrors.name) nameInput.current?.focus();
      else firstRadio.current?.focus();
      return;
    }
    setStored(saveLocal('rsvp', { name: name.trim(), attendance, message: message.trim() }));
    setName(name.trim());
    setSubmitted(true);
  };
  const edit = () => {
    setSubmitted(false);
    requestAnimationFrame(() => nameInput.current?.focus({ preventScroll: true }));
  };
  return (
    <section className="rsvp-section" id="rsvp" ref={root} aria-labelledby="rsvp-title">
      <div className="rsvp-inner section">
        <div className="rsvp-heading">
          <h2 id="rsvp-title">
            Ви будете
            <br />
            <em>з нами?</em>
          </h2>
          <p>
            Наша історія стане ще теплішою,
            <br />
            якщо ви будете її частиною.
          </p>
          <p className="rsvp-deadline">
            Просимо відповісти
            <br />
            до <strong>{event.rsvpDeadline}</strong>
          </p>
          <BotanicalMark />
        </div>
        <div className="rsvp-form-area">
          {submitted ? (
            <div className="rsvp-confirmation" ref={confirmation} tabIndex={-1} role="status">
              <BotanicalMark />

              <h3>Дякуємо, {name}!</h3>
              <p>
                {attendance === 'yes'
                  ? 'Як же приємно, що ви розділите з нами цей день!'
                  : 'Нам вас бракуватиме. Дякуємо, що дали знати!'}
              </p>
              <p className="local-note">
                {stored
                  ? 'Відповідь збережено лише у цьому браузері. Вона не надіслана організаторам.'
                  : 'Браузер не дозволяє зберегти відповідь. Вона доступна до закриття сторінки й не надіслана організаторам.'}
              </p>
              <button className="text-link" onClick={edit}>
                Змінити відповідь <span aria-hidden="true">↗</span>
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={submit}>
              <div className="form-field">
                <label htmlFor="guest-name">
                  Ваше ім’я <span aria-hidden="true">*</span>
                </label>
                <input
                  ref={nameInput}
                  id="guest-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Як до вас звертатися?"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name ? (
                  <p id="name-error" className="field-error" role="alert">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <fieldset aria-describedby={errors.attendance ? 'attendance-error' : undefined}>
                <legend>
                  Чи зможете приєднатися? <span aria-hidden="true">*</span>
                </legend>
                <div className="attendance-options">
                  <label>
                    <input
                      ref={firstRadio}
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={attendance === 'yes'}
                      onChange={() => {
                        setAttendance('yes');
                        setErrors((prev) => ({ ...prev, attendance: undefined }));
                      }}
                      required
                    />
                    <span>Так, із радістю!</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={attendance === 'no'}
                      onChange={() => {
                        setAttendance('no');
                        setErrors((prev) => ({ ...prev, attendance: undefined }));
                      }}
                    />
                    <span>На жаль, не зможу</span>
                  </label>
                </div>
                {errors.attendance ? (
                  <p id="attendance-error" className="field-error" role="alert">
                    {errors.attendance}
                  </p>
                ) : null}
              </fieldset>
              <div className="form-field message-field">
                <label htmlFor="guest-message">
                  Кілька теплих слів <span className="optional">необов’язково</span>
                </label>
                <textarea
                  id="guest-message"
                  name="message"
                  rows={3}
                  maxLength={1000}
                  placeholder="Побажання, обійми або ваші передчуття…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <button className="button primary save-answer" type="submit">
                Зберегти мою відповідь <span aria-hidden="true">↗</span>
              </button>
              <p className="local-note">
                Відповідь зберігається лише у вашому браузері та не надсилається організаторам.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
