import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

export type NavDirection = 'forward' | 'back'

const LEAVE_MS = 420

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function phaseOf(key: string) {
  return key.split(':')[0]
}

function skipTransition(fromKey: string, toKey: string) {
  return phaseOf(fromKey) === 'result' && phaseOf(toKey) === 'lastChoice'
}

type StageProps = {
  stageKey: string
  direction: NavDirection
  children: ReactNode
  onLock?: (locked: boolean) => void
}

export function Stage({ stageKey, direction, children, onLock }: StageProps) {
  const shownKey = useRef(stageKey)
  const cache = useRef(children)
  const onLockRef = useRef(onLock)
  const [leaving, setLeaving] = useState<{
    node: ReactNode
    dir: NavDirection
  } | null>(null)

  useLayoutEffect(() => {
    onLockRef.current = onLock
  }, [onLock])

  useLayoutEffect(() => {
    if (stageKey === shownKey.current) {
      cache.current = children
      return
    }

    const outgoing = cache.current
    const dir = direction
    const fromKey = shownKey.current
    shownKey.current = stageKey
    cache.current = children

    if (prefersReducedMotion() || skipTransition(fromKey, stageKey)) {
      setLeaving(null)
      onLockRef.current?.(false)
      return
    }

    setLeaving({ node: outgoing, dir })
    onLockRef.current?.(true)

    const done = window.setTimeout(() => {
      setLeaving(null)
      onLockRef.current?.(false)
    }, LEAVE_MS)

    return () => window.clearTimeout(done)
    // children/direction are from the render where the screen key changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageKey])

  return (
    <main className={`stage${leaving ? ' is-paging' : ''}`}>
      {leaving && (
        <div
          className={`stage__page is-leave is-leave-${leaving.dir}`}
          aria-hidden="true"
        >
          {leaving.node}
        </div>
      )}
      <div
        className={`stage__page is-enter is-enter-${direction}${
          phaseOf(stageKey) === 'lastChoice' ? ' is-instant' : ''
        }`}
      >
        {children}
      </div>
    </main>
  )
}
