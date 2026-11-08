/**
 * weddingHelpers.js
 * Content validation and display helpers for Prachi & Sumit's wedding invitation.
 * Strictly adheres to Rule 2.1: Never renders raw '__' placeholders to guests.
 */

export const isConfirmed = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (trimmed === '' || trimmed.includes('__')) return false
  return true
}

export const cleanText = (value, fallback = '') => {
  return isConfirmed(value) ? value.trim() : fallback
}

export const hasValidPhone = (phone) => {
  if (!isConfirmed(phone)) return false
  const digits = phone.replace(/[^0-9+]/g, '')
  return digits.length >= 7
}

export const formatWhatsAppLink = (number, message) => {
  if (!isConfirmed(number)) return null
  const cleanNumber = number.replace(/[^0-9]/g, '')
  if (cleanNumber.length < 7) return null
  const encodedMsg = encodeURIComponent(message || 'Hello!')
  return `https://wa.me/${cleanNumber}?text=${encodedMsg}`
}

