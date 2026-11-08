import wedding from '../../data/weddingContent.json'
import './InvitationCard.css'

const isConfirmed = (value) =>
  typeof value === 'string' && value.trim() !== '' && !value.includes('__')

function Rule() {
  return (
    <span className="invite__rule" aria-hidden="true">
      <span className="invite__diamond" />
    </span>
  )
}

function Detail({ label, value }) {
  return (
    <p className="invite__detail">
      <span className="invite__detail-label">{label}</span>
      <span className="invite__detail-value">{value}</span>
    </p>
  )
}

export default function InvitationCard() {
  const { couple, general, events, venueSummary, rsvp } = wedding
  const { bride, groom } = couple
  const whatsappReady = isConfirmed(rsvp.whatsappNumber)
  const phoneReady = isConfirmed(rsvp.phone)

  return (
    <main className="invite" aria-label={`Wedding invitation for ${bride.firstName} and ${groom.firstName}`}>
      <article className="invite__sheet">
        <header className="invite__masthead">
          {general.showInvocation && (
            <>
              <p className="invite__om" aria-hidden="true">ॐ</p>
              <p className="invite__shloka" lang="sa">{general.invocation}</p>
              <p className="invite__shloka-en">{general.invocationSub}</p>
            </>
          )}

          <Rule />

          <p className="invite__kicker">{general.heading}</p>
          <p className="invite__greeting">{general.invitationGreeting}</p>

          <h1 className="invite__names">
            <span className="invite__name">{bride.firstName}</span>
            <span className="invite__amp" aria-hidden="true">&amp;</span>
            <span className="sr-only"> and </span>
            <span className="invite__name">{groom.firstName}</span>
          </h1>

          <div className="invite__families">
            <p className="invite__person-line">Daughter of {bride.parents}</p>
            <p className="invite__person-line">Son of {groom.parents}</p>
            <p className="invite__person-line">
              <span className="invite__person-key">Surnames</span>
              {bride.lastName}
              <span aria-hidden="true"> · </span>
              {groom.lastName}
            </p>
          </div>

          <p className="invite__plea">{general.invitationPlea}</p>
          <p className="invite__tagline">{general.tagline}</p>

          <div className="invite__when">
            <p className="invite__when-label">Save the Date</p>
            <Detail label="Date" value={general.date} />
            <Detail label="Place" value={general.place} />
          </div>
        </header>

        <section className="invite__events" aria-label="Wedding celebrations">
          <div className="invite__section-head">
            <Rule />
            <h2 className="invite__section-title">The Celebrations</h2>
          </div>

          <ol className="invite__event-list">
            {events.map((event, index) => (
              <li key={event.id} className="invite__event">
                <p className="invite__event-index">0{index + 1}</p>
                <h3 className="invite__event-title">{event.title}</h3>
                <p className="invite__event-tagline">{event.tagline}</p>
                <div className="invite__event-details">
                  <p className="invite__detail">
                    <span className="invite__detail-label">Date</span> {event.date}
                    <span aria-hidden="true"> · </span>
                    <span className="invite__detail-label">Time</span> {event.time}
                  </p>
                  <Detail label="Venue" value={event.venue} />
                  <Detail label="Address" value={event.address} />
                  <Detail label="Attire" value={event.dressCode} />
                </div>
                {isConfirmed(event.mapUrl) && (
                  <a className="invite__link" href={event.mapUrl} target="_blank" rel="noopener noreferrer">
                    Directions
                  </a>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="invite__venue" aria-label={venueSummary.title}>
          <div className="invite__section-head">
            <Rule />
            <h2 className="invite__section-title">{venueSummary.title}</h2>
          </div>
          <Detail label="Hall" value={venueSummary.hall} />
          <Detail label="Address" value={venueSummary.address} />
          <Detail label="City" value={venueSummary.city} />
          {isConfirmed(venueSummary.mapUrl) && (
            <a className="invite__link" href={venueSummary.mapUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          )}
        </section>

        <section className="invite__rsvp" aria-label="RSVP">
          <div className="invite__section-head">
            <Rule />
            <h2 className="invite__section-title">RSVP</h2>
          </div>
          <p className="invite__rsvp-note">{rsvp.note}</p>
          {(whatsappReady || phoneReady) && (
            <div className="invite__rsvp-actions">
              {whatsappReady && (
                <a
                  className="invite__button"
                  href={`https://wa.me/${rsvp.whatsappNumber}?text=${encodeURIComponent(rsvp.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Confirm on WhatsApp
                </a>
              )}
              {phoneReady && (
                <a className="invite__link" href={`tel:${rsvp.phone}`}>
                  Call {isConfirmed(rsvp.contactPerson) ? rsvp.contactPerson : rsvp.phone}
                </a>
              )}
            </div>
          )}
        </section>

        <footer className="invite__footer">
          <Rule />
          <p className="invite__blessing">{general.familyBlessing}</p>
          <p className="invite__monogram">{couple.monogram}</p>
          <p className="invite__hashtag">{couple.hashtag}</p>
        </footer>
      </article>
    </main>
  )
}
