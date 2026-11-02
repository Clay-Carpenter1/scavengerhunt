import { hunt } from '../hunt'

type IntroProps = {
  onStart: () => void
}

export function Intro({ onStart }: IntroProps) {
  return (
    <section className="panel intro">
      <p className="eyebrow">{hunt.introEyebrow}</p>
      <h1 className="display">Hey, {hunt.herName}.</h1>
      <h2>{hunt.introTitle}</h2>
      <p className="lede">{hunt.introLine}</p>
      <button type="button" className="btn btn--primary" onClick={onStart}>
        {hunt.introButton}
      </button>
    </section>
  )
}
