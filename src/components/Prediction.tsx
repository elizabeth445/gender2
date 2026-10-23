import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Artwork } from './Artwork';
import { readSaved, saveLocal } from '../lib/storage';
import { useMotionPreference } from '../hooks/useMotionPreference';
type Prediction = 'boy' | 'girl';
const options = [
  { value: 'boy', label: 'Хлопчик', animal: 'giraffe', note: 'Маленький дослідник' },
  { value: 'girl', label: 'Дівчинка', animal: 'elephant', note: 'Маленька мрійниця' },
] as const;
export function Prediction() {
  const [choice, setChoice] = useState<Prediction | null>(() =>
    readSaved('prediction', (value): value is Prediction => value === 'boy' || value === 'girl'),
  );
  const [stored, setStored] = useState(true);
  const root = useRef<HTMLElement>(null);
  const reduce = useMotionPreference();
  const { contextSafe } = useGSAP({ scope: root });
  const select = contextSafe((value: Prediction) => {
    setChoice(value);
    setStored(saveLocal('prediction', value));
    if (!reduce) {
      gsap.fromTo(
        `[data-choice="${value}"]`,
        { rotation: value === 'boy' ? -3 : 3, y: 0 },
        { rotation: 0, y: -5, duration: 0.6, ease: 'back.out(1.4)', overwrite: true },
      );
      gsap.fromTo(
        '.prediction-response',
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.5, overwrite: true },
      );
    }
  });
  return (
    <section
      className="prediction section"
      id="prediction"
      ref={root}
      aria-labelledby="prediction-title"
    >
      <div className="prediction-heading">
        <h2 id="prediction-title">
          А як гадаєте <em>ви?</em>
        </h2>
        <p>
          Прислухайтеся до серця.
          <br />
          Яку таємницю бережуть наші джунглі?
        </p>
        <span className="handwritten prediction-note">Тут немає неправильних відповідей!</span>
      </div>
      <div className="prediction-play">
        <div className="prediction-options" role="group" aria-label="Ваш прогноз">
          {options.map((option) => (
            <button
              key={option.value}
              className={`prediction-tag ${choice === option.value ? 'selected' : ''}`}
              aria-pressed={choice === option.value}
              data-choice={option.value}
              onClick={() => select(option.value)}
            >
              <span className="tag-hole" aria-hidden="true" />
              <span className="tag-art">
                <Artwork name={option.animal} />
              </span>
              <span className="tag-title">{option.label}</span>
              <span className="tag-note">{option.note}</span>
              <span className="tag-check" aria-hidden="true">
                {choice === option.value ? '✓' : '+'}
              </span>
            </button>
          ))}
        </div>
        <div className="prediction-response" role="status" aria-live="polite">
          {choice ? (
            <>
              <span className="small-sprout" aria-hidden="true">
                ✧
              </span>
              <p>
                {stored ? 'Ваш прогноз збережено!' : 'Ваш прогноз обрано.'}
                <br />
                <span>
                  {stored
                    ? 'Скоро дізнаємося, хто мав рацію.'
                    : 'Браузер не дозволяє зберегти його після закриття.'}
                </span>
              </p>
            </>
          ) : (
            <p>Торкніться своєї відповіді — нехай це буде маленький секрет.</p>
          )}
        </div>
      </div>
    </section>
  );
}
