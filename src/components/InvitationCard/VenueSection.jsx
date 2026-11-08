import { isConfirmed } from '../../utils/weddingHelpers.js'
import { getDirectionsUrl } from '../../utils/googleMaps.js'
import { RoyalDivider, MapPinIcon } from './Ornaments'
import './VenueSection.css'

export default function VenueSection({ venueSummary }) {
  if (!venueSummary) return null

  const directionsUrl = getDirectionsUrl({
    mapUrl: venueSummary.mapUrl,
    address: venueSummary.address,
    venue: venueSummary.hall || venueSummary.title,
    city: venueSummary.city,
    coordinates: venueSummary.coordinates,
  })

  const hasHall = isConfirmed(venueSummary.hall)
  const hasAddress = isConfirmed(venueSummary.address)
  const hasCity = isConfirmed(venueSummary.city)
  const hasAnyDetails = hasHall || hasAddress || hasCity

  return (
    <section className="venue-section" aria-label="Venue location and directions">
      <div className="venue-section__head">
        <RoyalDivider className="venue-section__divider" />
        <span className="venue-section__kicker">Celebration Location</span>
        <h2 className="venue-section__title">
          {venueSummary.title || 'The Wedding Venue'}
        </h2>
      </div>

      <div className="venue-card">
        <div className="venue-card__header-icon" aria-hidden="true">
          <MapPinIcon />
        </div>

        {hasAnyDetails ? (
          <div className="venue-card__content">
            {hasHall && (
              <h3 className="venue-card__hall">{venueSummary.hall}</h3>
            )}
            {hasAddress && (
              <p className="venue-card__address">{venueSummary.address}</p>
            )}
            {hasCity && (
              <p className="venue-card__city">{venueSummary.city}</p>
            )}
          </div>
        ) : (
          <div className="venue-card__pending">
            <p className="venue-card__pending-text">
              The grand celebration venue is currently being finalized.
            </p>
            <p className="venue-card__pending-sub">
              Live Google Maps directions and venue details will be provided here.
            </p>
          </div>
        )}

        <div className="venue-card__actions">
          {directionsUrl ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-card__btn"
            >
              <MapPinIcon />
              <span>Get Directions in Maps</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="venue-card__btn venue-card__btn--disabled"
            >
              <MapPinIcon />
              <span>Directions Available Soon</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

