import { isConfirmed, formatWhatsAppLink, hasValidPhone } from '../../utils/weddingHelpers.js'
import { RoyalDivider, WhatsAppIcon, PhoneIcon } from './Ornaments'
import './RSVPSection.css'

export default function RSVPSection({ rsvp }) {
  if (!rsvp) return null

  const hasPhone = hasValidPhone(rsvp.phone)
  const hasContactPerson = isConfirmed(rsvp.contactPerson)
  const whatsAppLink = formatWhatsAppLink(rsvp.whatsappNumber, rsvp.whatsappMessage)
  const isWhatsAppReady = Boolean(whatsAppLink)

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
              <span>Confirm on WhatsApp</span>
            </a>
          ) : (
            <div className="rsvp-card__pending-wrap">
              <button
                type="button"
                disabled
                className="rsvp-card__btn rsvp-card__btn--disabled"
              >
                <WhatsAppIcon />
                <span>RSVP Link Opening Soon</span>
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

