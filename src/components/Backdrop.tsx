import { useEffect, useRef } from 'react'

const COLORS = ['#ff2bd6', '#ff4d8d', '#7af6ff', '#3aa0ff', '#ffe14a', '#d07bff', '#5ce1ff']

type Bit = {
  arm: number
  along: number
  jitter: number
  size: number
  spin: number
  speed: number
  color: string
  square: boolean
}

function makeBits(count: number): Bit[] {
  return Array.from({ length: count }, (_, index) => ({
    arm: (index % 5) * ((Math.PI * 2) / 5) + Math.random() * 0.7,
    along: Math.random(),
    jitter: (Math.random() - 0.5) * 0.55,
    size: Math.random() < 0.14 ? 3.4 + Math.random() * 4.5 : 0.8 + Math.random() * 2.2,
    spin: Math.random() * Math.PI,
    speed: 0.1 + Math.random() * 0.42,
    color: COLORS[index % COLORS.length],
    square: Math.random() > 0.22,
  }))
}

export function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const bits = makeBits(reduce ? 120 : 280)
    let frame = 0
    let running = true

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
    }

    const paint = (time: number) => {
      const width = canvas.width
      const height = canvas.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const turn = reduce ? 1.2 : time * 0.00015
      const hubs = [
        { x: width * 0.3, y: height * 0.58, pull: 0.62 },
        { x: width * 0.68, y: height * 0.4, pull: 0.7 },
      ]

      context.setTransform(1, 0, 0, 1, 0, 0)
      context.globalCompositeOperation = 'source-over'
      context.globalAlpha = 1
      context.fillStyle = reduce ? '#070014' : 'rgba(7, 0, 20, 0.42)'
      context.fillRect(0, 0, width, height)

      const glows = [
        { x: width * 0.18, y: height * 0.62, radius: width * 0.34, color: 'rgba(40, 170, 255, 0.28)' },
        { x: width * 0.72, y: height * 0.4, radius: width * 0.4, color: 'rgba(255, 30, 170, 0.26)' },
        { x: width * 0.84, y: height * 0.78, radius: width * 0.24, color: 'rgba(255, 210, 70, 0.16)' },
      ]
      for (const glow of glows) {
        const gradient = context.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius)
        gradient.addColorStop(0, glow.color)
        gradient.addColorStop(1, 'transparent')
        context.fillStyle = gradient
        context.fillRect(0, 0, width, height)
      }

      context.globalCompositeOperation = 'lighter'
      for (const bit of bits) {
        const hub = hubs[Math.floor(bit.arm) % hubs.length]
        const travel = (bit.along + turn * bit.speed) % 1
        const reach = (0.04 + Math.pow(travel, 1.2) * 0.96) * Math.min(width, height) * hub.pull
        const angle = bit.arm + travel * 7.2 + turn * 2.2 + bit.jitter
        const x = hub.x + Math.cos(angle) * reach
        const y = hub.y + Math.sin(angle) * reach * 0.78
        const fade = travel < 0.12 ? travel / 0.12 : 1
        const depth = 0.28 + travel
        const size = bit.size * ratio * depth

        context.save()
        context.translate(x, y)
        context.rotate(bit.spin + turn * 4 + angle)
        context.globalAlpha = fade * 0.95
        context.fillStyle = bit.color
        if (bit.square) {
          context.fillRect(-size / 2, -size / 2, size, size)
        } else {
          context.beginPath()
          context.arc(0, 0, size * 0.42, 0, Math.PI * 2)
          context.fill()
        }
        context.restore()
      }

      context.globalAlpha = 0.16
      const rays = [
        { x: width * 0.24, y: height * 0.56, color: 'rgba(90, 230, 255, 0.95)' },
        { x: width * 0.7, y: height * 0.38, color: 'rgba(255, 50, 190, 0.95)' },
        { x: width * 0.8, y: height * 0.72, color: 'rgba(255, 220, 80, 0.8)' },
      ]
      for (const hub of rays) {
        for (let ray = 0; ray < 7; ray += 1) {
          const angle = turn * 1.6 + (ray / 7) * Math.PI * 2
          const length = Math.min(width, height) * 0.5
          const endX = hub.x + Math.cos(angle) * length
          const endY = hub.y + Math.sin(angle) * length
          const gradient = context.createLinearGradient(hub.x, hub.y, endX, endY)
          gradient.addColorStop(0, hub.color)
          gradient.addColorStop(1, 'transparent')
          context.strokeStyle = gradient
          context.lineWidth = 1.6 * ratio
          context.beginPath()
          context.moveTo(hub.x, hub.y)
          context.lineTo(endX, endY)
          context.stroke()
        }
      }

      context.globalCompositeOperation = 'source-over'
      context.globalAlpha = 1
      if (!reduce && running) frame = window.requestAnimationFrame(paint)
    }

    resize()
    context.fillStyle = '#070014'
    context.fillRect(0, 0, canvas.width, canvas.height)
    window.addEventListener('resize', resize)
    frame = window.requestAnimationFrame(paint)

    return () => {
      running = false
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="backdrop" aria-hidden="true" />
}
