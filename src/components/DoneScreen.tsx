import { useEffect, useState } from 'react'
import { hunt } from '../hunt'

const photos = hunt.lastChoice.songs

export function DoneScreen() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const tick = window.setInterval(() => {
      setIndex((current) => (current + 1) % photos.length)
    }, 2000)
    return () => window.clearInterval(tick)
  }, [])

  return (
    <section className="panel done-screen">
      <div className="done-photos" aria-hidden="true">
        {photos.map((song, photoIndex) => (
          <figure
            key={song.id}
            className={`done-photos__frame${photoIndex === index ? ' is-on' : ''}`}
            data-song={song.id}
          >
            <img src={song.image} alt="" />
          </figure>
        ))}
      </div>
      <h1>{hunt.doneTitle}</h1>
      <p className="lede serif">{hunt.doneLine}</p>
    </section>
  )
}
