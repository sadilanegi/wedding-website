import { isConfirmed } from '../../utils/weddingHelpers.js'
import { GaneshaCrest, RoyalDivider, MonogramSeal } from './Ornaments'
import './InvitationHero.css'

export default function InvitationHero({ couple, general }) {
  const { bride, groom, monogram } = couple
  const hasBrideParents = isConfirmed(bride.parents)
  const hasGroomParents = isConfirmed(groom.parents)
  const hasDate = isConfirmed(general.date)
  const hasPlace = isConfirmed(general.place)

  return (
    <header className="hero" aria-label="Wedding announcement">
      {/* Sacred Invocation */}
      {general.showInvocation && (
        <div className="hero__invocation-wrap">
          <GaneshaCrest className="hero__ganesha" />
          <p className="hero__shloka" lang="sa">
            {general.invocation}
          </p>
          <p className="hero__shloka-en">{general.invocationSub}</p>
        </div>
      )}

      <RoyalDivider className="hero__divider hero__divider--top" />

      {/* Royal Kicker & Greeting */}
      <div className="hero__kicker-group">
        <span className="hero__kicker-ornament" aria-hidden="true">✦</span>
        <p className="hero__kicker">{general.heading}</p>
        <span className="hero__kicker-ornament" aria-hidden="true">✦</span>
      </div>

      <p className="hero__greeting">{general.invitationGreeting}</p>

      {/* The Couple Reveal — Visual Centerpiece */}
      <div className="hero__couple-stage">
        <h1 className="hero__names">
          <span className="hero__name hero__name--bride">{bride.firstName}</span>
          <span className="hero__amp" aria-hidden="true">
            <span className="hero__amp-line" />
            <span className="hero__amp-glyph">&amp;</span>
            <span className="hero__amp-line" />
          </span>
          <span className="sr-only"> and </span>
          <span className="hero__name hero__name--groom">{groom.firstName}</span>
        </h1>
      </div>

      {/* Parents / Heritage Line (Shown only when confirmed) */}
      {(hasBrideParents || hasGroomParents) && (
        <div className="hero__heritage">
          {hasBrideParents && (
            <p className="hero__parent-line">
              <span className="hero__parent-label">Daughter of</span> {bride.parents}
            </p>
          )}
          {hasGroomParents && (
            <p className="hero__parent-line">
              <span className="hero__parent-label">Son of</span> {groom.parents}
            </p>
          )}
        </div>
      )}

      {/* Invitation Plea & Tagline */}
      <p className="hero__plea">{general.invitationPlea}</p>
      
      {isConfirmed(general.tagline) && (
        <p className="hero__tagline">{general.tagline}</p>
      )}

      {/* Couple Monogram Royal Medallion */}
      <div className="hero__monogram-wrap">
        <MonogramSeal monogram={monogram} />
      </div>

      {/* Save the Date / Announcement Medallion */}
      <div className="hero__date-medallion">
        <div className="hero__medallion-border">
          <p className="hero__medallion-badge">Save The Date</p>
          {hasDate ? (
            <p className="hero__medallion-date">{general.date}</p>
          ) : (
            <p className="hero__medallion-pending">Celebration Dates To Be Unveiled Soon</p>
          )}
          {hasPlace && (
            <p className="hero__medallion-place">{general.place}</p>
          )}
        </div>
      </div>
    </header>
  )
}

