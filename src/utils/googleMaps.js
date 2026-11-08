import { isConfirmed } from './weddingHelpers.js'

/**
 * googleMaps.js
 * Generates verified Google Maps direction links.
 * Strictly avoids using '__' placeholders.
 */

export const getDirectionsUrl = ({ mapUrl, address, venue, city, coordinates }) => {
  // If an explicit confirmed mapUrl is provided, verify it doesn't contain '__'
  if (isConfirmed(mapUrl) && !mapUrl.includes('__') && !mapUrl.endsWith('?q=')) {
    return mapUrl
  }

  // If coordinates are confirmed (e.g. "28.6139,77.2090")
  if (isConfirmed(coordinates)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinates.trim())}`
  }

  // Build destination query from confirmed pieces
  const queryParts = [venue, address, city].filter(isConfirmed)
  if (queryParts.length === 0) return null

  const destination = queryParts.join(', ')
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}
