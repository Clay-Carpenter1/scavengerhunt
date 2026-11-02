import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { buzz } from '../buzz'
import { hunt, type SongCard } from '../hunt'

type SongSlotProps = {
  onPick: (song: SongCard) => void
  onSpinStart?: () => void
}

const LOOPS = 8
const GAP = 14
const SPIN_MS = 4200
const WIND_UP_MS = 180
const SETTLE_MS = 400
const LAND_HOLD_MS = 1200

function spinEase(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function SongSlot({ onPick, onSpinStart }: SongSlotProps) {
  const songs = hunt.lastChoice.songs
  const reel = useMemo(
    () => Array.from({ length: LOOPS }, () => songs).flat(),
    [songs],
  )

  const windowRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(songs.length)
  const offsetRef = useRef(0)
  const ended = useRef(false)
  const frameRef = useRef(0)
  const timeoutRef = useRef(0)
  const picked = useRef<SongCard | null>(null)
  const animatingRef = useRef(false)

  const [offset, setOffset] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [landed, setLanded] = useState(false)

  const xForIndex = useCallback(
    (index: number, width = cardWidth) => {
      const windowW = windowRef.current?.clientWidth ?? 0
      if (!windowW || !width) return 0
      return (windowW - width) / 2 - index * (width + GAP)
    },
    [cardWidth],
  )

  useLayoutEffect(() => {
    const node = windowRef.current
    if (!node) return

    const measure = () => {
      const nextWidth = Math.round(node.clientWidth * 0.56)
      setCardWidth(nextWidth)
      if (animatingRef.current) return
      const x = xForIndex(indexRef.current, nextWidth)
      offsetRef.current = x
      setOffset(x)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [xForIndex])

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(frameRef.current)
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const slide = useCallback(() => {
    if (animating || landed || !cardWidth) return

    const n = songs.length
    const current = indexRef.current
    const currentSong = current % n
    const targetSong = Math.floor(Math.random() * n)
    const extraLoops = 4 + Math.floor(Math.random() * 3)
    const steps = extraLoops * n + ((targetSong - currentSong + n) % n)
    const targetIndex = current + steps
    const from = offsetRef.current
    const to = xForIndex(targetIndex)

    ended.current = false
    picked.current = songs[targetSong]
    animatingRef.current = true
    onSpinStart?.()
    setLanded(false)
    setAnimating(true)
    buzz(18)

    const finish = () => {
      if (ended.current) return
      ended.current = true
      indexRef.current = targetIndex
      offsetRef.current = to
      setOffset(to)
      animatingRef.current = false
      setAnimating(false)
      if (picked.current) onPick(picked.current)
    }

    const play = () => {
      const startedAt = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - startedAt) / SPIN_MS)
        const next = from + (to - from) * spinEase(t)
        offsetRef.current = next
        setOffset(next)
        if (t < 1) {
          frameRef.current = window.requestAnimationFrame(tick)
          return
        }
        indexRef.current = targetIndex
        setLanded(true)
        buzz([28, 70, 48, 90, 110])
        timeoutRef.current = window.setTimeout(finish, SETTLE_MS + LAND_HOLD_MS)
      }
      frameRef.current = window.requestAnimationFrame(tick)
    }

    timeoutRef.current = window.setTimeout(play, WIND_UP_MS)
  }, [animating, cardWidth, landed, onPick, onSpinStart, songs, xForIndex])

  return (
    <section className="panel song-pick">
      <p className="eyebrow">{hunt.lastChoice.eyebrow}</p>
      <h1>{hunt.lastChoice.title}</h1>
      <p className="lede">{hunt.lastChoice.lede}</p>
      <div
        className={`song-slot ${animating ? 'is-spinning' : ''} ${landed ? 'is-landed' : ''}`}
      >
        <div className="song-slot__pointer" aria-hidden="true">
          <span />
        </div>
        <div className="song-slot__window" ref={windowRef} onClick={slide}>
          <div
            className="song-slot__track"
            style={{
              gap: GAP,
              transform: `translate3d(${offset}px, 0, 0)`,
            }}
          >
            {reel.map((song, index) => (
              <article
                key={`${song.id}-${index}`}
                className="song-slot__card"
                data-song={song.id}
                style={{ width: cardWidth || undefined }}
              >
                <img src={song.image} alt="" />
                <span className="song-slot__meta">
                  <span className="song-slot__title">{song.title}</span>
                  <span className="song-slot__artist">{song.artist}</span>
                </span>
              </article>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="btn btn--spin"
          onClick={slide}
          disabled={animating || landed}
        >
          {landed ? 'There it is.' : animating ? 'Wait for it…' : 'TAP'}
        </button>
      </div>
      <p className="song-slot__hint">Windows down, if you want.</p>
    </section>
  )
}
