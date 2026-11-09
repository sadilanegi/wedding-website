import { useState, useRef, useEffect } from 'react'
import { isConfirmed } from '../../utils/weddingHelpers.js'
import { createGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar.js'
import {
  EventEmblem,
  CalendarIcon,
  ScheduleMedallionIcon,
  RoyalAttireIcon,
  SacredScrollIcon,
} from './Ornaments'
import './WeddingEventCard.css'

const THEME_LABELS = {
  haldi: 'Sacred Turmeric & Marigold',
  mehendi: 'Auspicious Henna Artistry',
  wedding: 'Sacred Vedic Union',
  reception: 'Royal Evening Gala',
}

export default function WeddingEventCard({ event, index, couple }) {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false)
  const [icsDownloaded, setIcsDownloaded] = useState(false)
  const calMenuRef = useRef(null)

  const theme = event.theme || 'wedding'
  const themeSubtitle = THEME_LABELS[theme] || 'Auspicious Ceremony'
  const hasImage = isConfirmed(event.image)

  // Close calendar menu on click outside or escape key
  useEffect(() => {
    if (!showCalendarMenu) return undefined

    const handleClickOutside = (e) => {
      if (calMenuRef.current && !calMenuRef.current.contains(e.target)) {
        setShowCalendarMenu(false)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowCalendarMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showCalendarMenu])

  // Resolve timing fields (startTime, endTime, time, guestArrivalTime)
  const hasStartTime = isConfirmed(event.startTime)
  const hasEndTime = isConfirmed(event.endTime)
  const hasTime = isConfirmed(event.time)
  const hasGuestArrival = isConfirmed(event.guestArrivalTime)

  const formattedTime =
    hasStartTime && hasEndTime
      ? `${event.startTime} – ${event.endTime}`
      : hasStartTime
        ? event.startTime
        : hasTime
          ? event.time
          : ''

  const googleCalUrl = createGoogleCalendarUrl({ event, couple })
  const hasSchedule = isConfirmed(event.date) || Boolean(formattedTime) || hasGuestArrival
  const hasDressCode = isConfirmed(event.dressCode)
  const hasInstructions = isConfirmed(event.instructions)

  const handleDownloadIcs = () => {
    const success = downloadIcsFile({ event, couple })
    if (success) {
      setIcsDownloaded(true)
      setTimeout(() => {
        setIcsDownloaded(false)
        setShowCalendarMenu(false)
      }, 1800)
    }
  }

  const coupleNames = `${couple?.groom?.firstName || 'Sumit'} & ${couple?.bride?.firstName || 'Prachi'}`

  return (
    <article
      className={`event-card event-card--${theme}`}
      aria-label={`${event.title} details`}
    >
      {/* Top 3D Timeline Node Medallion */}
      <div className="event-card__node-badge" aria-hidden="true">
        <span className="event-card__node-ring" />
        <span className="event-card__node-num">0{index + 1}</span>
      </div>

      <div className="event-card__inner">
        {/* Top Portrait Arch Banner (Displays couple image if provided, or luxury ceremonial arch slot) */}
        <div className="event-card__portrait-banner">
          {hasImage ? (
            <div className="event-card__photo-frame">
              <picture>
                <source srcSet={event.image.replace(/\.jpg$/, '.webp')} type="image/webp" />
                <img
                  src={event.image}
                  alt={`${coupleNames} — ${event.title}`}
                  className="event-card__photo"
                  loading="lazy"
                />
              </picture>
              <div className="event-card__photo-overlay" aria-hidden="true" />
              <div className="event-card__photo-arch-border" aria-hidden="true" />
              <span className="event-card__photo-badge">
                ✦ {event.title} ✦
              </span>
            </div>
          ) : (
            <div className="event-card__portrait-placeholder" aria-label={`${event.title} ceremony portrait slot`}>
              {/* Radial Sunburst & Royal Jharokha Arch */}
              <div className="event-card__placeholder-sunburst" aria-hidden="true" />
              <svg
                className="event-card__placeholder-arch-svg"
                viewBox="0 0 340 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <path
                  d="M12 180 V65 C12 24 75 10 170 10 C265 10 328 24 328 65 V180"
                  stroke="url(#gold-foil-grad)"
                  strokeWidth="1.4"
                  strokeDasharray="4 3"
                  opacity="0.65"
                />
                <path
                  d="M22 180 V72 C22 34 82 20 170 20 C258 20 318 34 318 72 V180"
                  stroke="url(#gold-foil-grad)"
                  strokeWidth="0.8"
                  opacity="0.45"
                />
              </svg>

              {/* Central Ceremonial Emblem Medallion */}
              <div className="event-card__portrait-seal" aria-hidden="true">
                <div className="event-card__seal-ring">
                  <EventEmblem theme={theme} className="event-card__seal-emblem" />
                </div>
              </div>

              {/* Ceremony Photo Announcement Tag */}
              <div className="event-card__placeholder-tag">
                <span className="event-card__placeholder-couple">{coupleNames}</span>
                <span className="event-card__placeholder-sub">
                  ✦ {event.title} Portrait ✦
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Ceremony Body & Details Container */}
        <div className="event-card__body">
          {/* Header with Title and Theme Kicker */}
          <div className="event-card__header">
            <div className="event-card__badge-wrap">
              <div className="event-card__kicker-row">
                <span className="event-card__index">Celebration 0{index + 1}</span>
                <span className="event-card__dot" aria-hidden="true">•</span>
                <span className="event-card__theme-sub">{themeSubtitle}</span>
              </div>
              <h3 className="event-card__title">{event.title}</h3>
            </div>
          </div>

          {/* Tagline / Significance Banner */}
          {isConfirmed(event.tagline) && (
            <p className="event-card__tagline">
              <span className="event-card__quote-mark" aria-hidden="true">&ldquo;</span>
              {event.tagline}
              <span className="event-card__quote-mark" aria-hidden="true">&rdquo;</span>
            </p>
          )}

          {/* Ceremony Details Grid (Universal location is kept at Chapter 4 Venue Section) */}
          <div className="event-card__details">
            {/* Auspicious Schedule */}
            <div className="event-card__detail-row">
              <span className="event-card__icon-medallion" aria-hidden="true">
                <ScheduleMedallionIcon />
              </span>
              <div className="event-card__meta">
                <span className="event-card__meta-label">Auspicious Schedule</span>
                {hasSchedule ? (
                  <>
                    <span className="event-card__meta-value">
                      {isConfirmed(event.date) ? event.date : 'Date to be announced'}
                      {formattedTime && ` · ${formattedTime}`}
                    </span>
                    {hasGuestArrival && (
                      <span className="event-card__arrival-badge">
                        Guest Arrival: {event.guestArrivalTime}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="event-card__meta-value event-card__meta-value--pending">
                    Auspicious timing to be announced
                  </span>
                )}
              </div>
            </div>

            {/* Attire Palette */}
            {hasDressCode && (
              <div className="event-card__detail-row event-card__detail-row--dress">
                <span className="event-card__icon-medallion" aria-hidden="true">
                  <RoyalAttireIcon />
                </span>
                <div className="event-card__meta">
                  <span className="event-card__meta-label">Attire Palette</span>
                  <span className="event-card__dress-pill">
                    <span className="event-card__dress-dot" aria-hidden="true" />
                    {event.dressCode}
                  </span>
                </div>
              </div>
            )}

            {/* Royal Hospitality Note */}
            {hasInstructions && (
              <div className="event-card__detail-row event-card__detail-row--instructions">
                <span className="event-card__icon-medallion" aria-hidden="true">
                  <SacredScrollIcon />
                </span>
                <div className="event-card__meta">
                  <span className="event-card__meta-label">Royal Hospitality Note</span>
                  <span className="event-card__meta-value">{event.instructions}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action: Save Ceremony Date to Calendar */}
          <div className="event-card__actions">
            {googleCalUrl ? (
              <div className="event-card__cal-wrap" ref={calMenuRef}>
                <button
                  type="button"
                  className="event-card__btn event-card__btn--calendar"
                  onClick={() => setShowCalendarMenu((prev) => !prev)}
                  aria-expanded={showCalendarMenu}
                >
                  <CalendarIcon />
                  <span>Save Ceremony Date</span>
                </button>

                {showCalendarMenu && (
                  <div className="event-card__cal-menu" role="menu">
                    <a
                      href={googleCalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="event-card__cal-item"
                      role="menuitem"
                      onClick={() => setShowCalendarMenu(false)}
                    >
                      Google Calendar
                    </a>
                    <button
                      type="button"
                      className="event-card__cal-item"
                      role="menuitem"
                      onClick={handleDownloadIcs}
                    >
                      {icsDownloaded ? '✓ Downloaded!' : 'Download .ics (Apple / Outlook)'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                disabled
                className="event-card__btn event-card__btn--disabled"
                title="Calendar invites will activate upon date confirmation"
              >
                <CalendarIcon />
                <span>Save Ceremony Date</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
