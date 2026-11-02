import { hunt, type Stop } from '../hunt'

type ResultCardProps = {
  stop: Stop
  eyebrow?: string
  onDone: () => void
}

export function ResultCard({ stop, eyebrow, onDone }: ResultCardProps) {
  return (
    <section className="panel result" role="dialog" aria-labelledby="result-title">
      <p className="eyebrow">{eyebrow ?? hunt.resultEyebrow}</p>
      {stop.image && (
        <img
          className={`result__photo${stop.image.endsWith('.svg') ? ' result__photo--svg' : ''}`}
          src={stop.image}
          alt=""
        />
      )}
      <h1 id="result-title">{stop.title}</h1>
      <p className="clue">{stop.clue}</p>
      <blockquote className="note">{stop.note}</blockquote>
      <button type="button" className="btn btn--primary" onClick={onDone}>
        {hunt.doneButton}
      </button>
    </section>
  )
}
