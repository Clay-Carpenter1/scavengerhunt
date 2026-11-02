export type Phase =
  | 'intro'
  | 'wheel'
  | 'result'
  | 'choice'
  | 'choiceResult'
  | 'lastChoice'
  | 'lastChoiceResult'
  | 'done'

export type HuntSave = {
  stepIndex: number
  phase: Phase
  choiceId?: string
  lastChoiceId?: string
}

const KEY = 'girlfriend-hunt-v3'

export function loadHunt(): HuntSave | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<HuntSave>
    if (
      typeof parsed.stepIndex !== 'number' ||
      typeof parsed.phase !== 'string'
    ) {
      return null
    }
    return {
      stepIndex: parsed.stepIndex,
      phase: parsed.phase as Phase,
      choiceId: typeof parsed.choiceId === 'string' ? parsed.choiceId : undefined,
      lastChoiceId:
        typeof parsed.lastChoiceId === 'string' ? parsed.lastChoiceId : undefined,
    }
  } catch {
    return null
  }
}

export function saveHunt(state: HuntSave) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function clearHunt() {
  localStorage.removeItem(KEY)
}

export function consumeResetParam() {
  const params = new URLSearchParams(window.location.search)
  if (!params.has('reset')) return false
  params.delete('reset')
  const query = params.toString()
  const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  window.history.replaceState({}, '', url)
  return true
}
