import { useRef, useState, type FormEvent } from "react";
import { quizQuestions, summarizeQuiz, type QuizAnswers } from "../data/quiz";
import { getSource } from "../data/etfs";
import "./InteractiveTools.css";

export function EtfQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRadio = useRef<HTMLInputElement>(null);
  const question = quizQuestions[step];
  const selected = answers[question.id];
  const revealed = !!checked[question.id];
  const result = summarizeQuiz(answers);
  function move(next: number, finish = false) {
    setStep(next);
    setFinished(finish);
    setError("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  function verify(event: FormEvent) {
    event.preventDefault();
    if (!selected) {
      setError("Vyberte jednu odpověď.");
      firstRadio.current?.focus();
      return;
    }
    setChecked({ ...checked, [question.id]: true });
    setError("");
  }
  return (
    <section
      id="cl-quiz"
      className="cl-section cl-wrap"
      aria-labelledby="cl-quiz-title"
    >
      <details className="cl-quiz-disclosure">
        <summary>
          <span>
            <span className="cl-eyebrow">3 otázky • bez e-mailu</span>
            <h2 id="cl-quiz-title">Rozumíte rozdílům? Zkuste si kvíz.</h2>
          </span>
          <span className="cl-quiz-open">Otevřít kvíz</span>
        </summary>
        <div className="cl-quiz-body">
          <p className="cl-tool-lead">
            Krátké ověření pojmů. Každá odpověď dostane vysvětlení; kvíz vám
            nevybírá investici.
          </p>
          {finished ? (
            <div>
              <h3 ref={heading} tabIndex={-1} className="cl-quiz-question">
                Hotovo: {result.score} ze {quizQuestions.length} správně.
              </h3>
              <p>
                {result.score === quizQuestions.length
                  ? "Základní rozdíly máte srovnané. Vysvětlení si můžete připomenout v porovnání."
                  : "Vraťte se k těmto tématům. Odpovědi si můžete projít a upravit."}
              </p>
              {result.review.length > 0 && (
                <ul className="cl-quiz-review">
                  {result.review.map((q) => (
                    <li key={q.id}>
                      <a href={q.anchor}>{q.topic} →</a>
                    </li>
                  ))}
                </ul>
              )}
              <div className="cl-quiz-actions">
                <button
                  type="button"
                  className="cl-tool-secondary"
                  onClick={() => move(0)}
                >
                  Projít odpovědi
                </button>
                <button
                  type="button"
                  className="cl-tool-secondary"
                  onClick={() => {
                    setAnswers({});
                    setChecked({});
                    move(0);
                  }}
                >
                  Zkusit znovu
                </button>
              </div>
              <a className="cl-tool-link" href="#cl-guide">
                Vysvětlení a checklist na později? Prohlédněte si průvodce →
              </a>
            </div>
          ) : (
            <form onSubmit={verify}>
              <p className="cl-quiz-progress">
                Otázka {step + 1} z {quizQuestions.length} • {question.topic}
              </p>
              <h3
                ref={heading}
                tabIndex={-1}
                id="cl-question"
                className="cl-quiz-question"
              >
                {question.question}
              </h3>
              <fieldset
                className="cl-quiz-options"
                aria-describedby="cl-quiz-error"
              >
                <legend className="cl-visually-hidden">
                  {question.question}
                </legend>
                {question.options.map((option, index) => (
                  <label key={option.id} className="cl-quiz-option">
                    <input
                      ref={index === 0 ? firstRadio : undefined}
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={selected === option.id}
                      onChange={() => {
                        setAnswers({ ...answers, [question.id]: option.id });
                        setChecked({ ...checked, [question.id]: false });
                        setError("");
                      }}
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </fieldset>
              <p id="cl-quiz-error" className="cl-tool-error" role="status">
                {error}
              </p>
              <div
                className="cl-quiz-feedback"
                role="status"
                aria-atomic="true"
              >
                {revealed && (
                  <>
                    <strong>
                      {selected === question.correctId
                        ? "Správně."
                        : "Tato odpověď není správná."}
                    </strong>
                    <p>{question.explanation}</p>
                    <a href={question.anchor}>
                      Vrátit se k vysvětlení na stránce →
                    </a>
                    <details>
                      <summary>Podklady k odpovědi</summary>
                      <ul>
                        {question.sourceIds.map((id) => (
                          <li key={id}>
                            <a
                              href={getSource(id).url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {getSource(id).title} ↗
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </>
                )}
              </div>
              <div className="cl-quiz-actions">
                {!revealed ? (
                  <button type="submit" className="cl-button">
                    Ověřit odpověď
                  </button>
                ) : (
                  <button
                    type="button"
                    className="cl-button"
                    onClick={() =>
                      step < quizQuestions.length - 1
                        ? move(step + 1)
                        : move(step, true)
                    }
                  >
                    {step < quizQuestions.length - 1
                      ? "Další otázka"
                      : "Zobrazit shrnutí"}
                  </button>
                )}
                {step > 0 && (
                  <button
                    type="button"
                    className="cl-tool-secondary"
                    onClick={() => move(step - 1)}
                  >
                    Předchozí otázka
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </details>
    </section>
  );
}
