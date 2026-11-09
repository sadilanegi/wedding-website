import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { useWeddingPerspective } from '../../utils/weddingPerspective.js'
import {
  SvgGoldDefs,
  GaneshaCrest,
  PichwaiKadambaToran,
  PichwaiFullCardWatermark,
  CornerFlourish,
  RoyalDivider,
  KrishnaBansuriCrest,
  KamdhenuBlessingPair,
  EventEmblem,
  ScheduleMedallionIcon,
  SacredScrollIcon,
  MapPinIcon,
} from '../InvitationCard/Ornaments'
import './PrintableInvitationCard.css'

export default function PrintableInvitationCard({
  guestName = '',
  _weddingData,
  forwardedRef,
}) {
  const perspective = useWeddingPerspective()
  const [qrDataUrl, setQrDataUrl] = useState('')

  const mapDestinationUrl =
    'https://www.google.com/maps/search/?api=1&query=Vrindavan%2C%20Uttar%20Pradesh'

  useEffect(() => {
    QRCode.toDataURL(mapDestinationUrl, {
      margin: 1,
      width: 240,
      color: {
        dark: '#541525',
        light: '#fffdf8',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {
        // fallback
      })
  }, [])

  const events = [
    {
      id: 'haldi',
      theme: 'haldi',
      num: '01',
      title: 'Haldi Ceremony',
      subtitle: 'Braj Ki Kesar Haldi • Sacred Turmeric',
      date: '10 December',
      time: '10:00 AM',
      dressCode: 'Sunshine Yellow & Florals',
      tagline:
        'Mangal Haldi & Phoolon Ki Holi — Sacred turmeric paste, fragrant marigolds, and joyful folk songs under divine grace.',
      image: '/events/haldi.jpg',
      themeColor: '#d97706',
    },
    {
      id: 'mehendi',
      theme: 'mehendi',
      num: '02',
      title: 'Mehendi Ceremony',
      subtitle: 'Kunj Galiyon Ki Mehendi • Auspicious Henna',
      date: '10 December',
      time: '5:00 PM',
      dressCode: 'Henna Greens & Pastels',
      tagline:
        'Kunj Galiyon Ki Mehendi — Auspicious peacock motifs, rich henna fragrance, and celebration of Radha-Krishna folk melodies.',
      image: '/events/mehendi.jpg',
      themeColor: '#15803d',
    },
    {
      id: 'wedding',
      theme: 'wedding',
      num: '03',
      title: 'Wedding Ceremony',
      subtitle: 'Rukmini-Kalyanam • Sacred Vedic Union',
      date: '11 December',
      time: '10:00 AM (Saat Pheras)',
      dressCode: 'Traditional Royal Ethnic / Vermillion & Gold',
      tagline:
        'Rukmini-Kalyanam & Vedic Pheras — The sacred Vedic rituals, kanyadaan, and seven holy vows around the sacred fire.',
      image: '/events/wedding.jpg',
      themeColor: '#b91c1c',
    },
    {
      id: 'reception',
      theme: 'reception',
      num: '04',
      title: 'Grand Reception',
      subtitle: 'Divya Raas • Royal Evening Gala',
      date: '11 December',
      time: '7:00 PM',
      dressCode: 'Black Tie / Indo-Western Haute Couture',
      tagline:
        'Divya Raas & Royal Evening Gala — An enchanted starlit celebration of love, exquisite banquet, and lifelong memories.',
      image: '/events/reception.jpg',
      themeColor: '#1e3a8a',
    },
  ]

  const displayGuestName =
    guestName.trim() !== '' ? guestName.trim() : 'Our Honoured Guests & Family'

  // Auto-fit the guest name onto ONE line across the full card width.
  // ~620px usable width; Cormorant Garamond bold averages ~0.5em per character.
  const guestNameFontSize = Math.max(
    18,
    Math.min(32, Math.floor(600 / (displayGuestName.length * 0.5)))
  )

  return (
    <div ref={forwardedRef} className="print-card">
      {/* 24K Gold & Metallic Gradient System */}
      <SvgGoldDefs />

      {/* Authentic Pichwai Tapestry Watermark */}
      <PichwaiFullCardWatermark className="print-card__watermark" />

      {/* 24K Gold Triple Border Frame & 4 Corner Mayurs */}
      <div className="print-card__frame" aria-hidden="true">
        <CornerFlourish position="top-left" />
        <CornerFlourish position="top-right" />
        <CornerFlourish position="bottom-left" />
        <CornerFlourish position="bottom-right" />
        <PichwaiKadambaToran className="print-card__toran" />
      </div>

      <div className="print-card__inner">
        {/* ====================================================================
            1. SACRED DIVINE INVOCATION
            ==================================================================== */}
        <header className="print-card__header">
          <div className="print-card__ganesha-wrap">
            <GaneshaCrest className="print-card__ganesha-svg" />
          </div>

          <p className="print-card__invocation-hindi" lang="sa">
            ॥ श्री गणेशाय नमः ॥
          </p>
          <p className="print-card__invocation-sub">OM SHRI GANESHAYA NAMAH</p>

          <RoyalDivider className="print-card__divider" />

          <p className="print-card__shloka" lang="sa">
            ॥ हे कृष्ण करुणासिन्धो दीनबन्धो जगत्पते । गोपेष गोपिकाकान्त राधाकान्त नमोऽस्तु ते ॥
          </p>

          <div className="print-card__kicker-wrap">
            <span className="print-card__kicker">
              ✦ ROYAL WEDDING INVITATION · सस्नेह निमंत्रण ✦
            </span>
            <p className="print-card__greeting">Together with their families</p>
          </div>
        </header>

        {/* ====================================================================
            2. ROYAL COUPLE BANNER & CEREMONIAL DETAILS
            ==================================================================== */}
        <section className="print-card__couple-section">
          {/* Full-width Royal Banner using the social preview image */}
          <div className="print-card__couple-banner-frame">
            <img
              src="/og/wedding-preview.jpg"
              alt="Sumit and Prachi Wedding Preview"
              className="print-card__couple-banner-img"
              crossOrigin="anonymous"
            />
            <div className="print-card__couple-banner-border" aria-hidden="true" />
          </div>

          <h1 className="print-card__couple-names">
            {perspective.primaryName} &amp; {perspective.secondaryName}
          </h1>

          <p className="print-card__blessing-tagline">
            Joined in Love, Blessed by the Eternal Grace of Lord Krishna &amp; Shri Radha
          </p>

          <div className="print-card__span-badge">
            <span className="print-card__span-date">10 &amp; 11 December 2026</span>
            <span className="print-card__span-bullet">✦</span>
            <span className="print-card__span-city">Vrindavan, Uttar Pradesh</span>
          </div>
        </section>

        {/* ====================================================================
            3. PERSONALIZED GUEST INVITATION RIBBON
            ==================================================================== */}
        <section className="print-card__guest-ribbon">
          <div className="print-card__guest-ribbon-badge">
            <span className="print-card__guest-badge-star">✦</span>
            <span>सस्नेह निमंत्रण · CORDIALLY INVITING</span>
            <span className="print-card__guest-badge-star">✦</span>
          </div>

          <h2
            className="print-card__guest-name"
            style={{ fontSize: `${guestNameFontSize}px` }}
          >
            {displayGuestName}
          </h2>

          <p className="print-card__invitation-plea">
            Request the honour of your gracious presence and blessings to celebrate the wedding festivities of their children
          </p>
        </section>

        {/* ====================================================================
            4. SCHEDULE HIGHLIGHTS BANNER (DAY 1 & DAY 2)
            ==================================================================== */}
        <section className="print-card__schedule-highlights">
          <div className="print-card__highlight-box">
            <span className="print-card__highlight-day">DAY 1 · 10 DECEMBER</span>
            <span className="print-card__highlight-event">Mangal Haldi · 10:00 AM</span>
            <span className="print-card__highlight-event">Mehendi · 5:00 PM</span>
          </div>
          <div className="print-card__highlight-divider" aria-hidden="true">✦</div>
          <div className="print-card__highlight-box">
            <span className="print-card__highlight-day">DAY 2 · 11 DECEMBER</span>
            <span className="print-card__highlight-event">Vedic Saat Pheras · 10:00 AM</span>
            <span className="print-card__highlight-event">Grand Reception · 7:00 PM</span>
          </div>
        </section>

        {/* ====================================================================
            5. THE FOUR SACRED WEDDING CEREMONIES (2 × 2 GRID)
            ==================================================================== */}
        <section className="print-card__events-section">
          {/* Lord Krishna Divine Bansuri & Mor Pankh Crest flanked by Kamdhenu Cows */}
          <div className="print-card__krishna-banner" aria-hidden="true">
            <div className="print-card__crest-wrapper">
              <KamdhenuBlessingPair className="print-card__kamdhenu-svg" />
              <KrishnaBansuriCrest className="print-card__krishna-crest" />
            </div>
            <p className="print-card__radhe-shloka" lang="sa">
              ॥ श्री राधाकृष्णाभ्यां नमः ॥
            </p>
            <p className="print-card__radhe-sub">
              Blessed by the Divine Grace of Shri Radha-Krishna
            </p>
          </div>

          <span className="print-card__events-kicker">✦ SACRED FESTIVITIES ✦</span>
          <h2 className="print-card__events-title">The Wedding Celebrations</h2>
          <p className="print-card__events-desc">
            Four auspicious ceremonies to celebrate love, tradition, and eternal union
          </p>

          {/* 2 × 2 Ceremony Grid */}
          <div className="print-card__events-list">
            {events.map((ev) => (
              <article key={ev.id} className={`print-card__event-card print-card__event-card--${ev.theme}`}>
                {/* Clean Full-Width Ceremony Photo */}
                <div className="print-card__event-media">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="print-card__event-img"
                    crossOrigin="anonymous"
                  />
                  <div className="print-card__event-photo-overlay" aria-hidden="true" />
                  <div className="print-card__event-photo-border" aria-hidden="true" />

                  {/* Celebration Number Pill */}
                  <span
                    className="print-card__event-num-pill"
                    style={{ backgroundColor: ev.themeColor }}
                  >
                    Celebration {ev.num}
                  </span>
                </div>

                {/* Event Information Body spanning full width */}
                <div className="print-card__event-body">
                  <div className="print-card__event-header-row">
                    <div className="print-card__event-titles">
                      <span className="print-card__event-theme-sub">{ev.subtitle}</span>
                      <h3 className="print-card__event-title">{ev.title}</h3>
                    </div>
                    <div className="print-card__event-emblem-wrap" aria-hidden="true">
                      <EventEmblem theme={ev.theme} className="print-card__event-emblem" />
                    </div>
                  </div>

                  <p className="print-card__event-tagline">&ldquo;{ev.tagline}&rdquo;</p>

                  <div className="print-card__event-meta-row">
                    {/* Auspicious Schedule */}
                    <div className="print-card__meta-item">
                      <span className="print-card__meta-icon" aria-hidden="true">
                        <ScheduleMedallionIcon />
                      </span>
                      <div className="print-card__meta-text">
                        <span className="print-card__meta-label">Auspicious Schedule</span>
                        <span className="print-card__meta-val">
                          <strong>{ev.date}</strong> · {ev.time}
                        </span>
                      </div>
                    </div>

                    {/* Royal Attire & Dress Code */}
                    <div className="print-card__meta-item">
                      <span className="print-card__meta-icon" aria-hidden="true">
                        <SacredScrollIcon />
                      </span>
                      <div className="print-card__meta-text">
                        <span className="print-card__meta-label">Royal Attire &amp; Dress Code</span>
                        <span className="print-card__meta-val print-card__meta-val--dress">
                          {ev.dressCode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ====================================================================
            6. CELEBRATION VENUE & OFFLINE SCANNABLE QR CODE
            ==================================================================== */}
        <section className="print-card__venue-section">
          <div className="print-card__venue-box">
            <div className="print-card__venue-info">
              <div className="print-card__venue-header-row">
                <div className="print-card__venue-pin-badge" aria-hidden="true">
                  <MapPinIcon />
                </div>
                <div className="print-card__venue-header-text">
                  <span className="print-card__venue-kicker">
                    ✦ SACRED CELEBRATION LOCATION ✦
                  </span>
                  <h3 className="print-card__venue-hall">Venue &amp; Celebration Grounds</h3>
                </div>
              </div>

              <p className="print-card__venue-address">__, Vrindavan</p>
              <p className="print-card__venue-city">VRINDAVAN, UTTAR PRADESH</p>
              <p className="print-card__venue-district">
                Holy Land of Shri Radha Krishna · Mathura District
              </p>
              <p className="print-card__venue-note">
                Guests travelling to Vrindavan can scan the QR code alongside using any smartphone camera to open immediate live GPS directions on Google Maps or Apple Maps.
              </p>
            </div>

            {qrDataUrl && (
              <div className="print-card__qr-wrap">
                <div className="print-card__qr-frame">
                  <img
                    src={qrDataUrl}
                    alt="Scan for Directions to Vrindavan Venue"
                    className="print-card__qr-img"
                  />
                </div>
                <span className="print-card__qr-label">
                  SCAN FOR MAP &amp; DIRECTIONS
                </span>
                <span className="print-card__qr-sub">Instant GPS to Vrindavan</span>
              </div>
            )}
          </div>
        </section>

        {/* ====================================================================
            7. WARM RSVP & SACRED CLOSING BLESSINGS
            ==================================================================== */}
        <footer className="print-card__footer">
          <div className="print-card__rsvp-badge">
            <span className="print-card__rsvp-title">✦ RSVP &amp; WARM INVITATION ✦</span>
            <p className="print-card__rsvp-plea">
              Please kindly grace the occasion and confirm your presence with {perspective.coupleLabel}
            </p>
          </div>

          <p className="print-card__family-blessing">
            May the divine flute of Lord Krishna shower eternal love, harmony, and joy upon their sacred union. With best compliments from near and dear ones of both families.
          </p>

          <p className="print-card__radhe-closing" lang="sa">
            ॥ राधे राधे ॥
          </p>
          <p className="print-card__radhe-closing-sub">
            MAY SHRI RADHA-KRISHNA BLESS THIS ETERNAL UNION
          </p>

          <p className="print-card__footer-names">
            {perspective.primaryName} &amp; {perspective.secondaryName}
          </p>
          <p className="print-card__hashtag">#SUPRA</p>
        </footer>
      </div>
    </div>
  )
}
