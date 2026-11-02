import { useCallback, useEffect, useRef, useState } from 'react'
import type { WheelSlice } from '../slices'

type WheelProps = {
  slices: WheelSlice[]
  targetId: string
  durationMs: number
  disabled?: boolean
  autoSpin?: boolean
  compact?: boolean
  onSpinStart?: () => void
  onSpinEnd?: () => void
}

function polar(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function slicePath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polar(cx, cy, radius, endAngle)
  const end = polar(cx, cy, radius, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${cx} ${cy} L ${end.x} ${end.y} A ${radius} ${radius} 0 ${largeArc} 1 ${start.x} ${start.y} Z`
}

function nextRotation(
  current: number,
  targetIndex: number,
  sliceCount: number,
) {
  const sliceAngle = 360 / sliceCount
  const targetCenter = targetIndex * sliceAngle + sliceAngle / 2
  const currentMod = ((current % 360) + 360) % 360
  const landing = (360 - targetCenter) % 360
  const delta = (landing - currentMod + 360) % 360
  const extraTurns = 7 + Math.floor(Math.random() * 3)
  return current + extraTurns * 360 + delta
}

function spinEase(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function Wheel({
  slices,
  targetId,
  durationMs,
  disabled = false,
  autoSpin = false,
  compact = false,
  onSpinStart,
  onSpinEnd,
}: WheelProps) {
  const [rotation, setRotation] = useState(0)
  const [animating, setAnimating] = useState(false)
  const ended = useRef(false)
  const autoStarted = useRef(false)
  const rotationRef = useRef(0)
  const frameRef = useRef(0)
  const timeoutRef = useRef(0)

  const spinMs = durationMs
  const windUpMs = 180
  const settleMs = 400

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(frameRef.current)
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const spin = useCallback(() => {
    if (disabled || animating || slices.length === 0) return
    const targetIndex = slices.findIndex((slice) => slice.id === targetId)
    if (targetIndex < 0) return

    ended.current = false
    onSpinStart?.()
    setAnimating(true)

    const from = rotationRef.current
    const to = nextRotation(from, targetIndex, slices.length)

    const finish = () => {
      if (ended.current) return
      ended.current = true
      rotationRef.current = to
      setRotation(to)
      setAnimating(false)
      onSpinEnd?.()
    }

    const play = () => {
      const startedAt = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - startedAt) / spinMs)
        const next = from + (to - from) * spinEase(t)
        rotationRef.current = next
        setRotation(next)
        if (t < 1) {
          frameRef.current = window.requestAnimationFrame(tick)
          return
        }
        timeoutRef.current = window.setTimeout(finish, settleMs)
      }
      frameRef.current = window.requestAnimationFrame(tick)
    }

    timeoutRef.current = window.setTimeout(play, windUpMs)
  }, [
    animating,
    disabled,
    onSpinEnd,
    onSpinStart,
    settleMs,
    slices,
    spinMs,
    targetId,
    windUpMs,
  ])

  useEffect(() => {
    if (!autoSpin || autoStarted.current) return
    autoStarted.current = true
    const frame = window.requestAnimationFrame(() => spin())
    return () => window.cancelAnimationFrame(frame)
  }, [autoSpin, spin])

  const size = compact ? 220 : 320
  const cx = 100
  const cy = 100
  const radius = 98
  const sliceAngle = slices.length ? 360 / slices.length : 0

  return (
    <div className={`wheel ${compact ? 'wheel--compact' : ''} ${animating ? 'is-spinning' : ''}`}>
      <div className="wheel__pointer" aria-hidden="true">
        <span />
      </div>
      <div className="wheel__idle">
        <div
          className="wheel__disc"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Spin wheel">
            {slices.map((slice, index) => {
              const start = index * sliceAngle
              const end = start + sliceAngle
              const mid = start + sliceAngle / 2
              const textPos = polar(cx, cy, 62, mid)
              return (
                <g key={slice.id}>
                  <path
                    d={slicePath(cx, cy, radius, start, end)}
                    className={`wheel__slice wheel__slice--${slice.kind}`}
                    style={{ fill: `var(--slice-${(index % 8) + 1})` }}
                  />
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    transform={`rotate(${mid}, ${textPos.x}, ${textPos.y})`}
                    className="wheel__label"
                    fontSize={slice.label.length > 12 ? 5.3 : 6.6}
                  >
                    {slice.label}
                  </text>
                </g>
              )
            })}
            <circle cx={cx} cy={cy} r={22} className="wheel__hub" />
          </svg>
        </div>
      </div>
      {!autoSpin && (
        <button
          type="button"
          className="btn btn--spin"
          onClick={spin}
          disabled={disabled || animating}
        >
          {animating ? 'Wait for it…' : 'SPIN'}
        </button>
      )}
    </div>
  )
}
