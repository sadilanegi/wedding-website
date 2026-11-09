import { useState } from 'react'
import { isConfirmed, hasValidPhone } from '../../utils/weddingHelpers.js'
import { RoyalDivider, PhoneIcon } from './Ornaments'
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
  const [personalMessage, setPersonalMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  if (!rsvp) return null

  const hasPhone = hasValidPhone(rsvp.phone)
  const hasContactPerson = isConfirmed(rsvp.contactPerson)
  const hasDeadline = isConfirmed(rsvp.deadline)

  const coupleLabel =
    couple?.groom?.firstName && couple?.bride?.firstName
      ? `${couple.groom.firstName} & ${couple.bride.firstName}`
      : 'Sumit & Prachi'

  const isAttending =
    !attendance.toLowerCase().includes('afar') &&
    !attendance.toLowerCase().includes('unable')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const payload = {
      name: guestName.trim() || 'Honoured Guest',
      attendance,
      guestCount: isAttending ? guestCount : '0',
      message: personalMessage.trim(),
    }

    const scriptUrl = rsvp?.googleSheetsScriptUrl?.trim()

    // If script URL is not yet configured or is placeholder, run demo simulation
    if (!scriptUrl || scriptUrl === '__') {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setIsSubmitting(false)
      setIsSubmitted(true)
      return
    }

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      })
      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (err) {
      console.error('RSVP submission error:', err)
      setIsSubmitting(false)
      setErrorMessage(
        'Unable to connect right now. Please check your internet connection and try again.'
      )
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setErrorMessage(null)
  }

  return (
    <section className="rsvp-section" aria-label="RSVP and guest confirmation">
      <div className="rsvp-section__head">
        <RoyalDivider className="rsvp-section__divider" />
        <span className="rsvp-section__kicker">Warm Response</span>
        <h2 className="rsvp-section__title">Grace Us With Your Presence</h2>
      </div>

      <div className="rsvp-card">
        {isSubmitted ? (
          <div className="rsvp-success-card" role="alert" aria-live="polite">
            <div className="rsvp-success-card__crest" aria-hidden="true">
              <span className="rsvp-success-card__lotus">🌸</span>
            </div>
            <span className="rsvp-success-card__kicker">
              ✦ Sacred Blessings Received ✦
            </span>
            <h3 className="rsvp-success-card__title">
              Thank You, {guestName.trim() || 'Honoured Guest'}!
            </h3>
            <p className="rsvp-success-card__body">
              {isAttending
                ? `Your attendance with ${guestCount} ${guestCount === '1' ? 'guest' : 'guests'} has been warmly recorded in our wedding guestbook. We eagerly look forward to celebrating with you!`
                : 'Your heartfelt blessings and warm wishes from afar have been conveyed to Sumit & Prachi. Thank you for holding us in your prayers.'}
            </p>
            {personalMessage.trim() && (
              <div className="rsvp-success-card__quote">
                <span className="rsvp-success-card__quote-badge">Your Blessing</span>
                <p>&ldquo;{personalMessage.trim()}&rdquo;</p>
              </div>
            )}
            <button
              type="button"
              className="rsvp-success-card__btn-reset"
              onClick={handleReset}
            >
              <span>Update or Submit Another Response</span>
            </button>
          </div>
        ) : (
          <form
            className="rsvp-form"
            onSubmit={handleSubmit}
            aria-label="Personalize your RSVP response"
          >
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

            <div className="rsvp-composer">
              <label className="rsvp-composer__field">
                <span className="rsvp-composer__label">Your Name / Family Name</span>
                <input
                  type="text"
                  required
                  className="rsvp-composer__input"
                  placeholder="e.g. Sharma Family / Rajesh Sharma"
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

              {isAttending && (
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

              <label className="rsvp-composer__field">
                <span className="rsvp-composer__label">
                  Personal Blessing or Message (Optional)
                </span>
                <textarea
                  className="rsvp-composer__textarea"
                  rows={3}
                  placeholder={`Leave a warm blessing or note for ${coupleLabel}...`}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  maxLength={400}
                />
              </label>

              {/* Live Preview pill */}
              <div className="rsvp-composer__preview" aria-live="polite">
                <span className="rsvp-composer__preview-badge">✦ Dispatch Summary ✦</span>
                <p className="rsvp-composer__preview-text">
                  &ldquo;{guestName.trim() ? `${guestName.trim()} — ` : ''}
                  {attendance}
                  {isAttending
                    ? ` (${guestCount} ${guestCount === '1' ? 'Guest' : 'Guests'})`
                    : ''}
                  &rdquo;
                </p>
              </div>
            </div>

            {errorMessage && (
              <p className="rsvp-card__error" role="alert">
                {errorMessage}
              </p>
            )}

            <div className="rsvp-card__actions">
              <button
                type="submit"
                className="rsvp-card__btn rsvp-card__btn--submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="rsvp-spinner" aria-hidden="true" />
                    <span>Recording RSVP...</span>
                  </>
                ) : (
                  <>
                    <span className="rsvp-btn-gem">✦</span>
                    <span>Confirm RSVP & Send Blessings</span>
                    <span className="rsvp-btn-gem">✦</span>
                  </>
                )}
              </button>

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
          </form>
        )}
      </div>
    </section>
  )
}
