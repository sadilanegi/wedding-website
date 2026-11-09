import { useEffect, useRef, useState } from 'react'
import wedding from '../../data/weddingContent.json'
import { requestMotionPermission } from '../../utils/use3DCardTilt'
import './VideoOpening.css'

export const VIDEO_SRC = wedding.general.videoUrl

const SEAL_FADE_MS = 900

export default function VideoOpening({ onComplete, onSealClick, leaving = false }) {
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
    // Trigger background wedding music with smooth fade-in on direct user tap
    if (onSealClick) onSealClick()
    // Request iOS motion permission on direct user tap of wax seal
    requestMotionPermission().catch(() => {})
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
        muted
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
          <span className="video-open__seal-wrapper">
            <span className="video-open__seal-halo" aria-hidden="true" />
            <img
              className="video-open__seal"
              src="/gold-wax-seal.png"
              alt=""
              draggable="false"
            />
          </span>
          <span className="video-open__shloka" lang="sa">॥ श्री राधाकृष्णाय नमः ॥</span>
          <span className="video-open__hint">{wedding.general.instructionTap}</span>
        </button>
      )}
    </section>
  )
}
