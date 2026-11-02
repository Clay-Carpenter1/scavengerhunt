import { hunt, type Stop } from './hunt'

export type SliceKind = 'target' | 'decoy' | 'done' | 'heart' | 'yes'

export type WheelSlice = {
  id: string
  label: string
  kind: SliceKind
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function buildSlices(stepIndex: number, stops: Stop[]): WheelSlice[] {
  const current = stops[stepIndex]
  if (!current) return []

  const slices: WheelSlice[] = [
    {
      id: current.id,
      label: '???',
      kind: current.isFinale ? 'heart' : 'target',
    },
  ]

  const completed = stops.slice(0, stepIndex)
  for (const stop of completed.slice(-2)) {
    slices.push({
      id: `done-${stop.id}`,
      label: '???',
      kind: 'done',
    })
  }

  const decoys = shuffle(hunt.decoys)
  let i = 0
  while (slices.length < 8 && i < decoys.length) {
    slices.push({
      id: `decoy-${stepIndex}-${i}`,
      label: '???',
      kind: 'decoy',
    })
    i += 1
  }

  return shuffle(slices)
}

export function buildYesSlices(): WheelSlice[] {
  return hunt.coyYesLabels.map((label, index) => ({
    id: `yes-${index}`,
    label,
    kind: 'yes' as const,
  }))
}
