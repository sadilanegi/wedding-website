import { useEffect, useRef, useState } from 'react'
import wedding from '../../data/weddingContent.json'
import './VideoOpening.css'

export const VIDEO_SRC = wedding.general.videoUrl

const SEAL_FADE_MS = 900

export default function VideoOpening({ onComplete, leaving = false }) {
  const videoRef = useRef(null)
  const finishedRef = useRef(false)
  const [seal, setSeal] = useState('resting')

  const finish = (smooth) => {
    if (finishedRef.current) return
    finishedRef.current = true
    onComplete(smooth)
  }

  useEffect(() => {
    if (seal !== 'leaving') return undefined
    const id = setTimeout(() => setSeal('gone'), SEAL_FADE_MS)
    return () => clearTimeout(id)
  }, [seal])

  const play = () => {
    if (seal !== 'resting') return
    const video = videoRef.current
    if (!video) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setSeal(reduce ? 'gone' : 'leaving')
    video.play().catch(() => finish(false))
  }

  return (
    <section className={`video-open${leaving ? ' is-leaving' : ''}`} aria-label="Invitation opening">
      <video
        ref={videoRef}
        className="video-open__media"
        src={VIDEO_SRC}
        playsInline
        preload="auto"
        onEnded={() => finish(true)}
        onError={() => finish(false)}
      />
      {seal !== 'gone' && (
        <button
          type="button"
          className={`video-open__tap${seal === 'leaving' ? ' is-leaving' : ''}`}
          onClick={play}
        >
          <img
            className="video-open__seal"
            src="/gold-wax-seal.png"
            alt=""
            draggable="false"
          />
          <span className="video-open__hint">{wedding.general.instructionTap}</span>
        </button>
      )}
    </section>
  )
}
