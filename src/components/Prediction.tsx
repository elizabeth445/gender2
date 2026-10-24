import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PredictionElephant } from './PredictionElephant';
import { readSaved, saveLocal } from '../lib/storage';
import { useMotionPreference } from '../hooks/useMotionPreference';
type Prediction = 'boy' | 'girl';
const options = [
  { value: 'boy', label: 'Хлопчик', animal: 'elephant-blue', note: 'Маленький дослідник' },
  { value: 'girl', label: 'Дівчинка', animal: 'elephant-pink', note: 'Маленька мрійниця' },
] as const;
export function Prediction() {
  const [choice, setChoice] = useState<Prediction | null>(() =>
    readSaved('prediction', (value): value is Prediction => value === 'boy' || value === 'girl'),
  );
  const [stored, setStored] = useState(true);
  const root = useRef<HTMLElement>(null);
  const flutter = useRef<gsap.core.Timeline | null>(null);
  const reduce = useMotionPreference();
  const { contextSafe } = useGSAP(
    () => {
      if (reduce) {
        flutter.current?.kill();
        gsap.set('.ear-flutter', { attr: { scale: 0 } });
        gsap.set('.prediction-response', { clearProps: 'opacity,transform' });
      }
    },
    { scope: root, dependencies: [reduce] },
  );
  const select = (value: Prediction) =>
    contextSafe(() => {
      setChoice(value);
      setStored(saveLocal('prediction', value));
      flutter.current?.kill();
      gsap.set('.ear-flutter', { attr: { scale: 0 } });
      if (!reduce) {
        const ears = `[data-choice="${value}"] .ear-flutter`;
        flutter.current = gsap
          .timeline({ defaults: { ease: 'sine.inOut' } })
          .to(ears, { attr: { scale: 46 }, duration: 0.22 })
          .to(ears, { attr: { scale: -32 }, duration: 0.25 })
          .to(ears, { attr: { scale: 25 }, duration: 0.2 })
          .to(ears, { attr: { scale: 0 }, duration: 0.3 });
        gsap.fromTo(
          '.prediction-response',
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.5, overwrite: true },
        );
      }
    })();
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
                <PredictionElephant name={option.animal} />
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
