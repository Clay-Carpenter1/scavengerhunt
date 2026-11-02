import { hunt, type Stop } from '../hunt'

type ResultCardProps = {
  stop: Stop
  eyebrow?: string
  onDone: () => void
}

export function ResultCard({ stop, eyebrow, onDone }: ResultCardProps) {
  const isSvg = Boolean(stop.image?.endsWith('.svg'))
  const isPolaroid = Boolean(stop.image && !isSvg)

  return (
    <section
      className={`panel result${isPolaroid ? ' result--prize' : ''}`}
      role="dialog"
      aria-labelledby="result-title"
    >
      {isPolaroid && (
        <figure className={`polaroid polaroid--${stop.id}`}>
          <img src={stop.image} alt="" />
          {stop.caption && <figcaption>{stop.caption}</figcaption>}
        </figure>
      )}

      {isSvg && stop.image && (
        <img className="result__photo result__photo--svg is-glowing" src={stop.image} alt="" />
      )}

      <div className="result__copy">
        <p className="eyebrow">{eyebrow ?? hunt.resultEyebrow}</p>
        <h1 id="result-title">{stop.title}</h1>
        <p className="clue">{stop.clue}</p>
        <blockquote className="note">{stop.note}</blockquote>
        <button type="button" className="btn btn--primary" onClick={onDone}>
          {hunt.doneButton}
        </button>
      </div>
    </section>
  )
}
