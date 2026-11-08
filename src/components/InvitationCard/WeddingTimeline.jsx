import { RoyalDivider } from './Ornaments'
import WeddingEventCard from './WeddingEventCard'
import './WeddingTimeline.css'

export default function WeddingTimeline({ events, couple }) {
  // STRICT FILTER: Strictly only allow the 5 confirmed functions; engagement is strictly excluded
  const allowedEvents = ['haldi', 'mehendi', 'sangeet', 'wedding', 'reception']
  const filteredEvents = events.filter((e) => allowedEvents.includes(e.id || e.theme))

  return (
    <section className="timeline-section" aria-label="Five sacred wedding celebrations">
      <div className="timeline-section__head">
        <RoyalDivider className="timeline-section__divider" />
        <span className="timeline-section__kicker">Sacred Festivities</span>
        <h2 className="timeline-section__title">The Wedding Celebrations</h2>
        <p className="timeline-section__sub">
          Five auspicious ceremonies to celebrate love, tradition, and eternal union
        </p>
      </div>

      <div className="timeline-section__list">
        {filteredEvents.map((event, index) => (
          <WeddingEventCard
            key={event.id || index}
            event={event}
            index={index}
            couple={couple}
          />
        ))}
      </div>
    </section>
  )
}

