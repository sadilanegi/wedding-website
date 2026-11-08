import { useState, useRef, useEffect } from 'react'
import { isConfirmed } from '../../utils/weddingHelpers.js'
import { getDirectionsUrl, detectUserLocation } from '../../utils/googleMaps.js'
import { createGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar.js'
import {
  EventEmblem,
  MapPinIcon,
  CalendarIcon,
  ScheduleMedallionIcon,
  PalaceVenueIcon,
  RoyalAttireIcon,
  SacredScrollIcon,
} from './Ornaments'
import './WeddingEventCard.css'

const THEME_LABELS = {
  haldi: 'Sacred Turmeric & Marigold',
  mehendi: 'Auspicious Henna Artistry',
  sangeet: 'Musical Night of Joy',
  wedding: 'Sacred Vedic Union',
  reception: 'Royal Evening Gala',
}

export default function WeddingEventCard({ event, index, couple, venueSummary }) {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false)
  const [icsDownloaded, setIcsDownloaded] = useState(false)
  const [locatingRoute, setLocatingRoute] = useState(false)
  const [sparkleKey, setSparkleKey] = useState(0)
  const calMenuRef = useRef(null)

  const theme = event.theme || 'wedding'
  const themeSubtitle = THEME_LABELS[theme] || 'Auspicious Ceremony'

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

  // Resolve venue & address with support for venueOverride and venueSummary fallback
  const resolvedVenue = isConfirmed(event.venueOverride)
    ? event.venueOverride
    : isConfirmed(event.venue)
      ? event.venue
      : isConfirmed(venueSummary?.hall)
        ? venueSummary.hall
        : ''

  const resolvedAddress = isConfirmed(event.address)
    ? event.address
    : isConfirmed(venueSummary?.address)
      ? venueSummary.address
      : ''

  const resolvedCity = isConfirmed(venueSummary?.city) ? venueSummary.city : ''

  const resolvedMapUrl = isConfirmed(event.mapUrl)
    ? event.mapUrl
    : isConfirmed(venueSummary?.mapUrl)
      ? venueSummary.mapUrl
      : ''

  const directionsUrl = getDirectionsUrl({
    mapUrl: resolvedMapUrl,
    address: resolvedAddress,
    venue: resolvedVenue,
    city: resolvedCity,
  })

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
  const hasVenue = Boolean(resolvedVenue) || Boolean(resolvedAddress)
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

  const handleStartLiveNavigation = async (e) => {
    if (!directionsUrl) return
    e.preventDefault()
    setLocatingRoute(true)
    try {
      const coords = await detectUserLocation()
      const liveUrl = getDirectionsUrl({
        mapUrl: resolvedMapUrl,
        address: resolvedAddress,
        venue: resolvedVenue,
        city: resolvedCity,
        originCoords: coords,
      })
      window.open(liveUrl || directionsUrl, '_blank', 'noopener,noreferrer')
    } catch {
      window.open(directionsUrl, '_blank', 'noopener,noreferrer')
    } finally {
      setLocatingRoute(false)
    }
  }

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
        {/* Ambient Floating Theme Sparkles inside Card Header */}
        <div key={sparkleKey} className="event-card__ambient" aria-hidden="true">
          <span className="event-card__float-orb event-card__float-orb--1" />
          <span className="event-card__float-orb event-card__float-orb--2" />
          <span className="event-card__float-orb event-card__float-orb--3" />
          <span className="event-card__float-orb event-card__float-orb--4" />
        </div>

        {/* Royal Pavilion Arch Header */}
        <div
          className="event-card__top"
          onClick={() => setSparkleKey((k) => k + 1)}
          title="Tap for ceremony sparkle"
        >
          <div className="event-card__badge-wrap">
            <div className="event-card__kicker-row">
              <span className="event-card__index">Celebration 0{index + 1}</span>
              <span className="event-card__dot" aria-hidden="true">•</span>
              <span className="event-card__theme-sub">{themeSubtitle}</span>
            </div>
            <h3 className="event-card__title">{event.title}</h3>
          </div>

          <div className="event-card__emblem-wrap">
            <span className="event-card__emblem-halo" aria-hidden="true" />
            <EventEmblem theme={theme} className="event-card__emblem" />
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

        {/* Schedule & Location Metadata with Bespoke 24K Gold Medallion Icons */}
        <div className="event-card__details">
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

          <div className="event-card__detail-row">
            <span className="event-card__icon-medallion" aria-hidden="true">
              <PalaceVenueIcon />
            </span>
            <div className="event-card__meta">
              <span className="event-card__meta-label">Royal Venue</span>
              {hasVenue ? (
                <span className="event-card__meta-value">
                  {resolvedVenue}
                  {resolvedVenue && resolvedAddress && ' — '}
                  {resolvedAddress}
                  {resolvedCity && !resolvedAddress.includes(resolvedCity) && `, ${resolvedCity}`}
                </span>
              ) : (
                <span className="event-card__meta-value event-card__meta-value--pending">
                  Location details to be unveiled
                </span>
              )}
            </div>
          </div>

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

        {/* Action Buttons: Live GPS Directions & Add to Calendar */}
        <div className="event-card__actions">
          {directionsUrl ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="event-card__btn event-card__btn--directions"
              onClick={handleStartLiveNavigation}
            >
              <MapPinIcon />
              <span>{locatingRoute ? 'Locating...' : 'Live Route'}</span>
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
