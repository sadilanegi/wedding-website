import { isConfirmed } from '../../utils/weddingHelpers.js'
import { GaneshaCrest, RoyalDivider, MonogramSeal } from './Ornaments'
import CoupleVarmalaStage from '../CoupleVarmala/CoupleVarmalaStage'
import ScratchSaveTheDate from './ScratchSaveTheDate'
import './InvitationHero.css'

export default function InvitationHero({
  couple,
  general,
  introState = 'card',
  onCoupleContinue,
}) {
  const { bride, groom, monogram } = couple
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
      </div>

      {/* Single Continuous 3D Bride & Groom Varmala Diorama (Full-screen Intro -> Card Hero) */}
      <CoupleVarmalaStage
        introState={introState}
        onSkipOrContinue={onCoupleContinue}
      />

      <div className="hero__lower-reveal">
        {/* The Couple Reveal — Visual Centerpiece (Sumit on top, Prachi below) */}
        <div className="hero__couple-stage">
          {/* Gyroscope-Reactive 3D Sacred Mandala Halo */}
          <div className="hero__sacred-halo" aria-hidden="true">
            <svg
              className="hero__halo-svg"
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="120" cy="120" r="108" stroke="url(#gold-foil-grad)" strokeWidth="0.7" strokeDasharray="3 4" opacity="0.55" />
              <circle cx="120" cy="120" r="88" stroke="url(#gold-foil-grad)" strokeWidth="0.6" opacity="0.4" />
              <circle cx="120" cy="120" r="64" stroke="url(#gold-foil-grad)" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.35" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <path
                  key={deg}
                  d="M120 16 C126 36 126 52 120 68 C114 52 114 36 120 16 Z"
                  stroke="url(#gold-foil-grad)"
                  strokeWidth="0.65"
                  opacity="0.35"
                  transform={`rotate(${deg} 120 120)`}
                />
              ))}
            </svg>
          </div>

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

        {/* Couple Monogram Royal Medallion */}
        <div className="hero__monogram-wrap">
          <MonogramSeal monogram={monogram} />
        </div>

        {/* Interactive 24K Gold Foil Scratch-to-Reveal Save The Date Medallion */}
        <ScratchSaveTheDate general={general} />
      </div>
    </header>
  )
}

