import { useEffect, useState, type ChangeEvent } from 'react'
import { hunt, type Stop } from '../hunt'

type ResultCardProps = {
  stop: Stop
  eyebrow?: string
  onDone: () => void
  camera?: boolean
  appUrl?: string
}

export function ResultCard({
  stop,
  eyebrow,
  onDone,
  camera = false,
  appUrl,
}: ResultCardProps) {
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
      className={`panel result${isPolaroid || camera || appUrl ? ' result--prize' : ''}`}
      role="dialog"
      aria-labelledby="result-title"
    >
      {appUrl && (
        <a className="polaroid polaroid--camera" href={appUrl}>
          <span className="camera-well">
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <ellipse cx="14" cy="34" rx="6.2" ry="4.6" transform="rotate(-22 14 34)" fill="currentColor" />
              <ellipse cx="30.5" cy="30.5" rx="6.2" ry="4.6" transform="rotate(-22 30.5 30.5)" fill="currentColor" />
              <path
                d="M19.2 33.2V12.5l17.3-3.8v20.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.2 12.5h17.3"
                fill="none"
                stroke="currentColor"
                strokeWidth="4.4"
                strokeLinecap="round"
              />
            </svg>
            <span>Open Spotify</span>
          </span>
        </a>
      )}

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
