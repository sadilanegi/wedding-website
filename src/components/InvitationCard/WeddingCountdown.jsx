import { useEffect, useState, useMemo } from 'react'
import { getTargetWeddingDate, calculateCountdown } from '../../utils/countdown.js'
import { RoyalDivider } from './Ornaments'
import './WeddingCountdown.css'

export default function WeddingCountdown({ weddingData }) {
  const targetDate = useMemo(() => getTargetWeddingDate(weddingData), [weddingData])
  const [countdown, setCountdown] = useState(() => calculateCountdown(targetDate))

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

  return (
    <section className="countdown-section" aria-label="Wedding celebration countdown">
      <RoyalDivider className="countdown-section__divider" />

      <div className="countdown-card">
        <header className="countdown-card__header">
          <p className="countdown-card__kicker">Auspicious Countdown</p>
          <h2 className="countdown-card__title">
            {countdown.isLive
              ? 'The Celebrations Have Begun!'
              : countdown.isConcluded
                ? 'With Eternal Love & Gratitude'
                : 'Counting Down The Moments'}
          </h2>
        </header>

        {countdown.isAvailable && !countdown.isLive && !countdown.isConcluded ? (
          <div className="countdown-dials" role="timer" aria-live="polite">
            <div className="countdown-dial">
              <div className="countdown-dial__rim">
                <span className="countdown-dial__value">{formatUnit(countdown.days)}</span>
              </div>
              <span className="countdown-dial__label">Days</span>
            </div>

            <span className="countdown-dials__separator" aria-hidden="true">:</span>

            <div className="countdown-dial">
              <div className="countdown-dial__rim">
                <span className="countdown-dial__value">{formatUnit(countdown.hours)}</span>
              </div>
              <span className="countdown-dial__label">Hours</span>
            </div>

            <span className="countdown-dials__separator" aria-hidden="true">:</span>

            <div className="countdown-dial">
              <div className="countdown-dial__rim">
                <span className="countdown-dial__value">{formatUnit(countdown.minutes)}</span>
              </div>
              <span className="countdown-dial__label">Mins</span>
            </div>

            <span className="countdown-dials__separator" aria-hidden="true">:</span>

            <div className="countdown-dial">
              <div className="countdown-dial__rim">
                <span className="countdown-dial__value">{formatUnit(countdown.seconds)}</span>
              </div>
              <span className="countdown-dial__label">Secs</span>
            </div>
          </div>
        ) : countdown.isLive ? (
          <div className="countdown-celebration">
            <p className="countdown-celebration__text">
              Today, Prachi & Sumit unite in sacred marriage. Thank you for gracing our joyous celebration!
            </p>
          </div>
        ) : countdown.isConcluded ? (
          <div className="countdown-celebration">
            <p className="countdown-celebration__text">
              Thank you to all families and friends for your heartfelt blessings and warm presence.
            </p>
          </div>
        ) : (
          /* Graceful State when Wedding Date is '__' */
          <div className="countdown-pending">
            <div className="countdown-pending__astronomy">
              <span className="countdown-pending__icon" aria-hidden="true">✦</span>
              <p className="countdown-pending__note">
                The sacred muhurta is being finalized by family astrologers.
              </p>
              <p className="countdown-pending__sub">
                Official countdown will commence as soon as the wedding date is unveiled.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

