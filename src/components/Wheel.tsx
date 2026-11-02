import { useCallback, useEffect, useRef, useState } from 'react'
import { buzz } from '../buzz'
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

function rotationOf(element: HTMLElement) {
  const transform = getComputedStyle(element).transform
  if (!transform || transform === 'none') return 0
  const matrix = new DOMMatrix(transform)
  return (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI
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
  const [animating, setAnimating] = useState(false)
  const [landed, setLanded] = useState(false)
  const ended = useRef(false)
  const autoStarted = useRef(false)
  const rotationRef = useRef(0)
  const discRef = useRef<HTMLDivElement>(null)
  const spinAnimRef = useRef<Animation | null>(null)
  const timeoutRef = useRef(0)

  const spinMs = durationMs
  const settleMs = 400
  const landHoldMs = 1200

  useEffect(() => {
    return () => {
      spinAnimRef.current?.cancel()
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const spin = useCallback(() => {
    const disc = discRef.current
    if (!disc || disabled || animating || slices.length === 0) return
    const targetIndex = slices.findIndex((slice) => slice.id === targetId)
    if (targetIndex < 0) return

    ended.current = false
    onSpinStart?.()
    setLanded(false)
    setAnimating(true)
    buzz(18)

    const idle = disc.parentElement
    if (idle instanceof HTMLElement) {
      const tilt = rotationOf(idle)
      idle.style.animation = 'none'
      idle.style.transform = `rotate(${tilt}deg)`
      idle.animate(
        [{ transform: `rotate(${tilt}deg)` }, { transform: 'none' }],
        { duration: 420, easing: 'ease-out', fill: 'forwards' },
      )
      window.requestAnimationFrame(() => {
        idle.style.animation = ''
        idle.style.transform = ''
      })
    }

    const from = rotationRef.current
    const to = nextRotation(from, targetIndex, slices.length)
    rotationRef.current = to

    const finish = () => {
      if (ended.current) return
      ended.current = true
      setAnimating(false)
      onSpinEnd?.()
    }

    const land = () => {
      setLanded(true)
      buzz([28, 70, 48, 90, 110])
      timeoutRef.current = window.setTimeout(finish, settleMs + landHoldMs)
    }

    spinAnimRef.current?.cancel()

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      disc.style.transform = `rotate(${to}deg)`
      land()
      return
    }

    const animation = disc.animate(
      [
        { transform: `rotate(${from}deg)` },
        { transform: `rotate(${to}deg)` },
      ],
      {
        duration: spinMs,
        easing: 'cubic-bezier(0.18, 0.45, 0.22, 1)',
        fill: 'forwards',
      },
    )
    spinAnimRef.current = animation
    animation.onfinish = () => {
      if (spinAnimRef.current !== animation) return
      land()
    }
  }, [
    animating,
    disabled,
    onSpinEnd,
    onSpinStart,
    landHoldMs,
    settleMs,
    slices,
    spinMs,
    targetId,
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
    <div
      className={`wheel ${compact ? 'wheel--compact' : ''} ${animating ? 'is-spinning' : ''} ${landed ? 'is-landed' : ''}`}
    >
      <div className="wheel__pointer" aria-hidden="true">
        <span />
      </div>
      <div className="wheel__idle">
        <div ref={discRef} className="wheel__disc">
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
          {landed ? 'There it is.' : animating ? 'Wait for it…' : 'SPIN'}
        </button>
      )}
    </div>
  )
}
