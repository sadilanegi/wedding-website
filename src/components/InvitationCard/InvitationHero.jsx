import { isConfirmed } from '../../utils/weddingHelpers.js'
import { GaneshaCrest, RoyalDivider } from './Ornaments'
import CoupleVarmalaStage from '../CoupleVarmala/CoupleVarmalaStage'
import ScratchSaveTheDate from './ScratchSaveTheDate'
import './InvitationHero.css'

export default function InvitationHero({
  couple,
  general,
  introState = 'card',
  onCoupleContinue,
  onUnlockFestivities,
}) {
  const { bride, groom } = couple
  const hasBrideParents = isConfirmed(bride.parents)
  const hasGroomParents = isConfirmed(groom.parents)

  const groomFullName = isConfirmed(groom.lastName)
    ? `${groom.firstName} ${groom.lastName}`
    : groom.firstName

  const brideFullName = isConfirmed(bride.lastName)
    ? `${bride.firstName} ${bride.lastName}`
    : bride.firstName

  return (
    <header className="hero" aria-label="Wedding announcement">
      <div className="hero__upper-reveal">
        {/* Sacred Invocation (Lord Ganesha) */}
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

        {/* Sacred Krishna Mangalacharan */}
        <p className="hero__krishna-shloka" lang="sa">
          ॥ हे कृष्ण करुणासिन्धो दीनबन्धो जगत्पते । गोपेश गोपिकाकान्त राधाकान्त नमोऽस्तु ते ॥
        </p>

        {/* Royal Kicker & Greeting */}
        <div className="hero__kicker-group">
          <span className="hero__kicker-ornament" aria-hidden="true">✦</span>
          <p className="hero__kicker">{general.heading}</p>
          <span className="hero__kicker-ornament" aria-hidden="true">✦</span>
        </div>

        <p className="hero__greeting">{general.invitationGreeting}</p>
      </div>

      {/* Single Continuous 3D Bride & Groom Varmala Diorama (Full-screen Intro -> Card Hero) */}
      <CoupleVarmalaStage
        introState={introState}
        onSkipOrContinue={onCoupleContinue}
      />

      <div className="hero__lower-reveal">
        {/* The Couple Reveal — Pure, Clean, High-Contrast Royal Typography */}
        <div className="hero__couple-stage">
          <h1 className="hero__names">
            <span className="hero__name hero__name--groom">{groomFullName}</span>
            <span className="hero__amp" aria-hidden="true">
              <span className="hero__amp-line" />
              <span className="hero__amp-glyph">&amp;</span>
              <span className="hero__amp-line" />
            </span>
            <span className="sr-only"> and </span>
            <span className="hero__name hero__name--bride">{brideFullName}</span>
          </h1>
        </div>

        {/* Parents / Heritage Line (Shown only when confirmed) */}
        {(hasGroomParents || hasBrideParents) && (
          <div className="hero__heritage">
            {hasGroomParents && (
              <p className="hero__parent-line">
                <span className="hero__parent-label">Son of</span> {groom.parents}
              </p>
            )}
            {hasBrideParents && (
              <p className="hero__parent-line">
                <span className="hero__parent-label">Daughter of</span> {bride.parents}
              </p>
            )}
          </div>
        )}

        {/* Invitation Plea & Tagline */}
        <p className="hero__plea">{general.invitationPlea}</p>
        
        {isConfirmed(general.tagline) && (
          <p className="hero__tagline">{general.tagline}</p>
        )}

        {/* Interactive 24K Gold Foil Scratch-to-Reveal Save The Date Medallion */}
        <ScratchSaveTheDate general={general} onUnlock={onUnlockFestivities} />
      </div>
    </header>
  )
}

