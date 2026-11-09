import { useState } from 'react'
import { isConfirmed } from '../../utils/weddingHelpers.js'
import { useWeddingPerspective } from '../../utils/weddingPerspective.js'
import { RoyalDivider, WhatsAppIcon } from './Ornaments'
import './InvitationFooter.css'

export default function InvitationFooter({
  couple,
  general,
  website,
  onOpenDownloadModal,
}) {
  const [sharedFeedback, setSharedFeedback] = useState(false)
  const perspective = useWeddingPerspective()

  const hasBlessing = isConfirmed(general?.familyBlessing)
  const hasHashtag = isConfirmed(couple?.hashtag)
  const hasThankYou = isConfirmed(website?.thankYouMessage)

  const coupleNames = perspective.coupleLabel

  const handleShareInvite = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const currentParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
    // Ensure the shared link retains the active perspective (?side=bride or ?side=groom)
    currentParams.set('side', perspective.side)
    currentParams.delete('card')
    const queryString = currentParams.toString() ? `?${currentParams.toString()}` : `?side=${perspective.side}`
    const shareUrl = `${origin}/${queryString}`
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

      {/* Sacred Krishna Closing Blessing */}
      <div className="footer-section__krishna-closing" aria-hidden="true">
        <p className="footer-section__radhe-callout" lang="sa">॥ राधे राधे ॥</p>
        <p className="footer-section__radhe-sub">May Shri Radha-Krishna bless this eternal union</p>
      </div>

      <p className="footer-section__names">
        {perspective.primaryName} &amp; {perspective.secondaryName}
      </p>

      {hasHashtag && (
        <p className="footer-section__hashtag">{couple.hashtag}</p>
      )}

      <div className="footer-section__actions-wrap">
        <button
          type="button"
          className="footer-section__download-btn"
          onClick={onOpenDownloadModal}
        >
          <span className="footer-section__btn-icon" aria-hidden="true">📥</span>
          <span>Download Personalized Invitation (PDF)</span>
        </button>

        <button
          type="button"
          className="footer-section__share-btn"
          onClick={handleShareInvite}
        >
          <WhatsAppIcon />
          <span>{sharedFeedback ? '✓ Opening Share...' : 'Share Wedding Invitation'}</span>
        </button>
      </div>
    </footer>
  )
}
