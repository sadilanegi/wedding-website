import { isConfirmed } from './weddingHelpers.js'

/**
 * googleMaps.js
 * Generates verified Google Maps & Apple Maps turn-by-turn direction links,
 * parses coordinates, computes relative distance/bearing from guest's GPS,
 * and builds interactive map embed URLs.
 * Strictly avoids rendering raw '__' placeholders.
 */

export const parseCoordinates = (value) => {
  if (!isConfirmed(value)) return null
  // Match "lat, lng" or "@lat,lng"
  const match = String(value).match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/)
  if (!match) return null
  const lat = parseFloat(match[1])
  const lng = parseFloat(match[2])
  if (isNaN(lat) || isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return null
  }
  return { lat, lng }
}

export const getDestinationQuery = ({ mapUrl, address, venue, venueOverride, city, coordinates }) => {
  if (isConfirmed(coordinates)) {
    return coordinates.trim()
  }

  const parsedFromUrl = parseCoordinates(mapUrl)
  if (parsedFromUrl) {
    return `${parsedFromUrl.lat},${parsedFromUrl.lng}`
  }

  const primaryVenue = isConfirmed(venueOverride) ? venueOverride : venue
  const queryParts = [primaryVenue, address, city].filter(isConfirmed)
  if (queryParts.length > 0) {
    return queryParts.join(', ')
  }

  return null
}

export const getDirectionsUrl = ({
  mapUrl,
  address,
  venue,
  venueOverride,
  city,
  coordinates,
  originCoords,
  travelMode = 'driving',
}) => {
  const destination = getDestinationQuery({
    mapUrl,
    address,
    venue,
    venueOverride,
    city,
    coordinates,
  })

  const hasValidOrigin =
    originCoords &&
    typeof originCoords.lat === 'number' &&
    typeof originCoords.lng === 'number'

  const originParam = hasValidOrigin
    ? `&origin=${encodeURIComponent(`${originCoords.lat},${originCoords.lng}`)}`
    : ''

  const modeParam = travelMode ? `&travelmode=${encodeURIComponent(travelMode)}` : ''

  // If we have a destination query, build a turn-by-turn directions URL
  if (destination) {
    return `https://www.google.com/maps/dir/?api=1${originParam}&destination=${encodeURIComponent(destination)}${modeParam}`
  }

  // If an explicit confirmed mapUrl is provided without '__'
  if (isConfirmed(mapUrl) && !mapUrl.includes('__') && !mapUrl.endsWith('?q=')) {
    return mapUrl
  }

  return null
}

export const getAppleMapsUrl = ({
  mapUrl,
  address,
  venue,
  venueOverride,
  city,
  coordinates,
  originCoords,
}) => {
  const destination = getDestinationQuery({
    mapUrl,
    address,
    venue,
    venueOverride,
    city,
    coordinates,
  })

  if (!destination) return null

  const saddr =
    originCoords && typeof originCoords.lat === 'number'
      ? `saddr=${encodeURIComponent(`${originCoords.lat},${originCoords.lng}`)}&`
      : ''

  return `https://maps.apple.com/?${saddr}daddr=${encodeURIComponent(destination)}&dirflg=d`
}

export const getEmbedMapUrl = ({
  mapUrl,
  address,
  venue,
  venueOverride,
  city,
  coordinates,
  originCoords,
}) => {
  const destination = getDestinationQuery({
    mapUrl,
    address,
    venue,
    venueOverride,
    city,
    coordinates,
  })

  if (destination) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=m&z=15&output=embed&iwloc=near`
  }

  if (
    originCoords &&
    typeof originCoords.lat === 'number' &&
    typeof originCoords.lng === 'number'
  ) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(`${originCoords.lat},${originCoords.lng}`)}&t=m&z=15&output=embed&iwloc=near`
  }

  return null
}

// Calculates Haversine distance (km) and compass bearing between two GPS points
export const calculateRelativePosition = (originCoords, destCoords) => {
  if (
    !originCoords ||
    !destCoords ||
    typeof originCoords.lat !== 'number' ||
    typeof destCoords.lat !== 'number'
  ) {
    return null
  }

  const toRad = (deg) => (deg * Math.PI) / 180
  const toDeg = (rad) => (rad * 180) / Math.PI

  const R = 6371 // Earth radius in km
  const dLat = toRad(destCoords.lat - originCoords.lat)
  const dLon = toRad(destCoords.lng - originCoords.lng)
  const lat1 = toRad(originCoords.lat)
  const lat2 = toRad(destCoords.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceKm = R * c

  // Bearing calculation
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  const brng = (toDeg(Math.atan2(y, x)) + 360) % 360

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const compass = directions[Math.round(brng / 45) % 8]

  // Approximate city driving time (avg 32 km/h)
  const estMinutes = Math.max(3, Math.round((distanceKm / 32) * 60))

  return {
    distanceKm: distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm),
    bearingDeg: Math.round(brng),
    compass,
    estTimeText:
      estMinutes < 60
        ? `~${estMinutes} mins drive`
        : `~${Math.floor(estMinutes / 60)}h ${estMinutes % 60}m drive`,
  }
}

export const detectUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy || 0),
        })
      },
      (err) => {
        if (err.code === 1) {
          reject(new Error('Location permission was denied. Please allow location access to find your route.'))
        } else if (err.code === 2) {
          reject(new Error('Unable to determine your current GPS position.'))
        } else {
          reject(new Error('Location request timed out. Please try again.'))
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  })
}
