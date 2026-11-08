import { useState } from 'react'
import { isConfirmed } from '../../utils/weddingHelpers.js'
import { RoyalDivider, MonogramSeal, WhatsAppIcon, DiyaFlameIcon } from './Ornaments'
import './InvitationFooter.css'

export default function InvitationFooter({ couple, general, website }) {
  const [sharedFeedback, setSharedFeedback] = useState(false)
  const [blessingsCount, setBlessingsCount] = useState(0)
  const [burstKey, setBurstKey] = useState(0)

  const hasBlessing = isConfirmed(general?.familyBlessing)
  const hasHashtag = isConfirmed(couple?.hashtag)
  const hasThankYou = isConfirmed(website?.thankYouMessage)

  const coupleNames = `${couple.groom.firstName} & ${couple.bride.firstName}`

  const handleShowerBlessings = () => {
    setBlessingsCount((c) => c + 1)
    setBurstKey((k) => k + 1)
  }

  const handleShareInvite = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const shareText = `You are cordially invited to celebrate the wedding festivities of ${coupleNames}! ${shareUrl}`

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Wedding Invitation | ${coupleNames}`,
          text: `Together with their families, ${coupleNames} cordially invite you to celebrate their wedding festivities.`,
          url: shareUrl,
        })
        return
      } catch {
        // Fallback to WhatsApp share or clipboard
      }
    }

    const waShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(waShareUrl, '_blank', 'noopener,noreferrer')
    setSharedFeedback(true)
    setTimeout(() => setSharedFeedback(false), 2000)
  }

  return (
    <footer className="footer-section" aria-label="Closing blessings and couple branding">
      <RoyalDivider className="footer-section__divider" />

      {hasBlessing && (
        <p className="footer-section__blessing">{general.familyBlessing}</p>
      )}

      {hasThankYou && (
        <p className="footer-section__thank-you">{website.thankYouMessage}</p>
      )}

      {/* Interactive Sacred Diya & Ashirwad Floral Blessing Pavilion */}
      <div className="footer-ashirwad">
        <div className="footer-ashirwad__diyas" aria-hidden="true">
          {[0, 1, 2].map((idx) => (
            <span
              key={idx}
              className={`footer-ashirwad__diya ${blessingsCount > 0 ? 'is-glowing' : ''}`}
              style={{ '--diya-idx': idx }}
            >
              <DiyaFlameIcon lit />
            </span>
          ))}
        </div>

        <button
          type="button"
          className="footer-ashirwad__btn"
          onClick={handleShowerBlessings}
        >
          <span>✦ Shower Ashirwad &amp; Floral Blessings ✦</span>
        </button>

        {blessingsCount > 0 && (
          <p className="footer-ashirwad__count" aria-live="polite">
            🌸 {blessingsCount} {blessingsCount === 1 ? 'Sacred Blessing' : 'Sacred Blessings'} Showered on {coupleNames}!
          </p>
        )}

        {/* Celebratory Petal & Gold Sparkle Fountain on Tap */}
        {burstKey > 0 && (
          <div key={burstKey} className="footer-ashirwad__burst" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => {
              const angle = -Math.PI * 0.15 - (i / 17) * Math.PI * 0.7
              const dist = 55 + (i % 4) * 26
              const tx = `${(Math.cos(angle) * dist).toFixed(1)}px`
              const ty = `${(Math.sin(angle) * dist).toFixed(1)}px`
              return (
                <span
                  key={i}
                  className={`footer-ashirwad__petal ${i % 2 === 0 ? 'is-marigold' : 'is-rose'}`}
                  style={{ '--tx': tx, '--ty': ty }}
                />
              )
            })}
          </div>
        )}
      </div>

      <div className="footer-section__monogram">
        <MonogramSeal monogram={couple.monogram} />
      </div>

      <p className="footer-section__names">
        {couple.groom.firstName} &amp; {couple.bride.firstName}
      </p>

      {hasHashtag && (
        <p className="footer-section__hashtag">{couple.hashtag}</p>
      )}

      <div className="footer-section__share-wrap">
        <button
          type="button"
          className="footer-section__share-btn"
          onClick={handleShareInvite}
        >
          <WhatsAppIcon />
          <span>{sharedFeedback ? '✓ Opening Share...' : 'Share Wedding Invitation'}</span>
        </button>
      </div>

      <p className="footer-section__tribute">
        Crafted with love for an auspicious beginning
      </p>
    </footer>
  )
}
