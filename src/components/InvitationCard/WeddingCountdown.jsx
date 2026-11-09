import { useEffect, useState, useMemo } from 'react'
import { getTargetWeddingDate, calculateCountdown } from '../../utils/countdown.js'
import { useWeddingPerspective } from '../../utils/weddingPerspective.js'
import { RoyalDivider } from './Ornaments'
import './WeddingCountdown.css'

const DIAL_META = [
  { key: 'days', label: 'Days', glyph: '☀' },
  { key: 'hours', label: 'Hours', glyph: '☾' },
  { key: 'minutes', label: 'Mins', glyph: '✦' },
  { key: 'seconds', label: 'Secs', glyph: '❖' },
]

export default function WeddingCountdown({ weddingData }) {
  const perspective = useWeddingPerspective()
  const targetDate = useMemo(() => getTargetWeddingDate(weddingData), [weddingData])
  const [countdown, setCountdown] = useState(() => calculateCountdown(targetDate))
  const [rippleKey, setRippleKey] = useState(0)

  useEffect(() => {
    if (!targetDate) return undefined

    const updateTimer = () => {
      setCountdown(calculateCountdown(targetDate))
    }

    updateTimer()
    const timerId = setInterval(updateTimer, 1000)
    return () => clearInterval(timerId)
  }, [targetDate])

  const formatUnit = (num) => String(num).padStart(2, '0')
  const isCounting = countdown.isAvailable && !countdown.isLive && !countdown.isConcluded

  return (
    <section
      id="chapter-countdown"
      className="countdown-section"
      aria-label="Wedding celebration countdown"
    >
      <RoyalDivider className="countdown-section__divider" />

      <div
        className={`countdown-card ${rippleKey > 0 ? 'is-rippling' : ''}`}
        onClick={() => setRippleKey((k) => k + 1)}
        role="region"
        aria-label="Auspicious Muhurta Timepiece"
      >
        {/* Background Rotating Celestial Surya Mandala */}
        <svg
          className="countdown-card__mandala"
          viewBox="0 0 220 220"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="110" cy="110" r="98" stroke="url(#gold-foil-grad)" strokeWidth="0.8" strokeDasharray="4 4" />
          <circle cx="110" cy="110" r="76" stroke="url(#gold-foil-grad)" strokeWidth="0.7" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="110"
              y1="14"
              x2="110"
              y2="34"
              stroke="url(#gold-foil-grad)"
              strokeWidth="0.9"
              transform={`rotate(${deg} 110 110)`}
            />
          ))}
        </svg>

        {/* Top Royal Arch Badge */}
        <header className="countdown-card__header">
          <div className="countdown-card__kicker-pill">
            <span aria-hidden="true">✦</span>
            <p className="countdown-card__kicker">Shubh Muhurta · Celestial Timepiece</p>
            <span aria-hidden="true">✦</span>
          </div>
          <h2 className="countdown-card__title">
            {countdown.isLive
              ? 'The Celebrations Have Begun!'
              : countdown.isConcluded
                ? 'With Eternal Love & Gratitude'
                : 'Counting Down Every Sacred Moment'}
          </h2>
        </header>

        {/* 4 Engraved 3D Gold Timepiece Dials (Live Digits when Date Confirmed, Celestial Glyphs when Pending) */}
        {!countdown.isLive && !countdown.isConcluded && (
          <div
            key={rippleKey}
            className="countdown-dials"
            role={isCounting ? 'timer' : 'group'}
            aria-live="polite"
          >
            {DIAL_META.map((dial, idx) => (
              <div key={dial.key} className="countdown-dials__group">
                <div
                  className="countdown-dial"
                  style={{ '--dial-idx': idx }}
                >
                  <div className="countdown-dial__rim">
                    <span className="countdown-dial__orbit" aria-hidden="true" />
                    <span className="countdown-dial__value">
                      {isCounting ? (
                        formatUnit(countdown[dial.key])
                      ) : (
                        <span className="countdown-dial__glyph">{dial.glyph}</span>
                      )}
                    </span>
                  </div>
                  <span className="countdown-dial__label">{dial.label}</span>
                </div>
                {idx < DIAL_META.length - 1 && (
                  <span className="countdown-dials__separator" aria-hidden="true">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {countdown.isLive ? (
          <div className="countdown-celebration">
            <p className="countdown-celebration__text">
              Today, {perspective.coupleLabel} unite in sacred marriage. Thank you for gracing our joyous celebration!
            </p>
          </div>
        ) : countdown.isConcluded ? (
          <div className="countdown-celebration">
            <p className="countdown-celebration__text">
              Thank you to all families and friends for your heartfelt blessings and warm presence.
            </p>
          </div>
        ) : !isCounting ? (
          <div className="countdown-pending">
            <div className="countdown-pending__astronomy">
              <p className="countdown-pending__note">
                The sacred muhurta is being finalized by family astrologers.
              </p>
              <p className="countdown-pending__sub">
                ✦ Live second-by-second dials will ignite upon date confirmation ✦
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
