import { useState, useMemo } from 'react'
import { isConfirmed } from '../../utils/weddingHelpers.js'
import {
  getDirectionsUrl,
  getAppleMapsUrl,
  getEmbedMapUrl,
  parseCoordinates,
  calculateRelativePosition,
  detectUserLocation,
} from '../../utils/googleMaps.js'
import { RoyalDivider, MapPinIcon } from './Ornaments'
import './VenueSection.css'

export default function VenueSection({ venueSummary, events = [] }) {
  const [userCoords, setUserCoords] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [travelMode, setTravelMode] = useState('driving')
  const [showInteractiveMap, setShowInteractiveMap] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)

  // Fall back to first confirmed event venue if venueSummary is still pending
  const fallbackEventVenue = useMemo(() => {
    if (!Array.isArray(events)) return null
    return events.find(
      (ev) =>
        isConfirmed(ev.venueOverride) ||
        isConfirmed(ev.venue) ||
        isConfirmed(ev.address) ||
        isConfirmed(ev.mapUrl)
    )
  }, [events])

  if (!venueSummary) return null

  const effectiveHall = isConfirmed(venueSummary.hall)
    ? venueSummary.hall
    : isConfirmed(fallbackEventVenue?.venueOverride)
      ? fallbackEventVenue.venueOverride
      : isConfirmed(fallbackEventVenue?.venue)
        ? fallbackEventVenue.venue
        : ''

  const effectiveAddress = isConfirmed(venueSummary.address)
    ? venueSummary.address
    : isConfirmed(fallbackEventVenue?.address)
      ? fallbackEventVenue.address
      : ''

  const effectiveCity = isConfirmed(venueSummary.city) ? venueSummary.city : ''

  const effectiveMapUrl = isConfirmed(venueSummary.mapUrl)
    ? venueSummary.mapUrl
    : isConfirmed(fallbackEventVenue?.mapUrl)
      ? fallbackEventVenue.mapUrl
      : ''

  const effectiveCoordinates = isConfirmed(venueSummary.coordinates)
    ? venueSummary.coordinates
    : isConfirmed(fallbackEventVenue?.coordinates)
      ? fallbackEventVenue.coordinates
      : ''

  const hasHall = Boolean(effectiveHall)
  const hasAddress = Boolean(effectiveAddress)
  const hasCity = Boolean(effectiveCity)
  const hasAnyDetails = hasHall || hasAddress || hasCity

  const directionsUrl = getDirectionsUrl({
    mapUrl: effectiveMapUrl,
    address: effectiveAddress,
    venue: effectiveHall,
    city: effectiveCity,
    coordinates: effectiveCoordinates,
    originCoords: userCoords,
    travelMode,
  })

  const appleMapsUrl = getAppleMapsUrl({
    mapUrl: effectiveMapUrl,
    address: effectiveAddress,
    venue: effectiveHall,
    city: effectiveCity,
    coordinates: effectiveCoordinates,
    originCoords: userCoords,
  })

  const embedMapUrl = getEmbedMapUrl({
    mapUrl: effectiveMapUrl,
    address: effectiveAddress,
    venue: effectiveHall,
    city: effectiveCity,
    coordinates: effectiveCoordinates,
    originCoords: userCoords,
  })

  const destCoords =
    parseCoordinates(effectiveCoordinates) || parseCoordinates(effectiveMapUrl)

  const relativeStats = calculateRelativePosition(userCoords, destCoords)

  const handleLocateMe = async () => {
    setLocating(true)
    setLocationError('')
    try {
      const coords = await detectUserLocation()
      setUserCoords(coords)
      setShowInteractiveMap(true)
    } catch (err) {
      setLocationError(err.message || 'Could not access your GPS location.')
    } finally {
      setLocating(false)
    }
  }

  const handleCopyAddress = async () => {
    const fullAddress = [effectiveHall, effectiveAddress, effectiveCity]
      .filter(Boolean)
      .join(', ')
    if (!fullAddress || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(fullAddress)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch {
      // ignore clipboard errors
    }
  }

  // If user located themselves even before venue is set, allow opening Google Maps at their GPS pin
  const liveUserMapUrl = userCoords
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${userCoords.lat},${userCoords.lng}`)}`
    : null

  return (
    <section className="venue-section" aria-label="Venue location and live route navigation">
      <div className="venue-section__head">
        <RoyalDivider className="venue-section__divider" />
        <span className="venue-section__kicker">Celebration Location &amp; Route</span>
        <h2 className="venue-section__title">
          {isConfirmed(venueSummary.title) ? venueSummary.title : 'Venue & Live Directions'}
        </h2>
      </div>

      <div className="venue-card">
        <div className="venue-card__header-icon" aria-hidden="true">
          <MapPinIcon />
        </div>

        {hasAnyDetails ? (
          <div className="venue-card__content">
            {hasHall && <h3 className="venue-card__hall">{effectiveHall}</h3>}
            {hasAddress && <p className="venue-card__address">{effectiveAddress}</p>}
            {hasCity && <p className="venue-card__city">{effectiveCity}</p>}

            <button
              type="button"
              className="venue-card__copy-btn"
              onClick={handleCopyAddress}
            >
              {copiedAddress ? '✓ Venue Address Copied' : 'Copy Venue Address'}
            </button>
          </div>
        ) : (
          <div className="venue-card__pending">
            <p className="venue-card__pending-text">
              The grand celebration venue is currently being finalized.
            </p>
            <p className="venue-card__pending-sub">
              Detect your live GPS location below to preview the interactive map &amp; route finder.
            </p>
          </div>
        )}

        {/* Live Relative Location Radar (Origin -> Destination) */}
        <div className="venue-route-radar" aria-live="polite">
          <div className="venue-route-radar__endpoints">
            <div className="venue-route-radar__node">
              <span
                className={`venue-route-radar__dot ${userCoords ? 'is-locked' : ''}`}
                aria-hidden="true"
              />
              <div className="venue-route-radar__info">
                <span className="venue-route-radar__label">Your Starting Point</span>
                <span className="venue-route-radar__value">
                  {userCoords
                    ? `GPS Locked (${userCoords.lat.toFixed(4)}°, ${userCoords.lng.toFixed(4)}°)`
                    : 'Tap "Find My Location" to lock GPS'}
                </span>
              </div>
            </div>

            <div className="venue-route-radar__connector" aria-hidden="true">
              <span className="venue-route-radar__line" />
              {relativeStats && (
                <span className="venue-route-radar__distance-pill">
                  {relativeStats.distanceKm} km · {relativeStats.compass} · {relativeStats.estTimeText}
                </span>
              )}
            </div>

            <div className="venue-route-radar__node">
              <span className="venue-route-radar__dot is-dest" aria-hidden="true" />
              <div className="venue-route-radar__info">
                <span className="venue-route-radar__label">Wedding Destination</span>
                <span className="venue-route-radar__value">
                  {hasHall
                    ? effectiveHall
                    : hasAddress
                      ? effectiveAddress
                      : 'Venue Coordinates To Be Unveiled'}
                </span>
              </div>
            </div>
          </div>

          {/* Travel Mode Selector */}
          <div className="venue-route-modes" role="group" aria-label="Travel mode">
            {[
              { id: 'driving', label: '🚗 Car / Cab' },
              { id: 'two-wheeler', label: '🛵 Two-Wheeler' },
              { id: 'transit', label: '🚆 Transit' },
              { id: 'walking', label: '🚶 Walk' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`venue-route-mode-btn ${travelMode === mode.id ? 'is-active' : ''}`}
                onClick={() => setTravelMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {locationError && (
          <p className="venue-card__error" role="alert">
            {locationError}
          </p>
        )}

        {/* Embedded Interactive Map Preview */}
        {showInteractiveMap && embedMapUrl && (
          <div className="venue-card__map-frame-wrap">
            <div className="venue-card__map-header">
              <span className="venue-card__map-badge">
                {hasAnyDetails || destCoords
                  ? '📍 Destination Map Preview'
                  : '📍 Your Live GPS Location Map'}
              </span>
              <button
                type="button"
                className="venue-card__map-close"
                onClick={() => setShowInteractiveMap(false)}
              >
                Hide Map
              </button>
            </div>
            <iframe
              title="Interactive Venue and Location Map"
              src={embedMapUrl}
              className="venue-card__map-iframe"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        )}

        {/* Primary Navigation & GPS Actions */}
        <div className="venue-card__actions">
          <button
            type="button"
            className={`venue-card__btn venue-card__btn--locate ${userCoords ? 'is-located' : ''}`}
            onClick={handleLocateMe}
            disabled={locating}
          >
            <MapPinIcon />
            <span>
              {locating
                ? 'Detecting Your GPS Location...'
                : userCoords
                  ? '✓ Refresh My Live GPS Location'
                  : 'Find My Location & Relative Route'}
            </span>
          </button>

          {directionsUrl ? (
            <div className="venue-card__nav-links">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="venue-card__btn venue-card__btn--primary"
              >
                <MapPinIcon />
                <span>
                  {userCoords
                    ? 'Start Turn-by-Turn Route Now'
                    : 'Get Directions in Google Maps'}
                </span>
              </a>

              {appleMapsUrl && (
                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="venue-card__btn venue-card__btn--secondary"
                >
                  <span>Open in Apple Maps</span>
                </a>
              )}
            </div>
          ) : userCoords && liveUserMapUrl ? (
            <a
              href={liveUserMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-card__btn venue-card__btn--primary"
            >
              <MapPinIcon />
              <span>Open My Live Location in Google Maps</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="venue-card__btn venue-card__btn--disabled"
            >
              <MapPinIcon />
              <span>Turn-by-Turn Route Unlocks With Venue</span>
            </button>
          )}

          {embedMapUrl && !showInteractiveMap && (
            <button
              type="button"
              className="venue-card__btn venue-card__btn--outline"
              onClick={() => setShowInteractiveMap(true)}
            >
              <span>Preview Interactive Map on Card</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

