import { useState } from 'react'
import { isConfirmed, formatWhatsAppLink, hasValidPhone } from '../../utils/weddingHelpers.js'
import { RoyalDivider, WhatsAppIcon, PhoneIcon } from './Ornaments'
import './RSVPSection.css'

const DEFAULT_ATTENDANCE_OPTIONS = ['Joyfully Attending', 'Warm Wishes From Afar']
const GUEST_COUNTS = ['1', '2', '3', '4+']

export default function RSVPSection({ rsvp, couple }) {
  const validOptions =
    Array.isArray(rsvp?.attendanceOptions) &&
    rsvp.attendanceOptions.filter(isConfirmed).length > 0
      ? rsvp.attendanceOptions.filter(isConfirmed)
      : DEFAULT_ATTENDANCE_OPTIONS

  const [guestName, setGuestName] = useState('')
  const [attendance, setAttendance] = useState(validOptions[0])
  const [guestCount, setGuestCount] = useState('2')
  const [copiedRsvp, setCopiedRsvp] = useState(false)

  if (!rsvp) return null

  const hasPhone = hasValidPhone(rsvp.phone)
  const hasContactPerson = isConfirmed(rsvp.contactPerson)
  const hasDeadline = isConfirmed(rsvp.deadline)

  const coupleLabel =
    couple?.groom?.firstName && couple?.bride?.firstName
      ? `${couple.groom.firstName} & ${couple.bride.firstName}`
      : 'Sumit & Prachi'

  const baseGreeting = isConfirmed(rsvp.whatsappMessage)
    ? rsvp.whatsappMessage
    : `Hi ${coupleLabel}, I would love to confirm my attendance for your wedding celebrations!`

  const messageParts = [baseGreeting]
  if (guestName.trim()) {
    messageParts.push(`Guest Name: ${guestName.trim()}`)
  }
  messageParts.push(`Response: ${attendance}`)
  if (!attendance.toLowerCase().includes('afar') && !attendance.toLowerCase().includes('unable')) {
    messageParts.push(`Guests: ${guestCount}`)
  }
  const composedMessage = messageParts.join('\n')

  const whatsAppLink = formatWhatsAppLink(rsvp.whatsappNumber, composedMessage)
  const isWhatsAppReady = Boolean(whatsAppLink)

  const handleCopyOrShareRsvp = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `RSVP — ${coupleLabel} Wedding`,
          text: composedMessage,
        })
        return
      } catch {
        // Fallback to clipboard copy if user cancels share sheet
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(composedMessage)
        setCopiedRsvp(true)
        setTimeout(() => setCopiedRsvp(false), 2200)
      } catch {
        // ignore
      }
    }
  }

  return (
    <section className="rsvp-section" aria-label="RSVP and guest confirmation">
      <div className="rsvp-section__head">
        <RoyalDivider className="rsvp-section__divider" />
        <span className="rsvp-section__kicker">Warm Response</span>
        <h2 className="rsvp-section__title">Grace Us With Your Presence</h2>
      </div>

      <div className="rsvp-card">
        <p className="rsvp-card__note">
          {isConfirmed(rsvp.note)
            ? rsvp.note
            : 'Your esteemed presence will add boundless joy to our wedding celebrations. Please kindly confirm your attendance.'}
        </p>

        {hasDeadline && (
          <p className="rsvp-card__deadline">
            Kindly RSVP by <strong>{rsvp.deadline}</strong>
          </p>
        )}

        {/* Interactive Quick-RSVP Composer */}
        <div className="rsvp-composer" aria-label="Personalize your RSVP response">
          <label className="rsvp-composer__field">
            <span className="rsvp-composer__label">Your Name (Optional)</span>
            <input
              type="text"
              className="rsvp-composer__input"
              placeholder="Enter your name or family name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </label>

          <div className="rsvp-composer__field">
            <span className="rsvp-composer__label">Will You Join Us?</span>
            <div className="rsvp-composer__pills">
              {validOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`rsvp-composer__pill ${attendance === option ? 'is-selected' : ''}`}
                  onClick={() => setAttendance(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {!attendance.toLowerCase().includes('afar') &&
            !attendance.toLowerCase().includes('unable') && (
              <div className="rsvp-composer__field">
                <span className="rsvp-composer__label">Number of Guests</span>
                <div className="rsvp-composer__counts">
                  {GUEST_COUNTS.map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      className={`rsvp-composer__count-btn ${guestCount === cnt ? 'is-selected' : ''}`}
                      onClick={() => setGuestCount(cnt)}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Live Royal Dispatch Scroll Preview */}
          <div className="rsvp-composer__preview" aria-live="polite">
            <span className="rsvp-composer__preview-badge">✦ Royal Dispatch Preview ✦</span>
            <p className="rsvp-composer__preview-text">
              &ldquo;{guestName.trim() ? `${guestName.trim()} — ` : ''}
              {attendance}
              {!attendance.toLowerCase().includes('afar') &&
              !attendance.toLowerCase().includes('unable')
                ? ` (${guestCount} ${guestCount === '1' ? 'Guest' : 'Guests'})`
                : ''}
              &rdquo;
            </p>
          </div>
        </div>

        {/* WhatsApp & Direct Contact Actions */}
        <div className="rsvp-card__actions">
          {isWhatsAppReady ? (
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rsvp-card__btn rsvp-card__btn--whatsapp"
            >
              <WhatsAppIcon />
              <span>Send RSVP on WhatsApp</span>
            </a>
          ) : (
            <div className="rsvp-card__pending-wrap">
              <button
                type="button"
                className="rsvp-card__btn rsvp-card__btn--whatsapp"
                onClick={handleCopyOrShareRsvp}
              >
                <WhatsAppIcon />
                <span>
                  {copiedRsvp
                    ? '✓ RSVP Message Copied!'
                    : 'Prepare & Share RSVP Message'}
                </span>
              </button>
            </div>
          )}

          {hasPhone && (
            <div className="rsvp-card__phone-wrap">
              <span className="rsvp-card__or">or kindly call</span>
              <a href={`tel:${rsvp.phone}`} className="rsvp-card__phone-link">
                <PhoneIcon />
                <span>
                  {hasContactPerson ? `${rsvp.contactPerson}: ` : ''}
                  {rsvp.phone}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

