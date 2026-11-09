import { RoyalDivider, KrishnaBansuriCrest } from './Ornaments'
import WeddingEventCard from './WeddingEventCard'
import './WeddingTimeline.css'

export default function WeddingTimeline({ events, couple, venueSummary }) {
  // STRICT FILTER: Strictly only allow the 4 confirmed functions; sangeet and engagement are excluded
  const allowedEvents = ['haldi', 'mehendi', 'wedding', 'reception']
  const filteredEvents = events.filter((e) => allowedEvents.includes(e.id || e.theme))

  return (
    <section className="timeline-section" aria-label="Four sacred wedding celebrations">
      <div className="timeline-section__head">
        <RoyalDivider className="timeline-section__divider" />

        {/* Lord Krishna Divine Bansuri & Mor Pankh Crest Crowning the Celebrations */}
        <div className="timeline-section__krishna-banner" aria-hidden="true">
          <KrishnaBansuriCrest className="timeline-section__krishna-crest" />
          <p className="timeline-section__radhe-shloka" lang="sa">
            ॥ श्री राधाकृष्णाभ्यां नमः ॥
          </p>
          <p className="timeline-section__radhe-sub">
            Blessed by the Divine Grace of Shri Radha-Krishna
          </p>
        </div>

        <span className="timeline-section__kicker">Sacred Festivities</span>
        <h2 className="timeline-section__title">The Wedding Celebrations</h2>
        <p className="timeline-section__sub">
          Four auspicious ceremonies to celebrate love, tradition, and eternal union
        </p>
      </div>

      <div className="timeline-section__list">
        {filteredEvents.map((event, index) => (
          <WeddingEventCard
            key={event.id || index}
            event={event}
            index={index}
            couple={couple}
            venueSummary={venueSummary}
          />
        ))}
      </div>
    </section>
  )
}

