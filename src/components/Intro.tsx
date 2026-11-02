import { hunt } from '../hunt'

type IntroProps = {
  onStart: () => void
}

export function Intro({ onStart }: IntroProps) {
  return (
    <section className="panel intro">
      <p className="eyebrow">{hunt.introEyebrow}</p>
      <h1 className="display">Tonights Itinerary</h1>
      <p className="lede">{hunt.introLine}</p>
      <section className="rules" aria-label={hunt.rulesTitle}>
        <h2>{hunt.rulesTitle}</h2>
        <ol>
          {hunt.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </section>
      <button type="button" className="btn btn--primary" onClick={onStart}>
        {hunt.introButton}
      </button>
    </section>
  )
}
