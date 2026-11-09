import { useMemo } from 'react'
import './BrajBlessingShower.css'

/**
 * BrajBlessingShower.jsx
 * Continuous, ambient, universal shower of sharp sacred flowers & peacock feathers.
 * Runs at 60fps compositor-only with zero buttons and light, elegant density.
 */

const AMBIENT_ITEMS = [
  // 1. Peacock Feathers (Crisp vector with iridescent peacock eye and gold quill)
  { type: 'peacock', left: '8%', duration: '9.2s', delay: '-1.5s', sway: '38px', scale: 0.88, rot: 15 },
  { type: 'peacock', left: '38%', duration: '11.0s', delay: '-6.2s', sway: '-42px', scale: 0.96, rot: -20 },
  { type: 'peacock', left: '68%', duration: '10.2s', delay: '-3.8s', sway: '35px', scale: 0.92, rot: 25 },
  { type: 'peacock', left: '88%', duration: '11.8s', delay: '-8.5s', sway: '-30px', scale: 0.82, rot: -15 },

  // 2. Sacred Lotus Petals (Crisp gradient pink/magenta petals)
  { type: 'lotus', left: '16%', duration: '8.4s', delay: '-4.2s', sway: '-28px', scale: 0.9, rot: 40 },
  { type: 'lotus', left: '48%', duration: '9.8s', delay: '-0.8s', sway: '32px', scale: 0.95, rot: -30 },
  { type: 'lotus', left: '78%', duration: '8.8s', delay: '-7.0s', sway: '-24px', scale: 0.85, rot: 50 },

  // 3. Golden Marigold Petals (Auspicious Genda Phool saffron/amber blooms)
  { type: 'marigold', left: '26%', duration: '7.8s', delay: '-2.4s', sway: '26px', scale: 0.82, rot: -45 },
  { type: 'marigold', left: '58%', duration: '8.6s', delay: '-5.1s', sway: '-34px', scale: 0.88, rot: 35 },
  { type: 'marigold', left: '92%', duration: '9.0s', delay: '-9.2s', sway: '22px', scale: 0.78, rot: -25 },

  // 4. 24K Gold Starlight Flecks
  { type: 'gold', left: '22%', duration: '7.2s', delay: '-3.1s', sway: '18px', scale: 0.75, rot: 60 },
  { type: 'gold', left: '74%', duration: '7.5s', delay: '-7.8s', sway: '-20px', scale: 0.8, rot: -60 },
]

export default function BrajBlessingShower() {
  const items = useMemo(() => AMBIENT_ITEMS, [])

  return (
    <div className="braj-ambient-shower" aria-hidden="true">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`braj-ambient-item braj-ambient-item--${item.type}`}
          style={{
            left: item.left,
            '--sway-x': item.sway,
            '--duration': item.duration,
            '--delay': item.delay,
            '--scale': item.scale,
            '--rot-base': `${item.rot}deg`,
          }}
        >
          {item.type === 'peacock' && (
            <svg
              className="braj-sharp-svg"
              viewBox="0 0 36 50"
              width="26"
              height="36"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              {/* Sharp Golden Quill */}
              <path
                d="M18 4 C24 10 27 20 25 32 C23 40 18 45 14 48"
                stroke="url(#gold-foil-grad)"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              {/* Sharp Iridescent Peacock Feather Silhouette */}
              <path
                d="M18 6 C26 8 31 16 28 25 C24 32 18 36 13 37 C9 31 11 23 13 17 C15 11 16 7 18 6 Z"
                fill="url(#peacock-feather-grad)"
              />
              {/* Fine Barb Filaments */}
              <path
                d="M18 8 C23 12 27 16 26 22 M18 16 C23 20 25 24 22 28 M18 8 C14 12 11 16 12 21 M18 16 C14 20 12 24 14 27"
                stroke="url(#gold-foil-grad)"
                strokeWidth="0.65"
                opacity="0.8"
              />
              {/* Vibrant Peacock Eye */}
              <ellipse
                cx="20"
                cy="19"
                rx="6"
                ry="8"
                fill="url(#peacock-eye-radial)"
                stroke="url(#gold-foil-grad)"
                strokeWidth="0.8"
              />
              <path
                d="M20 15 C22 15 24 17 24 19 C24 22 20 24 20 24 C20 24 16 22 16 19 C16 17 18 15 20 15 Z"
                fill="#0f172a"
              />
              <circle cx="20" cy="19" r="1.8" fill="#38bdf8" />
              <circle cx="20" cy="19" r="0.8" fill="#ffffff" />
            </svg>
          )}

          {item.type === 'lotus' && (
            <svg
              className="braj-sharp-svg"
              viewBox="0 0 32 32"
              width="20"
              height="20"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              {/* Center Sacred Petal */}
              <path
                d="M16 2 C10 10 9 20 16 29 C23 20 22 10 16 2 Z"
                fill="url(#lotus-pink-grad)"
                stroke="url(#gold-foil-grad)"
                strokeWidth="0.6"
              />
              {/* Left & Right Petal Wings */}
              <path
                d="M16 14 C11 15 6 21 8 27 C12 29 15 24 16 14 Z"
                fill="url(#lotus-pink-grad)"
                opacity="0.85"
              />
              <path
                d="M16 14 C21 15 26 21 24 27 C20 29 17 24 16 14 Z"
                fill="url(#lotus-pink-grad)"
                opacity="0.85"
              />
              {/* Petal Vein Accent */}
              <path d="M16 6 V26" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
            </svg>
          )}

          {item.type === 'marigold' && (
            <svg
              className="braj-sharp-svg"
              viewBox="0 0 28 28"
              width="17"
              height="17"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              {/* Radiating Marigold Petals */}
              <circle cx="14" cy="14" r="11" fill="#f59e0b" />
              <circle cx="14" cy="14" r="7.5" fill="#d97706" />
              <circle cx="14" cy="14" r="3.5" fill="#fef3c7" stroke="#b45309" strokeWidth="0.5" />
            </svg>
          )}

          {item.type === 'gold' && (
            <svg
              className="braj-sharp-svg"
              viewBox="0 0 20 20"
              width="13"
              height="13"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              <path
                d="M10 0 L12.5 7.5 L20 10 L12.5 12.5 L10 20 L7.5 12.5 L0 10 L7.5 7.5 Z"
                fill="url(#gold-foil-grad)"
              />
              <circle cx="10" cy="10" r="1.5" fill="#ffffff" />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
