import { useMemo, useState } from 'react'
import { isConfirmed } from '../../utils/weddingHelpers.js'
import { RoyalDivider, MapPinIcon } from './Ornaments'
import './VenueSection.css'

export default function VenueSection({ venueSummary, events = [] }) {
  // Detect if user is viewing on an iOS device (iPhone/iPad)
  const [isAppleDevice] = useState(() => {
    if (typeof navigator === 'undefined') return false
    return (
      /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    )
  })

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

  const address = venueSummary.address || fallbackEventVenue?.address || 'FFW9+GF6, Radha Kund Road'
  const landmark = isConfirmed(venueSummary.landmark) ? venueSummary.landmark : null
  const city = venueSummary.city || 'Govardhan, District Mathura, Uttar Pradesh – 281123, India'

  // Smart native map launcher:
  // - On iOS (iPhone, iPad): Opens native Apple Maps app with pinned venue and coordinates
  // - On Android & other platforms: Opens native Google Maps app via short URL
  const handleOpenMap = () => {
    const isApple =
      typeof navigator !== 'undefined' &&
      (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

    if (isApple) {
      const appleUrl =
        venueSummary?.appleMapsUrl ||
        `https://maps.apple.com/?q=${encodeURIComponent(hall)}&ll=27.4958,77.4683&address=${encodeURIComponent(`${address}, ${city}`)}`
      window.open(appleUrl, '_blank', 'noopener,noreferrer')
      return
    }

    const googleUrl = venueSummary?.mapUrl || 'https://maps.app.goo.gl/MrznUHbn5yhMNbv8A'
    window.open(googleUrl, '_blank', 'noopener,noreferrer')
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
          {landmark && (
            <p className="venue-card__landmark">
              <span className="venue-card__landmark-label">Nearby Landmark:</span> {landmark}
            </p>
          )}
          <p className="venue-card__city">{city}</p>
        </div>

        {/* 2. Map Redirect Action Button (Adapts to Apple Maps on iOS, Google Maps on Android) */}
        <button
          type="button"
          className="venue-card__map-btn"
          onClick={handleOpenMap}
          aria-label={
            isAppleDevice
              ? 'Open wedding venue location in Apple Maps'
              : 'Open wedding venue location in Google Maps'
          }
        >
          <MapPinIcon className="venue-card__map-btn-icon" />
          <span>
            {isAppleDevice
              ? 'Open Live Location in Apple Maps'
              : 'Open Live Location in Google Maps'}
          </span>
          <span className="venue-card__map-btn-arrow" aria-hidden="true">↗</span>
        </button>
      </div>
    </section>
  )
}
