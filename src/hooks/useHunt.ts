import { useCallback, useEffect, useMemo, useState } from 'react'
import { hunt, type ChoiceOption } from '../hunt'
import { buildSlices } from '../slices'
import {
  clearHunt,
  consumeResetParam,
  loadHunt,
  saveHunt,
  type Phase,
} from '../storage'

function emptyState() {
  return {
    stepIndex: 0,
    phase: 'intro' as Phase,
    choiceId: undefined as string | undefined,
    lastChoiceId: undefined as string | undefined,
  }
}

function initialState() {
  if (typeof window !== 'undefined' && consumeResetParam()) {
    clearHunt()
    return emptyState()
  }
  return loadHunt() ?? emptyState()
}

const andysIndex = hunt.stops.findIndex((item) => item.id === hunt.choice.afterStopId)
const lastStopIndex = hunt.stops.length - 1

export function useHunt() {
  const [{ stepIndex, phase, choiceId, lastChoiceId }, setState] =
    useState(initialState)
  const [slices, setSlices] = useState(() =>
    buildSlices(initialState().stepIndex, hunt.stops),
  )

  const stop = hunt.stops[stepIndex]
  const selectedChoice = hunt.choice.options.find((option) => option.id === choiceId)
  const selectedLastChoice = hunt.lastChoice.options.find(
    (option) => option.id === lastChoiceId,
  )
  const theme =
    phase === 'intro'
      ? 'playful'
      : phase === 'choice' || phase === 'choiceResult'
        ? 'warm'
        : phase === 'lastChoice' || phase === 'lastChoiceResult' || phase === 'done'
          ? 'finale'
          : (stop?.theme ?? 'playful')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    saveHunt({ stepIndex, phase, choiceId, lastChoiceId })
  }, [choiceId, lastChoiceId, phase, stepIndex])

  const completedCount = useMemo(() => {
    if (phase === 'intro') return 0
    if (phase === 'choice' || phase === 'choiceResult') return 1
    if (phase === 'lastChoice' || phase === 'lastChoiceResult' || phase === 'done') {
      return hunt.stops.length + 1
    }
    return stepIndex + (stepIndex > andysIndex ? 1 : 0)
  }, [phase, stepIndex])

  const begin = useCallback(() => {
    setSlices(buildSlices(0, hunt.stops))
    setState({
      stepIndex: 0,
      phase: 'wheel',
      choiceId: undefined,
      lastChoiceId: undefined,
    })
  }, [])

  const landSpin = useCallback(() => {
    setState((current) => ({ ...current, phase: 'result' }))
  }, [])

  const completeStop = useCallback(() => {
    if (stop?.id === hunt.choice.afterStopId) {
      setState((current) => ({ ...current, phase: 'choice' }))
      return
    }

    const nextIndex = stepIndex + 1
    const nextStop = hunt.stops[nextIndex]
    if (!nextStop) {
      setState((current) => ({ ...current, phase: 'lastChoice' }))
      return
    }
    setSlices(buildSlices(nextIndex, hunt.stops))
    setState((current) => ({ ...current, stepIndex: nextIndex, phase: 'wheel' }))
  }, [stepIndex, stop])

  const pickChoice = useCallback((option: ChoiceOption) => {
    setState((current) => ({
      ...current,
      choiceId: option.id,
      phase: 'choiceResult',
    }))
  }, [])

  const completeChoice = useCallback(() => {
    const nextIndex = andysIndex + 1
    setSlices(buildSlices(nextIndex, hunt.stops))
    setState((current) => ({
      ...current,
      stepIndex: nextIndex,
      phase: 'wheel',
    }))
  }, [])

  const pickLastChoice = useCallback((option: ChoiceOption) => {
    setState((current) => ({
      ...current,
      lastChoiceId: option.id,
      phase: 'lastChoiceResult',
    }))
  }, [])

  const completeLastChoice = useCallback(() => {
    setState((current) => ({ ...current, phase: 'done' }))
  }, [])

  const reset = useCallback(() => {
    clearHunt()
    setSlices(buildSlices(0, hunt.stops))
    setState(emptyState())
  }, [])

  const goForward = useCallback(() => {
    if (phase === 'intro') {
      begin()
      return
    }

    if (phase === 'wheel') {
      setState((current) => ({ ...current, phase: 'result' }))
      return
    }

    if (phase === 'result') {
      completeStop()
      return
    }

    if (phase === 'choice') {
      pickChoice(selectedChoice ?? hunt.choice.options[0])
      return
    }

    if (phase === 'choiceResult') {
      completeChoice()
      return
    }

    if (phase === 'lastChoice') {
      pickLastChoice(selectedLastChoice ?? hunt.lastChoice.options[0])
      return
    }

    if (phase === 'lastChoiceResult') {
      completeLastChoice()
    }
  }, [
    begin,
    completeChoice,
    completeLastChoice,
    completeStop,
    phase,
    pickChoice,
    pickLastChoice,
    selectedChoice,
    selectedLastChoice,
  ])

  const canGoForward = phase !== 'done'

  const goBack = useCallback(() => {
    if (phase === 'done') {
      setState((current) => ({ ...current, phase: 'lastChoiceResult' }))
      return
    }

    if (phase === 'lastChoiceResult') {
      setState((current) => ({ ...current, phase: 'lastChoice' }))
      return
    }

    if (phase === 'lastChoice') {
      setState((current) => ({
        ...current,
        stepIndex: lastStopIndex,
        phase: 'result',
      }))
      return
    }

    if (phase === 'choiceResult') {
      setState((current) => ({ ...current, phase: 'choice' }))
      return
    }

    if (phase === 'choice') {
      setState((current) => ({
        ...current,
        stepIndex: andysIndex,
        phase: 'result',
      }))
      return
    }

    if (phase === 'result') {
      setState((current) => ({ ...current, phase: 'wheel' }))
      return
    }

    if (phase === 'wheel' && stepIndex === 0) {
      setState(emptyState())
      return
    }

    if (phase === 'wheel' && stepIndex === andysIndex + 1) {
      setState((current) => ({ ...current, phase: 'choice' }))
      return
    }

    if (phase === 'wheel') {
      const prev = stepIndex - 1
      setSlices(buildSlices(prev, hunt.stops))
      setState((current) => ({ ...current, stepIndex: prev, phase: 'result' }))
    }
  }, [phase, stepIndex])

  return {
    phase,
    stepIndex,
    stop,
    theme,
    slices,
    completedCount,
    selectedChoice,
    selectedLastChoice,
    begin,
    landSpin,
    completeStop,
    pickChoice,
    completeChoice,
    pickLastChoice,
    completeLastChoice,
    reset,
    goBack,
    goForward,
    canGoForward,
  }
}
