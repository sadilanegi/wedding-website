import { useEffect, useState } from 'react'
import wedding from './data/weddingContent.json'
import InvitationCard from './components/InvitationCard/InvitationCard'
import VideoOpening from './components/VideoOpening/VideoOpening'

const FADE_MS = 1100

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function App() {
  const hasVideo = typeof wedding.general.videoUrl === 'string' && wedding.general.videoUrl.trim() !== ''
  const [phase, setPhase] = useState(hasVideo ? 'video' : 'card')

  useEffect(() => {
    if (phase !== 'revealing') return undefined
    const id = setTimeout(() => setPhase('card'), FADE_MS)
    return () => clearTimeout(id)
  }, [phase])

  const handleComplete = (smooth) => {
    if (smooth && !prefersReducedMotion()) setPhase('revealing')
    else setPhase('card')
  }

  const showVideo = phase === 'video' || phase === 'revealing'
  const showCard = phase === 'card' || phase === 'revealing'

  return (
    <div className="app-viewport-root">
      <div className="app-mobile-stage">
        {showVideo && (
          <VideoOpening leaving={phase === 'revealing'} onComplete={handleComplete} />
        )}
        {showCard && (
          <div className={`stage-card${phase === 'revealing' ? ' is-arriving' : ''}`}>
            <InvitationCard />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
