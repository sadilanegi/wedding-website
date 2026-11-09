import { useMemo } from 'react'
import { isConfirmed } from '../../utils/weddingHelpers.js'
import { RoyalDivider, MapPinIcon } from './Ornaments'
import './VenueSection.css'

export default function VenueSection({ venueSummary, events = [] }) {
  // Fall back to first confirmed event venue if venueSummary is pending
  const fallbackEventVenue = useMemo(() => {
    if (!Array.isArray(events)) return null
    return events.find(
      (ev) =>
        isConfirmed(ev.venueOverride) ||
        isConfirmed(ev.venue) ||
        isConfirmed(ev.address)
    )
  }, [events])

  if (!venueSummary) return null

  const hall = isConfirmed(venueSummary.hall)
    ? venueSummary.hall
    : isConfirmed(fallbackEventVenue?.venueOverride)
      ? fallbackEventVenue.venueOverride
      : isConfirmed(fallbackEventVenue?.venue)
        ? fallbackEventVenue.venue
        : 'Venue To Be Finalized'

  const address = venueSummary.address || fallbackEventVenue?.address || '__, Vrindavan'
  const city = venueSummary.city || 'Vrindavan, Uttar Pradesh'

  // Forced native maps redirect: Apple Maps on iOS/macOS, Google Maps on Android/desktop
  const handleOpenMap = () => {
    const isApple =
      typeof navigator !== 'undefined' &&
      (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

    // Build clean query string for maps app
    const cleanAddressParts = [hall, address, city].filter(
      (part) => part && !part.includes('__') && !part.includes('To Be')
    )

    const query =
      cleanAddressParts.length > 0
        ? cleanAddressParts.join(', ')
        : 'Vrindavan, Uttar Pradesh'

    const encoded = encodeURIComponent(query)

    const mapTargetUrl = isApple
      ? `https://maps.apple.com/?q=${encoded}`
      : `https://www.google.com/maps/search/?api=1&query=${encoded}`

    window.open(mapTargetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="venue-section" aria-label="Celebration venue and directions">
      <div className="venue-section__head">
        <RoyalDivider className="venue-section__divider" />
        <span className="venue-section__kicker">Celebration Location</span>
        <h2 className="venue-section__title">
          {isConfirmed(venueSummary.title) ? venueSummary.title : 'Venue & Location'}
        </h2>
      </div>

      <div className="venue-card">
        {/* Sacred Golden Map Pin Crest */}
        <div className="venue-card__pin-crest" aria-hidden="true">
          <MapPinIcon className="venue-card__pin-svg" />
        </div>

        {/* 1. Venue Location & Address at Top */}
        <div className="venue-card__address-wrap">
          <span className="venue-card__sacred-kicker">✦ Sacred Land of Shri Radha Krishna ✦</span>
          <h3 className="venue-card__hall">{hall}</h3>
          <p className="venue-card__address">{address}</p>
          <p className="venue-card__city">{city}</p>
        </div>

        {/* 2. Map Redirect Action Button */}
        <button
          type="button"
          className="venue-card__map-btn"
          onClick={handleOpenMap}
          aria-label="Open wedding venue location in your Maps app"
        >
          <MapPinIcon className="venue-card__map-btn-icon" />
          <span>Open in Google / Apple Maps</span>
          <span className="venue-card__map-btn-arrow" aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  )
}
