import { useState, useCallback, useRef, useEffect } from 'react'
import { PeacockFeatherIcon } from './Ornaments'
import './BrajBlessingShower.css'

const SPIRITUAL_BLESSINGS = [
  '॥ राधे राधे • Divine Love & Eternal Bliss! ॥',
  '॥ जय श्री कृष्ण • May Lord Krishna Bless Sumit & Prachi! ॥',
  '॥ सदा सौभाग्यवती भव • Bound by Sacred Vows! ॥',
  '॥ ॐ नमो भगवते वासुदेवाय • Joy, Harmony & Grace! ॥',
  '॥ दिव्य प्रेम & अखंड सौभाग्य • An Auspicious Beginning! ॥',
]

const PARTICLE_TYPES = ['peacock', 'lotus', 'gold', 'marigold']

export default function BrajBlessingShower({ introState = 'card' }) {
  const [particles, setParticles] = useState([])
  const [blessingMessage, setBlessingMessage] = useState(null)
  const [blessingCount, setBlessingCount] = useState(108) // Auspicious 108 starting count
  const [isPressing, setIsPressing] = useState(false)
  const msgTimeoutRef = useRef(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (msgTimeoutRef.current) clearTimeout(msgTimeoutRef.current)
    }
  }, [])

  const triggerShower = useCallback(() => {
    // Mobile haptic pulse
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([30, 40, 30])
      } catch {
        // ignore
      }
    }

    setBlessingCount((prev) => prev + 1)
    setIsPressing(true)
    setTimeout(() => setIsPressing(false), 240)

    // Random spiritual blessing message
    const randomMsg = SPIRITUAL_BLESSINGS[Math.floor(Math.random() * SPIRITUAL_BLESSINGS.length)]
    setBlessingMessage(randomMsg)
    if (msgTimeoutRef.current) clearTimeout(msgTimeoutRef.current)
    msgTimeoutRef.current = setTimeout(() => {
      setBlessingMessage(null)
    }, 2800)

    // Spawn 28-34 celestial particles across viewport width
    const now = Date.now()
    const newParticles = Array.from({ length: 32 }, (_, i) => {
      const type = PARTICLE_TYPES[i % PARTICLE_TYPES.length]
      const startX = 3 + Math.random() * 94 // 3% to 97% across width
      const swayX = (Math.random() - 0.5) * 120 // -60px to +60px sway
      const duration = 2.4 + Math.random() * 1.8 // 2.4s to 4.2s fall time
      const delay = Math.random() * 0.45 // staggered release
      const scale = 0.7 + Math.random() * 0.65
      const rotation = Math.random() * 360

      return {
        id: `${now}-${i}`,
        type,
        startX: `${startX}vw`,
        swayX: `${swayX}px`,
        duration: `${duration.toFixed(2)}s`,
        delay: `${delay.toFixed(2)}s`,
        scale,
        rotation,
      }
    })

    setParticles((prev) => [...prev, ...newParticles])

    // Clean up particles after they finish falling
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !p.id.startsWith(String(now))))
    }, 4800)
  }, [])

  if (introState === 'couple') return null

  return (
    <>
      {/* Floating Pushpa-Varsha & Mor-Pankh Trigger Button */}
      <div className="braj-shower-dock">
        <button
          type="button"
          className={`braj-shower-btn ${isPressing ? 'is-active' : ''}`}
          onClick={triggerShower}
          aria-label="Shower divine Radha-Krishna flower and peacock feather blessings on the couple"
          title="Tap to shower Radha-Krishna blessings"
        >
          <span className="braj-shower-btn__aura" aria-hidden="true" />
          <span className="braj-shower-btn__icon" aria-hidden="true">
            <PeacockFeatherIcon size={22} />
          </span>
          <span className="braj-shower-btn__content">
            <span className="braj-shower-btn__title">✦ राधे राधे ✦</span>
            <span className="braj-shower-btn__sub">Pushpa Varsha</span>
          </span>
          <span className="braj-shower-btn__badge" aria-hidden="true">
            {blessingCount}
          </span>
        </button>
      </div>

      {/* Floating Blessing Toast Notification */}
      {blessingMessage && (
        <div className="braj-shower-toast" role="status" aria-live="polite">
          <div className="braj-shower-toast__inner">
            <span className="braj-shower-toast__feather" aria-hidden="true">🪶</span>
            <p className="braj-shower-toast__text">{blessingMessage}</p>
            <span className="braj-shower-toast__lotus" aria-hidden="true">🪷</span>
          </div>
        </div>
      )}

      {/* Fullscreen Falling Petals & Peacock Feathers Layer */}
      {particles.length > 0 && (
        <div className="braj-shower-stage" aria-hidden="true">
          {particles.map((p) => (
            <div
              key={p.id}
              className={`braj-particle braj-particle--${p.type}`}
              style={{
                left: p.startX,
                '--sway-x': p.swayX,
                '--duration': p.duration,
                '--delay': p.delay,
                '--scale': p.scale,
                '--rotation': `${p.rotation}deg`,
              }}
            >
              {p.type === 'peacock' && (
                <svg viewBox="0 0 36 48" width="28" height="38" fill="none">
                  <path d="M18 4 C24 8 28 16 26 26 C24 34 20 40 16 46" stroke="#c59835" strokeWidth="1.2" />
                  <path
                    d="M18 6 C26 8 30 16 28 24 C24 30 18 34 14 36 C10 30 12 24 14 18 C16 12 16 8 18 6 Z"
                    fill="url(#peacock-feather-grad)"
                  />
                  <ellipse cx="20" cy="18" rx="6" ry="8" fill="url(#peacock-eye-radial)" stroke="#ffd700" strokeWidth="0.8" />
                  <circle cx="20" cy="18" r="2.5" fill="#0f172a" />
                  <circle cx="20" cy="18" r="1" fill="#38bdf8" />
                </svg>
              )}

              {p.type === 'lotus' && (
                <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
                  <path
                    d="M16 2 C10 10 8 20 16 28 C24 20 22 10 16 2 Z"
                    fill="url(#lotus-pink-grad)"
                    opacity="0.92"
                  />
                  <path
                    d="M16 14 C11 15 6 21 8 26 C12 28 15 23 16 14 Z"
                    fill="url(#lotus-pink-grad)"
                    opacity="0.8"
                  />
                  <path
                    d="M16 14 C21 15 26 21 24 26 C20 28 17 23 16 14 Z"
                    fill="url(#lotus-pink-grad)"
                    opacity="0.8"
                  />
                </svg>
              )}

              {p.type === 'marigold' && (
                <svg viewBox="0 0 28 28" width="18" height="18" fill="none">
                  <circle cx="14" cy="14" r="10" fill="#f59e0b" opacity="0.9" />
                  <circle cx="14" cy="14" r="6" fill="#d97706" />
                  <circle cx="14" cy="14" r="2.5" fill="#fef3c7" />
                </svg>
              )}

              {p.type === 'gold' && (
                <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
                  <path
                    d="M10 0 L12 7 L19 10 L12 13 L10 20 L8 13 L1 10 L8 7 Z"
                    fill="url(#gold-foil-grad)"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
