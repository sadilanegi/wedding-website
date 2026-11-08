import { useMemo } from 'react'
import './AmbientParticles.css'

/**
 * AmbientParticles.jsx
 * Lightweight floating gold dust flecks (pure transform/opacity, zero blur filters).
 */
export default function AmbientParticles({ count = 8 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const size = 3 + (i % 3) * 1.5
      const left = 8 + ((i * 23) % 84)
      const top = 6 + ((i * 29) % 88)
      const duration = 9 + (i % 4) * 2
      const delay = (i % 4) * -2
      const opacity = 0.25 + (i % 3) * 0.14

      return {
        id: i,
        size,
        left: `${left}%`,
        top: `${top}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
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
            '--p-duration': p.duration,
            '--p-delay': p.delay,
          }}
        />
      ))}
    </div>
  )
}
