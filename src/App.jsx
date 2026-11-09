import { useEffect, useRef, useState, useCallback } from 'react'
import wedding from './data/weddingContent.json'
import InvitationCard from './components/InvitationCard/InvitationCard'
import VideoOpening from './components/VideoOpening/VideoOpening'
import BrajBlessingShower from './components/InvitationCard/BrajBlessingShower'

const FADE_MS = 1650
const COUPLE_STAGE_MS = 3300
const TARGET_VOLUME = 0.85

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function App() {
  const hasVideo = typeof wedding.general.videoUrl === 'string' && wedding.general.videoUrl.trim() !== ''
  const musicUrl = typeof wedding.general.musicUrl === 'string' ? wedding.general.musicUrl.trim() : ''
  const hasMusic = musicUrl !== '' && !musicUrl.includes('__')
  const isDirectCard = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('card') === 'true'
  const [phase, setPhase] = useState(isDirectCard ? 'card' : (hasVideo ? 'video' : 'card'))

  const audioRef = useRef(null)
  const fadeRafRef = useRef(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  // Smooth volume ramp helper (fade-in and fade-out)
  const rampVolume = useCallback((audio, fromVol, toVol, durationMs, onDone) => {
    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }

    const startTime = performance.now()
    try {
      audio.volume = Math.max(0, Math.min(1, fromVol))
    } catch {
      // iOS Safari may have read-only volume; fallback gracefully
      if (onDone) onDone()
      return
    }

    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / Math.max(1, durationMs))
      // Smooth cubic ease-in-out curve
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

      const nextVol = fromVol + (toVol - fromVol) * eased
      try {
        audio.volume = Math.max(0, Math.min(1, nextVol))
      } catch {
        // ignore if read-only
      }

      if (progress < 1) {
        fadeRafRef.current = requestAnimationFrame(step)
      } else {
        fadeRafRef.current = null
        if (onDone) onDone()
      }
    }

    fadeRafRef.current = requestAnimationFrame(step)
  }, [])

  // Start music with silky-smooth 1.8s fade-in when center seal is clicked
  const handleSealClick = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !hasMusic) return

    try {
      audio.volume = 0
    } catch {
      // ignore
    }

    audio
      .play()
      .then(() => {
        setIsPlayingAudio(true)
        rampVolume(audio, 0, TARGET_VOLUME, 1800)
      })
      .catch(() => {
        setIsPlayingAudio(false)
      })
  }, [hasMusic, rampVolume])

  // Toggle audio on/off from the side button with smooth volume transitions
  const handleToggleAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !hasMusic) return

    if (isPlayingAudio) {
      setIsPlayingAudio(false)
      const currentVol = typeof audio.volume === 'number' ? audio.volume : TARGET_VOLUME
      rampVolume(audio, currentVol, 0, 480, () => {
        audio.pause()
      })
    } else {
      try {
        audio.volume = 0
      } catch {
        // ignore
      }
      audio
        .play()
        .then(() => {
          setIsPlayingAudio(true)
          rampVolume(audio, 0, TARGET_VOLUME, 900)
        })
        .catch(() => {
          setIsPlayingAudio(false)
        })
    }
  }, [hasMusic, isPlayingAudio, rampVolume])

  useEffect(() => {
    return () => {
      if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'couple') return undefined
    const id = setTimeout(() => setPhase('revealing'), COUPLE_STAGE_MS)
    return () => clearTimeout(id)
  }, [phase])

  useEffect(() => {
    if (phase !== 'revealing') return undefined
    const id = setTimeout(() => setPhase('card'), FADE_MS)
    return () => clearTimeout(id)
  }, [phase])

  const handleComplete = (smooth) => {
    if (smooth && !prefersReducedMotion()) setPhase('couple')
    else setPhase('card')
  }

  const handleCoupleContinue = useCallback(() => {
    setPhase((prev) => (prev === 'couple' ? 'revealing' : prev))
  }, [])

  const showVideo = phase === 'video' || phase === 'couple'
  const showCard = phase === 'couple' || phase === 'revealing' || phase === 'card'
  const showAudioToggle = hasMusic && (phase === 'revealing' || phase === 'card')

  return (
    <div className="app-viewport-root">
      <div className="app-mobile-stage">
        {/* Persistent Wedding Soundtrack Audio (Never unmounts on card transition) */}
        {hasMusic && (
          <audio
            ref={audioRef}
            src={musicUrl}
            loop
            preload="auto"
          />
        )}

        {/* Side Floating Audio Toggle Button with Smooth Entrance */}
        {hasMusic && showAudioToggle && (
          <button
            type="button"
            className={`side-audio-toggle ${isPlayingAudio ? 'is-playing' : 'is-muted'}`}
            onClick={handleToggleAudio}
            aria-label={isPlayingAudio ? 'Mute wedding music' : 'Play wedding music'}
            aria-pressed={isPlayingAudio}
            title={isPlayingAudio ? 'Tap to mute music' : 'Tap to play music'}
          >
            <span className="side-audio-toggle__ring" aria-hidden="true" />
            <span className="side-audio-toggle__icon" aria-hidden="true">
              <span className="side-audio-toggle__bars">
                <span className="side-audio-toggle__bar side-audio-toggle__bar--1" />
                <span className="side-audio-toggle__bar side-audio-toggle__bar--2" />
                <span className="side-audio-toggle__bar side-audio-toggle__bar--3" />
                <span className="side-audio-toggle__bar side-audio-toggle__bar--4" />
              </span>
            </span>
            <span className="side-audio-toggle__label">
              {isPlayingAudio ? 'Music On' : 'Music Off'}
            </span>
          </button>
        )}

        {/* Floating Celestial Pushpa-Varsha & Mor-Pankh Blessing Button (Bottom-Right) */}
        {showAudioToggle && <BrajBlessingShower />}

        {showVideo && (
          <VideoOpening
            leaving={phase === 'couple'}
            onSealClick={handleSealClick}
            onComplete={handleComplete}
          />
        )}
        {showCard && (
          <div className="stage-card">
            <InvitationCard
              introState={phase}
              onCoupleContinue={handleCoupleContinue}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
