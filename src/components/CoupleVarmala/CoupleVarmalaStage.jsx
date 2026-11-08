import { useState, useMemo, useRef, useLayoutEffect } from 'react'
import './CoupleVarmalaStage.css'

/**
 * CoupleVarmalaStage.jsx
 * Single Continuous 3D Royal Varmala Diorama featuring Sumit (left) & Prachi (right).
 *
 * Instead of unmounting between a full-screen intro and a smaller card view,
 * this single component starts centered at full-screen scale (`introState === 'couple'`)
 * and smoothly morphs/zooms down (`introState === 'revealing'` -> `'card'`)
 * directly into its permanent home inside the Wedding Invitation Card Hero.
 */
export default function CoupleVarmalaStage({
  introState = 'card',
  onSkipOrContinue,
}) {
  const stageRef = useRef(null)
  const [burstKey, setBurstKey] = useState(0)
  const isIntro = introState === 'couple'
  const isRevealing = introState === 'revealing'

  // Compute exact FLIP offset so that during `introState === 'couple'`,
  // this exact DOM element sits dead-center in the viewport at full-screen scale,
  // then smoothly interpolates to `translate3d(0, 0, 0) scale(1)` when revealing the card.
  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return undefined

    const computeIntroTransform = () => {
      const viewportEl = el.closest('.app-mobile-stage') || document.documentElement
      const vpRect = viewportEl.getBoundingClientRect()

      // Measure natural untransformed bounding box by temporarily reading offset metrics
      const prevTransition = el.style.transition
      const prevTransform = el.style.transform
      el.style.transition = 'none'
      el.style.transform = 'none'

      const naturalRect = el.getBoundingClientRect()

      const naturalCenterY = naturalRect.top - vpRect.top + naturalRect.height / 2
      // Place center of the arch + couple at ~42.5% of viewport height so the royal plaque sits comfortably below
      const targetCenterY = vpRect.height * 0.425
      const shiftY = targetCenterY - naturalCenterY

      const scaleW = (vpRect.width * 1.04) / Math.max(1, naturalRect.width)
      const scaleH = (vpRect.height * 0.56) / Math.max(1, naturalRect.height)
      const scale = Math.max(1.2, Math.min(1.36, Math.min(scaleW, scaleH)))

      el.style.setProperty('--intro-shift-y', `${shiftY.toFixed(1)}px`)
      el.style.setProperty('--intro-scale', scale.toFixed(3))

      el.style.transform = prevTransform
      // Force reflow before restoring transition so initial intro state never animates FROM small to big
      void el.offsetHeight
      el.style.transition = prevTransition
    }

    computeIntroTransform()
    window.addEventListener('resize', computeIntroTransform)
    return () => window.removeEventListener('resize', computeIntroTransform)
  }, [])

  // Precompute falling red rose petals & mogra jasmine blossoms
  const petals = useMemo(() => {
    const count = 24
    return Array.from({ length: count }, (_, i) => {
      const isJasmine = i % 3 === 0
      const left = 4 + ((i * 17) % 92)
      const delay = (i * 0.21) % 3.2
      const duration = 3.5 + (i % 5) * 0.65
      const size = isJasmine ? 7 + (i % 3) * 2 : 10 + (i % 4) * 3
      const sway = (i % 2 === 0 ? 1 : -1) * (14 + (i % 4) * 6)
      const depth = 20 + (i % 4) * 12

      return {
        id: i,
        isJasmine,
        left: `${left}%`,
        delay: `${delay.toFixed(2)}s`,
        duration: `${duration.toFixed(2)}s`,
        size: `${size}px`,
        sway: `${sway}px`,
        depth: `${depth}px`,
      }
    })
  }, [])

  const handleStageTap = () => {
    if (isIntro && onSkipOrContinue) {
      onSkipOrContinue()
    } else {
      setBurstKey((prev) => prev + 1)
    }
  }

  const stateClass = isIntro
    ? 'varmala-stage--is-intro'
    : isRevealing
      ? 'varmala-stage--is-morphing'
      : 'varmala-stage--is-settled'

  return (
    <div
      ref={stageRef}
      className={`varmala-stage varmala-stage--hero ${stateClass}`}
      onClick={handleStageTap}
      role={isIntro ? 'button' : 'img'}
      tabIndex={isIntro ? 0 : -1}
      aria-label="Sumit and Prachi Varmala ceremony"
      onKeyDown={(e) => {
        if (isIntro && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          if (onSkipOrContinue) onSkipOrContinue()
        }
      }}
    >
      {/* Layer 1: Deep 3D Royal Mughal Jharokha Arch & Golden Sunburst Halo */}
      <div className="varmala-stage__backdrop" aria-hidden="true">
        <div className="varmala-stage__sunburst" />

        {/* Rotating Sacred Surya / Lotus Chakra */}
        <svg
          className="varmala-stage__chakra"
          viewBox="0 0 260 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="130"
            cy="130"
            r="120"
            stroke="url(#varmala-gold-grad)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.65"
          />
          <circle
            cx="130"
            cy="130"
            r="98"
            stroke="url(#varmala-gold-grad)"
            strokeWidth="0.8"
            opacity="0.5"
          />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <path
              key={deg}
              d="M130 14 C137 38 137 58 130 78 C123 58 123 38 130 14 Z"
              stroke="url(#varmala-gold-grad)"
              strokeWidth="0.85"
              fill="rgba(255, 245, 200, 0.08)"
              transform={`rotate(${deg} 130 130)`}
            />
          ))}
        </svg>

        {/* Ornate Royal Mughal Palace Arch (Jharokha) */}
        <svg
          className="varmala-stage__arch-svg"
          viewBox="0 0 360 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYBottom meet"
        >
          <defs>
            <linearGradient id="varmala-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7a5216" />
              <stop offset="25%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#fff8dc" />
              <stop offset="75%" stopColor="#c59835" />
              <stop offset="100%" stopColor="#6e4612" />
            </linearGradient>
            <radialGradient id="varmala-arch-glow" cx="50%" cy="48%" r="55%">
              <stop offset="0%" stopColor="#fffdf5" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#f9edd2" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#eb5" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Warm Inner Palace Glow */}
          <path
            d="M28 410 V175 C28 110 85 58 180 18 C275 58 332 110 332 175 V410 Z"
            fill="url(#varmala-arch-glow)"
          />

          {/* Outer Cusped Mughal Arch Frame */}
          <path
            d="M20 412 V170 C20 100 82 48 180 10 C278 48 340 100 340 170 V412"
            stroke="url(#varmala-gold-grad)"
            strokeWidth="2.2"
          />
          <path
            d="M32 412 V176 C32 114 90 62 180 24 C270 62 328 114 328 176 V412"
            stroke="url(#varmala-gold-grad)"
            strokeWidth="1.1"
            strokeDasharray="3 3"
          />

          {/* Hanging Floral Toran / Temple Bell Strings */}
          {[68, 112, 248, 292].map((x, idx) => (
            <g key={x} className={`varmala-stage__toran varmala-stage__toran--${idx}`}>
              <line
                x1={x}
                y1={idx === 1 || idx === 2 ? 52 : 82}
                x2={x}
                y2={idx === 1 || idx === 2 ? 128 : 148}
                stroke="url(#varmala-gold-grad)"
                strokeWidth="1"
              />
              <circle
                cx={x}
                cy={idx === 1 || idx === 2 ? 132 : 152}
                r="4.5"
                fill="#b91c1c"
                stroke="url(#varmala-gold-grad)"
                strokeWidth="1"
              />
              <circle
                cx={x}
                cy={idx === 1 || idx === 2 ? 116 : 136}
                r="3.2"
                fill="#fff8dc"
              />
            </g>
          ))}

          {/* Pedestal Base Line */}
          <line
            x1="10"
            y1="412"
            x2="350"
            y2="412"
            stroke="url(#varmala-gold-grad)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Layer 2: Central Golden Heart / Varmala Union Sparkle Burst */}
      <div key={burstKey} className="varmala-stage__union-glow" aria-hidden="true">
        <span className="varmala-stage__shockwave" />
        <span className="varmala-stage__heart-sparkle">✦</span>
      </div>

      {/* Layer 3: The 3D Pop-Out Bride & Groom Characters */}
      <div className="varmala-stage__characters">
        {/* Groom (Sumit) — Glides in from Left looking Right */}
        <div className="varmala-stage__char varmala-stage__char--groom">
          <picture>
            <source srcSet="/groom-varmala.webp" type="image/webp" />
            <img
              src="/groom-varmala.png"
              alt="Groom Sumit holding Varmala garland"
              className="varmala-stage__img varmala-stage__img--groom"
              draggable="false"
            />
          </picture>
        </div>

        {/* Bride (Prachi) — Glides in from Right looking Left */}
        <div className="varmala-stage__char varmala-stage__char--bride">
          <picture>
            <source srcSet="/bride-varmala.webp" type="image/webp" />
            <img
              src="/bride-varmala.png"
              alt="Bride Prachi holding Varmala garland"
              className="varmala-stage__img varmala-stage__img--bride"
              draggable="false"
            />
          </picture>
        </div>

        {/* Soft Pedestal Ground Shadow & Golden Mist */}
        <div className="varmala-stage__pedestal-mist" aria-hidden="true" />
      </div>

      {/* Layer 4: Foreground 3D Shower of Red Rose Petals & Mogra Jasmine */}
      <div key={`petals-${burstKey}`} className="varmala-stage__petals" aria-hidden="true">
        {petals.map((p) => (
          <span
            key={p.id}
            className={`varmala-petal ${p.isJasmine ? 'varmala-petal--jasmine' : 'varmala-petal--rose'}`}
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              '--petal-delay': p.delay,
              '--petal-duration': p.duration,
              '--petal-sway': p.sway,
              '--petal-depth': p.depth,
            }}
          />
        ))}
      </div>

      {/* Layer 5: Floating Royal Intro Plaque (Smoothly melts into the Card Names during morph) */}
      <div className="varmala-stage__caption" aria-hidden={!isIntro}>
        <div className="varmala-stage__caption-kicker">
          <span className="varmala-stage__caption-line" aria-hidden="true" />
          <span className="varmala-stage__caption-star" aria-hidden="true">✦</span>
          <p className="varmala-stage__sanskrit" lang="sa">
            ॥ शुभ विवाह ॥
          </p>
          <span className="varmala-stage__caption-star" aria-hidden="true">✦</span>
          <span className="varmala-stage__caption-line" aria-hidden="true" />
        </div>
        <h2 className="varmala-stage__couple-title">
          <span>Sumit</span>
          <span className="varmala-stage__couple-amp">&amp;</span>
          <span>Prachi</span>
        </h2>
        <p className="varmala-stage__subtitle">Two Souls · One Sacred Journey</p>
      </div>
    </div>
  )
}
