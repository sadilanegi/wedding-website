import { useState, useCallback, useEffect, useRef } from 'react'
import wedding from '../../data/weddingContent.json'
import { SvgGoldDefs, CornerFlourish, PichwaiKadambaToran, PichwaiFullCardWatermark } from './Ornaments'
import InvitationHero from './InvitationHero'
import WeddingCountdown from './WeddingCountdown'
import WeddingTimeline from './WeddingTimeline'
import VenueSection from './VenueSection'
import RSVPSection from './RSVPSection'
import InvitationFooter from './InvitationFooter'
import AmbientParticles from './AmbientParticles'
import { use3DCardTilt } from '../../utils/use3DCardTilt.js'
import { useScrollReveal } from '../../utils/useScrollReveal.js'
import './InvitationCard.css'

export default function InvitationCard({
  introState = 'card',
  onCoupleContinue,
  onOpenDownloadModal,
}) {
  const { couple, general, events, venueSummary, rsvp } = wedding
  const { containerRef, cardRef } = use3DCardTilt()
  useScrollReveal(containerRef, introState !== 'couple')

  // Progressive Unlocking: Festivities are revealed after the 24K gold foil scratch ritual
  const [isFestivitiesUnlocked, setIsFestivitiesUnlocked] = useState(false)
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false)
  const userInteractedRef = useRef(false)
  const autoScrollHeroTimerRef = useRef(null)

  // Ensure card starts cleanly at the top on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [containerRef])

  // Auto-scroll down to the 24K gold foil scratch card when card view loads
  useEffect(() => {
    if (introState !== 'card') return undefined

    const stage = containerRef.current
    if (!stage) return undefined

    const markUserInteracted = () => {
      userInteractedRef.current = true
      if (autoScrollHeroTimerRef.current) {
        clearTimeout(autoScrollHeroTimerRef.current)
        autoScrollHeroTimerRef.current = null
      }
    }

    const handleScroll = () => {
      if (stage.scrollTop > 120) {
        setHasScrolledPastHero(true)
        markUserInteracted()
      } else if (stage.scrollTop < 40) {
        setHasScrolledPastHero(false)
      }
    }

    stage.addEventListener('scroll', handleScroll, { passive: true })
    stage.addEventListener('touchstart', markUserInteracted, { passive: true })
    stage.addEventListener('wheel', markUserInteracted, { passive: true })

    // If user has not scrolled within 2000ms, gently guide them down to the scratch card
    autoScrollHeroTimerRef.current = setTimeout(() => {
      if (userInteractedRef.current) return
      const scratchEl = stage.querySelector('.scratch-medallion')
      if (scratchEl) {
        scratchEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 2000)

    return () => {
      stage.removeEventListener('scroll', handleScroll)
      stage.removeEventListener('touchstart', markUserInteracted)
      stage.removeEventListener('wheel', markUserInteracted)
      if (autoScrollHeroTimerRef.current) {
        clearTimeout(autoScrollHeroTimerRef.current)
      }
    }
  }, [introState, containerRef])

  // Auto-scroll down to revealed festivities when unlocked
  useEffect(() => {
    if (!isFestivitiesUnlocked) return undefined
    const stage = containerRef.current
    if (!stage) return undefined

    const timer = setTimeout(() => {
      const chaptersBelow = stage.querySelector('.invite-card__chapters-below')
      if (chaptersBelow) {
        chaptersBelow.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 1200)

    return () => clearTimeout(timer)
  }, [isFestivitiesUnlocked, containerRef])

  const handleScrollToScratch = useCallback(() => {
    userInteractedRef.current = true
    if (autoScrollHeroTimerRef.current) {
      clearTimeout(autoScrollHeroTimerRef.current)
      autoScrollHeroTimerRef.current = null
    }
    const stage = containerRef.current
    const scratchEl = stage?.querySelector('.scratch-medallion')
    if (scratchEl) {
      scratchEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [containerRef])

  const handleUnlockFestivities = useCallback(() => {
    setIsFestivitiesUnlocked(true)
    setHasScrolledPastHero(true)
  }, [])

  return (
    <main
      ref={containerRef}
      className={`invite-stage invite-stage--${introState} ${!isFestivitiesUnlocked ? 'invite-stage--locked-festivities' : 'invite-stage--unlocked'}`}
      aria-label={`Royal wedding invitation for ${couple.groom.firstName} and ${couple.bride.firstName}`}
      onClick={introState === 'couple' ? onCoupleContinue : undefined}
    >
      {/* Global SVG Definitions for Metallic Gold Foils */}
      <SvgGoldDefs />

      {/* Warm Full-Bleed Royal Palace Veil during Couple Intro (Smoothly dissolves as Couple morphs into Card) */}
      <div className="invite-stage__couple-veil" aria-hidden="true" />

      {/* The Physical Luxury Handcrafted Card with Interactive 3D Depth */}
      <article ref={cardRef} className="invite-card">
        {/* Full-Bleed Authentic Pichwai Temple Tapestry Watermark across Cotton Rag Canvas */}
        <PichwaiFullCardWatermark className="invite-card__pichwai-watermark" />

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
          {/* Pichwai Kadamba & Golden Temple Bell Hanging Toran */}
          <PichwaiKadambaToran className="invite-card__toran" />

          {/* Pichwai Mayur Corner Flourishes */}
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
            onUnlockFestivities={handleUnlockFestivities}
          />

          <div
            className={`invite-card__chapters-below ${isFestivitiesUnlocked ? 'is-unlocked' : 'is-locked'}`}
            aria-hidden={!isFestivitiesUnlocked}
          >
            {/* Chapter 2: Astronomical Wedding Countdown */}
            <WeddingCountdown weddingData={wedding} />

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

            {/* Chapter 6: Closing Blessings & Download */}
            <InvitationFooter
              couple={couple}
              general={general}
              onOpenDownloadModal={onOpenDownloadModal}
            />
          </div>
        </div>
      </article>

      {/* Floating Royal Scroll Guide to Lead Guests to the 24K Gold Scratch Card */}
      {introState === 'card' && !isFestivitiesUnlocked && (
        <aside
          className={`invite-scroll-guide ${hasScrolledPastHero ? 'is-hidden' : ''}`}
          aria-hidden={hasScrolledPastHero}
        >
          <button
            type="button"
            className="invite-scroll-guide__btn"
            onClick={handleScrollToScratch}
            aria-label="Scroll down to reveal sacred scratch card"
          >
            <span className="invite-scroll-guide__star" aria-hidden="true">✦</span>
            <span className="invite-scroll-guide__label">Scroll Down to Unveil</span>
            <span className="invite-scroll-guide__arrow" aria-hidden="true">↓</span>
          </button>
        </aside>
      )}
    </main>
  )
}
