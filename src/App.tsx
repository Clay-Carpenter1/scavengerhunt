import { useRef, useState } from 'react'
import { ChoiceGrid } from './components/ChoiceGrid'
import { DoneScreen } from './components/DoneScreen'
import { Intro } from './components/Intro'
import { ResultCard } from './components/ResultCard'
import { SongSlot } from './components/SongSlot'
import { Stage, type NavDirection } from './components/Stage'
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
  const [pageLocked, setPageLocked] = useState(false)
  const [direction, setDirection] = useState<NavDirection>('forward')
  const stop = huntState.stop
  const locked = spinLocked || pageLocked

  const startNight = () => {
    setSpinLocked(false)
    setDirection('forward')
    huntState.begin()
  }

  const finishStop = () => {
    setSpinLocked(false)
    setPageLocked(false)
    setDirection('forward')
    huntState.completeStop()
  }

  const goBack = () => {
    setSpinLocked(false)
    setDirection('back')
    huntState.goBack()
  }

  const goForward = () => {
    setSpinLocked(false)
    setDirection('forward')
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
              disabled={locked}
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
              disabled={locked}
            >
              Forward →
            </button>
          )}
        </div>
      </header>

      {huntState.phase === 'lastChoice' ? (
        <main className="stage stage--plain">
          <SongSlot
            onPick={(song) => {
              setSpinLocked(false)
              setDirection('forward')
              huntState.pickLastChoice(song)
            }}
            onSpinStart={() => setSpinLocked(true)}
          />
        </main>
      ) : huntState.phase === 'done' ? (
        <main className="stage stage--plain">
          <DoneScreen />
        </main>
      ) : (
      <Stage
        stageKey={`${huntState.phase}:${huntState.stepIndex}:${huntState.selectedChoice?.id ?? ''}:${huntState.selectedLastChoice?.id ?? ''}`}
        direction={direction}
        onLock={setPageLocked}
      >
        {huntState.phase === 'intro' && <Intro onStart={startNight} />}

        {huntState.phase === 'wheel' && stop && (
          <section className="panel wheel-screen">
            <p className="eyebrow">{hunt.spinLabels[huntState.theme]}</p>
            <Wheel
              slices={huntState.slices}
              targetId={stop.id}
              durationMs={themeMotion[huntState.theme].spinMs}
              disabled={locked}
              onSpinStart={() => setSpinLocked(true)}
              onSpinEnd={() => {
                setDirection('forward')
                huntState.landSpin()
              }}
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
            onPick={(option) => {
              if (option.appUrl) window.location.assign(option.appUrl)
              setDirection('forward')
              huntState.pickChoice(option)
            }}
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
            camera={huntState.selectedChoice.camera}
            appUrl={huntState.selectedChoice.appUrl}
            onDone={() => {
              setDirection('forward')
              huntState.completeChoice()
            }}
          />
        )}

        {huntState.phase === 'lastChoiceResult' && huntState.selectedLastChoice && (
          <ResultCard
            stop={{
              id: huntState.selectedLastChoice.id,
              wheelLabel: huntState.selectedLastChoice.title,
              title: huntState.selectedLastChoice.title,
              clue: hunt.lastChoice.afterClue,
              note: hunt.lastChoice.afterNote,
              theme: 'finale',
              image: huntState.selectedLastChoice.image,
              caption: huntState.selectedLastChoice.artist,
            }}
            eyebrow={hunt.lastChoice.resultEyebrow}
            onDone={() => {
              setDirection('forward')
              huntState.completeLastChoice()
            }}
          />
        )}

      </Stage>
      )}
    </div>
  )
}

export default App
