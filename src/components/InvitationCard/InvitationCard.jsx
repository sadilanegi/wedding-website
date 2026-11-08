import wedding from '../../data/weddingContent.json'
import { SvgGoldDefs, CornerFlourish } from './Ornaments'
import InvitationHero from './InvitationHero'
import WeddingCountdown from './WeddingCountdown'
import WeddingTimeline from './WeddingTimeline'
import VenueSection from './VenueSection'
import RSVPSection from './RSVPSection'
import InvitationFooter from './InvitationFooter'
import AmbientParticles from './AmbientParticles'
import { use3DCardTilt } from '../../utils/use3DCardTilt.js'
import './InvitationCard.css'

export default function InvitationCard() {
  const { couple, general, events, venueSummary, rsvp } = wedding
  const { containerRef, cardRef, needsIosPermission, enableMotion } = use3DCardTilt()

  return (
    <main
      ref={containerRef}
      className="invite-stage"
      aria-label={`Royal wedding invitation for ${couple.bride.firstName} and ${couple.groom.firstName}`}
    >
      {/* Global SVG Definitions for Metallic Gold Foils */}
      <SvgGoldDefs />

      {/* iOS Gyroscope Activation Banner (if Safari gesture permission needed) */}
      {needsIosPermission && (
        <aside className="invite-gyro-prompt" aria-label="Device Motion">
          <button
            type="button"
            className="invite-gyro-prompt__btn"
            onClick={enableMotion}
          >
            <span className="invite-gyro-prompt__icon">✨</span>
            <span>Enable 3D Tilt</span>
          </button>
        </aside>
      )}

      {/* The Physical Luxury Handcrafted Card with Interactive 3D Depth */}
      <article ref={cardRef} className="invite-card">
        {/* Procedural Cotton Paper Texture Layers */}
        <div className="invite-card__texture-grain" aria-hidden="true" />
        <div className="invite-card__texture-vignette" aria-hidden="true" />
        <div className="invite-card__light-glint" aria-hidden="true" />
        {/* Dynamic Specular Gold Foil Reflection Sheen */}
        <div className="invite-card__specular-sheen" aria-hidden="true" />
        {/* Ambient 3D Floating Gold Dust Particles */}
        <AmbientParticles count={16} />

        {/* 3D Paper Bevel & Outer Inset Frame */}
        <div className="invite-card__frame" aria-hidden="true">
          <CornerFlourish position="top-left" />
          <CornerFlourish position="top-right" />
          <CornerFlourish position="bottom-left" />
          <CornerFlourish position="bottom-right" />
        </div>

        {/* Main Invitation Content Chapters */}
        <div className="invite-card__content">
          {/* Chapter 1: Sacred Hero & Couple Reveal */}
          <InvitationHero couple={couple} general={general} />

          {/* Chapter 2: Astronomical Wedding Countdown */}
          <WeddingCountdown weddingData={wedding} />

          {/* Chapter 3: The Five Sacred Celebrations */}
          <WeddingTimeline events={events} couple={couple} />

          {/* Chapter 4: Venue Location & Map Navigation */}
          <VenueSection venueSummary={venueSummary} />

          {/* Chapter 5: Warm Personal RSVP */}
          <RSVPSection rsvp={rsvp} />

          {/* Chapter 6: Closing Blessings & Monogram */}
          <InvitationFooter couple={couple} general={general} />
        </div>
      </article>
    </main>
  )
}
