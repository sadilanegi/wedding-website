import { useMemo } from 'react'
import './AmbientParticles.css'

/**
 * AmbientParticles.jsx
 * Restrained, lightweight 3D floating gold dust & bokeh flecks.
 * Creates cinematic depth of field around the luxury invitation card.
 * Hardware-accelerated with CSS transforms. Disabled on reduced motion.
 */
export default function AmbientParticles({ count = 18 }) {
  // Precompute stable particle parameters so they don't re-render
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = 3 + (i % 4) * 1.5 // 3px to 7.5px
      const left = 5 + ((i * 19) % 90) // 5% to 95%
      const top = 4 + ((i * 23) % 92) // 4% to 96%
      const depth = -20 + (i % 5) * 15 // -20px to +40px Z-depth
      const duration = 7 + (i % 6) * 1.8 // 7s to 16s
      const delay = (i % 5) * -1.6 // staggered negative delay for instant flow
      const blur = i % 3 === 0 ? 1.5 : 0.4 // depth of field bokeh
      const opacity = 0.25 + (i % 4) * 0.15 // 0.25 to 0.7

      return {
        id: i,
        size,
        left: `${left}%`,
        top: `${top}%`,
        depth: `${depth}px`,
        duration: `${duration.toFixed(1)}s`,
        delay: `${delay.toFixed(1)}s`,
        blur: `${blur}px`,
        opacity,
      }
    })
  }, [count])

  return (
    <div className="ambient-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="ambient-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            filter: `blur(${p.blur})`,
            '--p-depth': p.depth,
            '--p-duration': p.duration,
            '--p-delay': p.delay,
          }}
        />
      ))}
    </div>
  )
}
