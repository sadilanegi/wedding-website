import { isConfirmed } from '../../utils/weddingHelpers.js'
import { RoyalDivider, MonogramSeal } from './Ornaments'
import './InvitationFooter.css'

export default function InvitationFooter({ couple, general }) {
  const hasBlessing = isConfirmed(general?.familyBlessing)
  const hasHashtag = isConfirmed(couple?.hashtag)

  return (
    <footer className="footer-section" aria-label="Closing blessings and couple branding">
      <RoyalDivider className="footer-section__divider" />

      {hasBlessing && (
        <p className="footer-section__blessing">{general.familyBlessing}</p>
      )}

      <div className="footer-section__monogram">
        <MonogramSeal monogram={couple.monogram} />
      </div>

      <p className="footer-section__names">
        {couple.groom.firstName} &amp; {couple.bride.firstName}
      </p>

      {hasHashtag && (
        <p className="footer-section__hashtag">{couple.hashtag}</p>
      )}

      <p className="footer-section__tribute">
        Crafted with love for an auspicious beginning
      </p>
    </footer>
  )
}

