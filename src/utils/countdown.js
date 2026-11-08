import { isConfirmed } from './weddingHelpers.js'

/**
 * countdown.js
 * Calculates real-time countdown to Prachi & Sumit's wedding ceremony.
 * Timezone: Asia/Kolkata (IST, UTC+05:30)
 */

export const getTargetWeddingDate = (weddingData) => {
  if (!weddingData) return null

  // 1. Check general.weddingDateISO if present
  if (isConfirmed(weddingData.general?.weddingDateISO)) {
    const d = new Date(weddingData.general.weddingDateISO)
    if (!isNaN(d.getTime())) return d
  }

  // 2. Check dedicated wedding ceremony event
  const weddingEvent = weddingData.events?.find((e) => e.id === 'wedding')
  if (weddingEvent && isConfirmed(weddingEvent.date)) {
    const timeStr = isConfirmed(weddingEvent.time) ? weddingEvent.time : '10:00:00'
    const d = new Date(`${weddingEvent.date} ${timeStr}`)
    if (!isNaN(d.getTime())) return d
  }

  // 3. Check general.date fallback
  if (isConfirmed(weddingData.general?.date)) {
    const d = new Date(weddingData.general.date)
    if (!isNaN(d.getTime())) return d
  }

  return null
}

export const calculateCountdown = (targetDate) => {
  if (!targetDate) {
    return {
      isAvailable: false,
      isLive: false,
      isConcluded: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const now = new Date().getTime()
  const target = targetDate.getTime()
  const diff = target - now

  // If wedding day is happening (within 24 hours of start)
  if (diff <= 0 && diff > -86400000) {
    return {
      isAvailable: true,
      isLive: true,
      isConcluded: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  // If concluded after 24 hours
  if (diff <= -86400000) {
    return {
      isAvailable: true,
      isLive: false,
      isConcluded: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  // Ticking countdown
  const seconds = Math.floor((diff / 1000) % 60)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  return {
    isAvailable: true,
    isLive: false,
    isConcluded: false,
    days,
    hours,
    minutes,
    seconds,
  }
}
