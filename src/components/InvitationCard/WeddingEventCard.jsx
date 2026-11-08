import { useState, useRef, useEffect } from 'react'
import { isConfirmed } from '../../utils/weddingHelpers.js'
import { getDirectionsUrl } from '../../utils/googleMaps.js'
import { createGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar.js'
import { EventEmblem, MapPinIcon, CalendarIcon } from './Ornaments'
import './WeddingEventCard.css'

export default function WeddingEventCard({ event, index, couple }) {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false)
  const [icsDownloaded, setIcsDownloaded] = useState(false)
  const calMenuRef = useRef(null)

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

  const directionsUrl = getDirectionsUrl({
    mapUrl: event.mapUrl,
    address: event.address,
    venue: event.venue,
  })

  const googleCalUrl = createGoogleCalendarUrl({ event, couple })
  const hasSchedule = isConfirmed(event.date) || isConfirmed(event.time)
  const hasVenue = isConfirmed(event.venue) || isConfirmed(event.address)
  const hasDressCode = isConfirmed(event.dressCode)

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

  return (
    <article
      className={`event-card event-card--${event.theme || 'wedding'}`}
      aria-label={`${event.title} details`}
    >
      <div className="event-card__inner">
        {/* Top Header with Event Badge & Bespoke Emblem */}
        <div className="event-card__top">
          <div className="event-card__badge-wrap">
            <span className="event-card__index">Celebration 0{index + 1}</span>
            <h3 className="event-card__title">{event.title}</h3>
          </div>
          <div className="event-card__emblem-wrap">
            <EventEmblem theme={event.theme} className="event-card__emblem" />
          </div>
        </div>

        {/* Tagline / Significance */}
        {isConfirmed(event.tagline) && (
          <p className="event-card__tagline">{event.tagline}</p>
        )}

        {/* Schedule & Location Metadata */}
        <div className="event-card__details">
          {hasSchedule ? (
            <div className="event-card__detail-row">
              <span className="event-card__icon" aria-hidden="true">🗓</span>
              <div className="event-card__meta">
                <span className="event-card__meta-label">Schedule</span>
                <span className="event-card__meta-value">
                  {isConfirmed(event.date) ? event.date : 'Date to be announced'}
                  {isConfirmed(event.time) && ` · ${event.time}`}
                </span>
              </div>
            </div>
          ) : (
            <div className="event-card__detail-row">
              <span className="event-card__icon" aria-hidden="true">🗓</span>
              <div className="event-card__meta">
                <span className="event-card__meta-label">Schedule</span>
                <span className="event-card__meta-value event-card__meta-value--pending">
                  Auspicious timing to be announced
                </span>
              </div>
            </div>
          )}

          {hasVenue ? (
            <div className="event-card__detail-row">
              <span className="event-card__icon" aria-hidden="true">📍</span>
              <div className="event-card__meta">
                <span className="event-card__meta-label">Venue</span>
                <span className="event-card__meta-value">
                  {isConfirmed(event.venue) && event.venue}
                  {isConfirmed(event.venue) && isConfirmed(event.address) && ' — '}
                  {isConfirmed(event.address) && event.address}
                </span>
              </div>
            </div>
          ) : (
            <div className="event-card__detail-row">
              <span className="event-card__icon" aria-hidden="true">📍</span>
              <div className="event-card__meta">
                <span className="event-card__meta-label">Venue</span>
                <span className="event-card__meta-value event-card__meta-value--pending">
                  Location details to be unveiled
                </span>
              </div>
            </div>
          )}

          {hasDressCode && (
            <div className="event-card__detail-row event-card__detail-row--dress">
              <span className="event-card__icon" aria-hidden="true">✨</span>
              <div className="event-card__meta">
                <span className="event-card__meta-label">Attire Suggestion</span>
                <span className="event-card__dress-pill">{event.dressCode}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Directions & Add to Calendar */}
        <div className="event-card__actions">
          {directionsUrl ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="event-card__btn event-card__btn--directions"
            >
              <MapPinIcon />
              <span>Get Directions</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="event-card__btn event-card__btn--disabled"
              title="Location details will be announced soon"
            >
              <MapPinIcon />
              <span>Map Soon</span>
            </button>
          )}

          {googleCalUrl ? (
            <div className="event-card__cal-wrap" ref={calMenuRef}>
              <button
                type="button"
                className="event-card__btn event-card__btn--calendar"
                onClick={() => setShowCalendarMenu((prev) => !prev)}
                aria-expanded={showCalendarMenu}
              >
                <CalendarIcon />
                <span>Save Date</span>
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
              <span>Save Date</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

