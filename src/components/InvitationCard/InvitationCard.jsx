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

export default function InvitationCard({
  introState = 'card',
  onCoupleContinue,
}) {
  const { couple, general, events, venueSummary, rsvp, features, website } = wedding
  const { containerRef, cardRef } = use3DCardTilt()
  const showCountdown = features?.countdown !== false

  return (
    <main
      ref={containerRef}
      className={`invite-stage invite-stage--${introState}`}
      aria-label={`Royal wedding invitation for ${couple.groom.firstName} and ${couple.bride.firstName}`}
      onClick={introState === 'couple' ? onCoupleContinue : undefined}
    >
      {/* Global SVG Definitions for Metallic Gold Foils */}
      <SvgGoldDefs />

      {/* Warm Full-Bleed Royal Palace Veil during Couple Intro (Smoothly dissolves as Couple morphs into Card) */}
      <div className="invite-stage__couple-veil" aria-hidden="true" />

      {/* The Physical Luxury Handcrafted Card with Interactive 3D Depth */}
      <article ref={cardRef} className="invite-card">
        {/* Procedural Cotton Paper Texture Layers */}
        <div className="invite-card__texture-grain" aria-hidden="true" />
        <div className="invite-card__texture-vignette" aria-hidden="true" />
        <div className="invite-card__light-glint" aria-hidden="true" />
        {/* Dynamic Specular Gold Foil Reflection Sheen */}
        <div className="invite-card__specular-sheen" aria-hidden="true" />
        {/* Ambient 3D Floating Gold Dust Particles */}
        <AmbientParticles count={18} />

        {/* 3D Paper Bevel & Outer Inset Frame */}
        <div className="invite-card__frame" aria-hidden="true">
          <CornerFlourish position="top-left" />
          <CornerFlourish position="top-right" />
          <CornerFlourish position="bottom-left" />
          <CornerFlourish position="bottom-right" />
        </div>

        {/* Main Invitation Content Chapters */}
        <div className="invite-card__content">
          {/* Chapter 1: Sacred Hero & Single Continuous Couple Reveal */}
          <InvitationHero
            couple={couple}
            general={general}
            introState={introState}
            onCoupleContinue={onCoupleContinue}
          />

          <div className="invite-card__chapters-below">
            {/* Chapter 2: Astronomical Wedding Countdown */}
            {showCountdown && <WeddingCountdown weddingData={wedding} />}

            {/* Chapter 3: The Five Sacred Celebrations */}
            <WeddingTimeline
              events={events}
              couple={couple}
              venueSummary={venueSummary}
            />

            {/* Chapter 4: Venue Location & Live Relative Map Navigation */}
            <VenueSection venueSummary={venueSummary} events={events} />

            {/* Chapter 5: Warm Personal RSVP */}
            <RSVPSection rsvp={rsvp} couple={couple} />

            {/* Chapter 6: Closing Blessings & Monogram */}
            <InvitationFooter
              couple={couple}
              general={general}
              website={website}
            />
          </div>
        </div>
      </article>
    </main>
  )
}
