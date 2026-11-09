import { isConfirmed } from './weddingHelpers.js'

/**
 * calendar.js
 * Generates Google Calendar links and RFC 5545 downloadable .ics files
 * for Prachi & Sumit's wedding events.
 */

// Helper to format Date into UTC ISO compact format (e.g. 20261218T100000Z)
const formatIcsDate = (date) => {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

// Parses confirmed date string or returns null
export const parseEventDate = (dateStr, timeStr) => {
  if (!isConfirmed(dateStr)) return null

  const hasYear = /\b\d{4}\b/.test(dateStr)
  const normalizedDate = hasYear ? dateStr : `${dateStr} ${new Date().getFullYear()}`
  const combined = isConfirmed(timeStr) ? `${normalizedDate} ${timeStr}` : normalizedDate
  const parsed = new Date(combined)
  if (isNaN(parsed.getTime())) {
    // Attempt fallback format e.g. "December 18, 2026"
    const parsedAlt = new Date(normalizedDate)
    if (isNaN(parsedAlt.getTime())) return null
    return parsedAlt
  }
  return parsed
}

export const createGoogleCalendarUrl = ({ event, couple }) => {
  if (!event || !isConfirmed(event.date)) return null

  const startDate = parseEventDate(event.date, event.time)
  if (!startDate) return null

  // Default event duration: 4 hours
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000)

  const title = `${event.title} — ${couple?.groom?.firstName || 'Sumit'} & ${couple?.bride?.firstName || 'Prachi'} Wedding`
  const dates = `${formatIcsDate(startDate)}/${formatIcsDate(endDate)}`

  const locationParts = [event.venue, event.address].filter(isConfirmed)
  const location = locationParts.join(', ')

  const detailsParts = [
    event.tagline,
    isConfirmed(event.dressCode) ? `Dress Code: ${event.dressCode}` : null,
    `Celebrating the wedding of ${couple?.groom?.firstName || 'Sumit'} & ${couple?.bride?.firstName || 'Prachi'}`
  ].filter(Boolean)
  const details = detailsParts.join('\n\n')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: dates,
    details: details,
    location: location,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export const downloadIcsFile = ({ event, couple }) => {
  if (!event || !isConfirmed(event.date)) return false

  const startDate = parseEventDate(event.date, event.time)
  if (!startDate) return false

  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000)
  const title = `${event.title} — ${couple?.groom?.firstName || 'Sumit'} & ${couple?.bride?.firstName || 'Prachi'} Wedding`
  const locationParts = [event.venue, event.address].filter(isConfirmed)
  const location = locationParts.join(', ')
  const description = [
    event.tagline,
    isConfirmed(event.dressCode) ? `Dress Code: ${event.dressCode}` : null,
    `Celebrating the wedding of ${couple?.groom?.firstName || 'Sumit'} & ${couple?.bride?.firstName || 'Prachi'}`
  ].filter(Boolean).join(' \\n ')

  const now = new Date()
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Prachi and Sumit Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id || 'event'}-${Date.now()}@wedding.prachisumit`,
    `DTSTAMP:${formatIcsDate(now)}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${description.replace(/,/g, '\\,')}`,
    location ? `LOCATION:${location.replace(/,/g, '\\,')}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)

  const icsBlob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(icsBlob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${(event.title || 'wedding-event').toLowerCase().replace(/\s+/g, '-')}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}
