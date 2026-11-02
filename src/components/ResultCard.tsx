import { useEffect, useState, type ChangeEvent } from 'react'
import { hunt, type Stop } from '../hunt'

type ResultCardProps = {
  stop: Stop
  eyebrow?: string
  onDone: () => void
  camera?: boolean
}

export function ResultCard({ stop, eyebrow, onDone, camera = false }: ResultCardProps) {
  const [shot, setShot] = useState<string | null>(null)
  const isSvg = Boolean(stop.image?.endsWith('.svg'))
  const isPolaroid = Boolean(stop.image && !isSvg)

  useEffect(() => {
    return () => {
      if (shot) URL.revokeObjectURL(shot)
    }
  }, [shot])

  const onShot = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setShot(URL.createObjectURL(file))
  }

  return (
    <section
      className={`panel result${isPolaroid || camera ? ' result--prize' : ''}`}
      role="dialog"
      aria-labelledby="result-title"
    >
      {camera && (
        <label className="polaroid polaroid--camera">
          <input
            className="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onShot}
          />
          {shot ? (
            <img src={shot} alt="" />
          ) : (
            <span className="camera-well">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <rect
                  x="4.5"
                  y="7.5"
                  width="23"
                  height="17"
                  rx="3.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                />
                <circle cx="11.2" cy="13.4" r="2.1" fill="currentColor" />
                <path
                  d="M8.8 21.4 14 16.6l3.4 3.2 4.2-5.1 5.1 6.7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Open the camera</span>
            </span>
          )}
        </label>
      )}

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
