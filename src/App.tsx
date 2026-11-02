import { useRef, useState } from 'react'
import { ChoiceGrid } from './components/ChoiceGrid'
import { Intro } from './components/Intro'
import { ResultCard } from './components/ResultCard'
import { Wheel } from './components/Wheel'
import { hunt, themeMotion } from './hunt'
import { useHunt } from './hooks/useHunt'
import './App.css'

function Brand({ onReset }: { onReset: () => void }) {
  const timer = useRef<number>(0)

  return (
    <h1
      className="brand"
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={() => {
        timer.current = window.setTimeout(onReset, 800)
      }}
      onPointerUp={() => window.clearTimeout(timer.current)}
      onPointerLeave={() => window.clearTimeout(timer.current)}
    >
      {hunt.siteTitle}
    </h1>
  )
}

function App() {
  const huntState = useHunt()
  const [spinLocked, setSpinLocked] = useState(false)
  const stop = huntState.stop

  const startNight = () => {
    setSpinLocked(false)
    huntState.begin()
  }

  const finishStop = () => {
    setSpinLocked(false)
    huntState.completeStop()
  }

  const goBack = () => {
    setSpinLocked(false)
    huntState.goBack()
  }

  const goForward = () => {
    setSpinLocked(false)
    huntState.goForward()
  }

  return (
    <div className="app">
      <div className="glow" aria-hidden="true" />
      <header className="top">
        <div className="top-slot">
          {huntState.phase !== 'intro' && (
            <button
              type="button"
              className="back"
              onClick={goBack}
              disabled={spinLocked}
            >
              ← Back
            </button>
          )}
        </div>
        <Brand onReset={huntState.reset} />
        <div className="top-slot top-slot--end">
          {huntState.canGoForward && (
            <button
              type="button"
              className="back back--forward"
              onClick={goForward}
              disabled={spinLocked}
            >
              Forward →
            </button>
          )}
        </div>
      </header>

      <main className="stage">
        {huntState.phase === 'intro' && <Intro onStart={startNight} />}

        {huntState.phase === 'wheel' && stop && (
          <section className="panel wheel-screen">
            <p className="eyebrow">{hunt.spinLabels[huntState.theme]}</p>
            <Wheel
              slices={huntState.slices}
              targetId={stop.id}
              durationMs={themeMotion[huntState.theme].spinMs}
              disabled={spinLocked}
              onSpinStart={() => setSpinLocked(true)}
              onSpinEnd={huntState.landSpin}
            />
          </section>
        )}

        {huntState.phase === 'result' && stop && (
          <ResultCard stop={stop} onDone={finishStop} />
        )}

        {huntState.phase === 'choice' && (
          <ChoiceGrid
            eyebrow={hunt.choice.eyebrow}
            title={hunt.choice.title}
            lede={hunt.choice.lede}
            options={hunt.choice.options}
            onPick={huntState.pickChoice}
          />
        )}

        {huntState.phase === 'choiceResult' && huntState.selectedChoice && (
          <ResultCard
            stop={{
              id: huntState.selectedChoice.id,
              wheelLabel: huntState.selectedChoice.label,
              title: huntState.selectedChoice.afterTitle,
              clue: huntState.selectedChoice.afterClue,
              note: huntState.selectedChoice.afterNote,
              theme: 'warm',
            }}
            eyebrow={`${hunt.choice.resultEyebrow} ${huntState.selectedChoice.label.toLowerCase()}`}
            onDone={huntState.completeChoice}
          />
        )}

        {huntState.phase === 'lastChoice' && (
          <ChoiceGrid
            eyebrow={hunt.lastChoice.eyebrow}
            title={hunt.lastChoice.title}
            lede={hunt.lastChoice.lede}
            options={hunt.lastChoice.options}
            onPick={huntState.pickLastChoice}
          />
        )}

        {huntState.phase === 'lastChoiceResult' && huntState.selectedLastChoice && (
          <ResultCard
            stop={{
              id: huntState.selectedLastChoice.id,
              wheelLabel: huntState.selectedLastChoice.label,
              title: huntState.selectedLastChoice.afterTitle,
              clue: huntState.selectedLastChoice.afterClue,
              note: huntState.selectedLastChoice.afterNote,
              theme: 'finale',
            }}
            eyebrow={`${hunt.lastChoice.resultEyebrow} ${huntState.selectedLastChoice.label.toLowerCase()}`}
            onDone={huntState.completeLastChoice}
          />
        )}

        {huntState.phase === 'done' && (
          <section className="panel result">
            <h1>{hunt.doneTitle}</h1>
            <p className="lede serif">{hunt.doneLine}</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
