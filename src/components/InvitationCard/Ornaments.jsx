/**
 * Ornaments.jsx
 * Bespoke SVG vector ornamentation for Prachi & Sumit's luxury Indian wedding invitation.
 * Includes: Ganesha invocation crest, Mughal corner flourishes, filigree dividers,
 * monogram royal seal, and individual event motifs.
 */

// Shared SVG Gold Foil Gradient Definitions
export function SvgGoldDefs() {
  return (
    <svg
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gold-foil-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6e4612" />
          <stop offset="20%" stopColor="#b38728" />
          <stop offset="42%" stopColor="#fbf0b9" />
          <stop offset="52%" stopColor="#fff9e6" />
          <stop offset="68%" stopColor="#c79b36" />
          <stop offset="85%" stopColor="#7a4f15" />
          <stop offset="100%" stopColor="#c29837" />
        </linearGradient>

        <linearGradient id="gold-linear-subtle" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9a7024" stopOpacity="0" />
          <stop offset="25%" stopColor="#c59835" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#fbebb8" stopOpacity="1" />
          <stop offset="75%" stopColor="#c59835" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9a7024" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="gold-radial-seal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8db" />
          <stop offset="40%" stopColor="#d4aa48" />
          <stop offset="78%" stopColor="#92691e" />
          <stop offset="100%" stopColor="#54370a" />
        </radialGradient>

        {/* Lord Krishna Thematic Gradients */}
        <linearGradient id="peacock-feather-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="35%" stopColor="#0d9488" />
          <stop offset="65%" stopColor="#14b8a6" />
          <stop offset="85%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        <radialGradient id="peacock-eye-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="35%" stopColor="#1d4ed8" />
          <stop offset="60%" stopColor="#0d9488" />
          <stop offset="85%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>

        <linearGradient id="lotus-pink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="40%" stopColor="#f472b6" />
          <stop offset="80%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Sacred Ganesha & Lotus Invocation Crest
export function GaneshaCrest({ className = 'ornament-ganesha' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      width="68"
      height="68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="54" stroke="url(#gold-foil-grad)" strokeWidth="1.4" strokeDasharray="3 2" />
      <circle cx="60" cy="60" r="48" stroke="url(#gold-foil-grad)" strokeWidth="0.8" />
      {/* Ornate Lotus Base */}
      <path
        d="M60 88 C48 80 40 76 38 68 C45 70 53 74 60 80 C67 74 75 70 82 68 C80 76 72 80 60 88 Z"
        fill="url(#gold-foil-grad)"
        opacity="0.9"
      />
      {/* Traditional Sacred Ganesha / Om Motif */}
      <path
        d="M58 24 C64 24 69 28 69 34 C69 41 60 45 60 50 C60 55 64 58 68 58 C72 58 74 55 75 52 M53 36 C50 33 45 33 43 36 C40 39 40 45 44 49 C49 53 55 58 55 65 C55 72 48 76 41 74 M63 36 C66 33 72 33 75 36 M59 19 C59 19 60 22 62 22 C64 22 64 19 64 19"
        stroke="url(#gold-foil-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Auspicious Tilak & Accents */}
      <circle cx="60" cy="18" r="2" fill="url(#gold-foil-grad)" />
      <circle cx="60" cy="95" r="2.2" fill="url(#gold-foil-grad)" />
      <circle cx="25" cy="60" r="2.2" fill="url(#gold-foil-grad)" />
      <circle cx="95" cy="60" r="2.2" fill="url(#gold-foil-grad)" />
    </svg>
  )
}

// Sacred Lord Krishna Bansuri & Mor Pankh Invocation Crest
export function KrishnaBansuriCrest({ className = 'ornament-krishna' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 130"
      width="112"
      height="90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Lord Krishna Bansuri and Peacock Feather Crest"
    >
      {/* Outer Radiance Halo */}
      <circle cx="80" cy="65" r="58" stroke="url(#gold-foil-grad)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.65" />
      <circle cx="80" cy="65" r="52" stroke="url(#gold-foil-grad)" strokeWidth="0.5" opacity="0.45" />

      {/* Sunburst Rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="80"
          y1="8"
          x2="80"
          y2="14"
          stroke="url(#gold-foil-grad)"
          strokeWidth="1"
          strokeLinecap="round"
          transform={`rotate(${deg} 80 65)`}
          opacity="0.7"
        />
      ))}

      {/* 1. Divine Mor Pankh (Peacock Feather) */}
      <g id="mor-pankh" transform="translate(0, -2)">
        {/* Feather Quill Stem */}
        <path
          d="M80 106 C80 82 85 54 90 22"
          stroke="url(#gold-foil-grad)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Outer Feather Silhouette with Peacock Gradient */}
        <path
          d="M90 20 C106 24 116 38 112 54 C108 66 98 74 90 82 C82 74 72 66 68 54 C64 38 74 24 90 20 Z"
          fill="url(#peacock-feather-grad)"
          opacity="0.92"
        />

        {/* Radiating Filaments */}
        <path
          d="M90 22 C96 28 106 32 110 38 M90 32 C98 38 108 44 111 50 M90 44 C98 50 105 56 107 64 M90 56 C96 62 101 68 102 74 M90 22 C84 28 74 32 70 38 M90 32 C82 38 72 44 69 50 M90 44 C82 50 75 56 73 64 M90 56 C84 62 79 68 78 74"
          stroke="url(#gold-foil-grad)"
          strokeWidth="0.85"
          opacity="0.8"
        />

        {/* Peacock Eye */}
        <ellipse cx="90" cy="48" rx="14" ry="17" fill="url(#peacock-eye-radial)" stroke="url(#gold-foil-grad)" strokeWidth="1.2" />

        {/* Inner Heart of the Feather Eye */}
        <path
          d="M90 41 C94 41 97 44 97 48 C97 53 90 58 90 58 C90 58 83 53 83 48 C83 44 86 41 90 41 Z"
          fill="#0f172a"
          stroke="url(#gold-foil-grad)"
          strokeWidth="1"
        />
        <circle cx="90" cy="48" r="3" fill="#38bdf8" />
        <circle cx="90" cy="48" r="1.5" fill="#ffffff" />
      </g>

      {/* 2. Divine Golden Bansuri (Flute) */}
      <g id="bansuri" transform="rotate(-15 80 72)">
        {/* Main Flute Body */}
        <rect
          x="24"
          y="68"
          width="112"
          height="8"
          rx="4"
          fill="url(#gold-foil-grad)"
          stroke="#452709"
          strokeWidth="0.6"
        />
        {/* Mouthpiece & End Ferrules */}
        <rect x="28" y="67.5" width="3.5" height="9" rx="0.5" fill="#fff8dd" />
        <rect x="130" y="67.5" width="3.5" height="9" rx="0.5" fill="#fff8dd" />
        <rect x="35" y="67.5" width="2" height="9" rx="0.5" fill="#d4af37" />
        <rect x="123" y="67.5" width="2" height="9" rx="0.5" fill="#d4af37" />

        {/* 6 Finger Holes */}
        <ellipse cx="66" cy="72" rx="1.6" ry="1.6" fill="#381b08" />
        <ellipse cx="76" cy="72" rx="1.6" ry="1.6" fill="#381b08" />
        <ellipse cx="86" cy="72" rx="1.6" ry="1.6" fill="#381b08" />
        <ellipse cx="96" cy="72" rx="1.6" ry="1.6" fill="#381b08" />
        <ellipse cx="106" cy="72" rx="1.6" ry="1.6" fill="#381b08" />
        <ellipse cx="116" cy="72" rx="1.6" ry="1.6" fill="#381b08" />

        {/* Tassels with Pearl Drops */}
        <path d="M125 74 C124 82 123 88 121 95" stroke="url(#gold-foil-grad)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="121" cy="96" r="2.2" fill="#fff8dd" stroke="url(#gold-foil-grad)" strokeWidth="0.8" />
        <path d="M121 98 L119 108 L123 108 Z" fill="url(#gold-foil-grad)" />

        <path d="M129 74 C130 82 132 87 134 93" stroke="url(#gold-foil-grad)" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="134" cy="94" r="2.2" fill="#fff8dd" stroke="url(#gold-foil-grad)" strokeWidth="0.8" />
        <path d="M134 96 L132 106 L136 106 Z" fill="url(#gold-foil-grad)" />
      </g>

      {/* 3. Auspicious Lotus Blooms & Tilak */}
      <g id="base-lotus">
        {/* Center Petal */}
        <path
          d="M80 82 C74 92 73 104 80 114 C87 104 86 92 80 82 Z"
          fill="url(#lotus-pink-grad)"
          stroke="url(#gold-foil-grad)"
          strokeWidth="0.8"
        />
        {/* Left Petal */}
        <path
          d="M80 94 C71 95 62 101 64 110 C70 112 76 106 80 94 Z"
          fill="url(#lotus-pink-grad)"
          stroke="url(#gold-foil-grad)"
          strokeWidth="0.7"
          opacity="0.9"
        />
        {/* Right Petal */}
        <path
          d="M80 94 C89 95 98 101 96 110 C90 112 84 106 80 94 Z"
          fill="url(#lotus-pink-grad)"
          stroke="url(#gold-foil-grad)"
          strokeWidth="0.7"
          opacity="0.9"
        />
        {/* Krishna Tilak / Chandan */}
        <path
          d="M78 48 C78 40 76 34 80 28 C84 34 82 40 82 48 C82 52 78 52 78 48 Z"
          fill="#d97706"
        />
        <circle cx="80" cy="54" r="1.8" fill="#b91c1c" />
      </g>
    </svg>
  )
}

// Standalone Peacock Feather SVG Icon
export function PeacockFeatherIcon({ className = 'icon-peacock-feather', size = 24 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 42 C18 36 24 28 32 12" stroke="url(#gold-foil-grad)" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M32 10 C40 12 44 20 40 28 C36 34 30 38 24 40 C20 34 22 28 24 22 C26 16 28 12 32 10 Z"
        fill="url(#peacock-feather-grad)"
      />
      <ellipse cx="32" cy="22" rx="6" ry="8" fill="url(#peacock-eye-radial)" stroke="url(#gold-foil-grad)" strokeWidth="0.8" />
      <circle cx="32" cy="22" r="2.5" fill="#0f172a" />
      <circle cx="32" cy="22" r="1" fill="#38bdf8" />
    </svg>
  )
}

// Triple Flowing Peacock Feather Drape for Event Portrait Banners
export function FlowingPeacockFeatherDrape({ className = 'photo-peacock-drape' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="drape-shadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#081c15" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#drape-shadow)">
        {/* Feather 3: Smallest Bottom Down-Plume */}
        <g className="photo-peacock-feather photo-peacock-feather--small" transform="rotate(18 10 10)">
          <path d="M4 6 C16 26 28 44 42 62" stroke="url(#gold-foil-grad)" strokeWidth="1.1" strokeLinecap="round" />
          <path
            d="M42 60 C46 54 44 46 38 42 C32 46 32 54 42 60 Z"
            fill="url(#peacock-feather-grad)"
            opacity="0.85"
          />
          <ellipse cx="38" cy="50" rx="3.5" ry="4.5" fill="url(#peacock-eye-radial)" stroke="url(#gold-foil-grad)" strokeWidth="0.6" />
          <circle cx="38" cy="50" r="1.4" fill="#0f172a" />
        </g>

        {/* Feather 2: Medium Graceful Secondary Feather */}
        <g className="photo-peacock-feather photo-peacock-feather--medium" transform="rotate(32 10 8)">
          <path d="M6 4 C24 32 46 64 72 92" stroke="url(#gold-foil-grad)" strokeWidth="1.4" strokeLinecap="round" />
          <path
            d="M72 90 C84 80 82 66 70 58 C58 66 58 80 72 90 Z"
            fill="url(#peacock-feather-grad)"
            opacity="0.92"
          />
          <path
            d="M72 88 C78 76 84 68 76 60 M72 88 C66 76 60 68 68 60"
            stroke="url(#gold-foil-grad)"
            strokeWidth="0.7"
            opacity="0.7"
          />
          <ellipse cx="70" cy="72" rx="6.5" ry="8.5" fill="url(#peacock-eye-radial)" stroke="url(#gold-foil-grad)" strokeWidth="0.8" />
          <path d="M70 68 C72 68 74 70 74 72 C74 75 70 77 70 77 C70 77 66 75 66 72 C66 70 68 68 70 68 Z" fill="#0f172a" />
          <circle cx="70" cy="72" r="1.8" fill="#38bdf8" />
          <circle cx="70" cy="72" r="0.8" fill="#ffffff" />
        </g>

        {/* Feather 1: Majestic Primary Peacock Feather sweeping down-right */}
        <g className="photo-peacock-feather photo-peacock-feather--large" transform="rotate(46 10 6)">
          <path d="M8 2 C32 38 65 80 106 116" stroke="url(#gold-foil-grad)" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M106 114 C122 100 120 82 102 72 C86 82 86 100 106 114 Z"
            fill="url(#peacock-feather-grad)"
          />
          <path
            d="M106 112 C114 96 122 86 110 76 M106 112 C98 96 90 86 102 76"
            stroke="url(#gold-foil-grad)"
            strokeWidth="0.9"
            opacity="0.8"
          />
          <ellipse cx="102" cy="90" rx="9.5" ry="12" fill="url(#peacock-eye-radial)" stroke="url(#gold-foil-grad)" strokeWidth="1.1" />
          <path
            d="M102 84 C105 84 108 87 108 90 C108 94 102 97 102 97 C102 97 96 94 96 90 C96 87 99 84 102 84 Z"
            fill="#0f172a"
            stroke="url(#gold-foil-grad)"
            strokeWidth="0.6"
          />
          <circle cx="102" cy="90" r="2.8" fill="#38bdf8" />
          <circle cx="102" cy="90" r="1.2" fill="#ffffff" />
        </g>

        {/* Delicate Golden Starlight Sparkles */}
        <circle cx="120" cy="92" r="1.5" fill="#fff9e6" />
        <circle cx="132" cy="114" r="1.2" fill="#d4af37" />
        <circle cx="98" cy="126" r="1" fill="#fff9e6" />
      </g>
    </svg>
  )
}

// Authentic Pichwai Royal Temple Watermark for Event Cards
export function PichwaiCardWatermark({ className = 'card-pichwai-watermark' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="url(#gold-foil-grad)" strokeWidth="0.8" opacity="0.18">
        <path d="M190 140 C194 130 204 124 212 124 C218 124 224 128 226 134 C226 142 216 150 204 154 L196 158" strokeLinecap="round" />
        <path d="M214 124 C216 112 212 98 198 90 C206 98 208 108 208 116" strokeLinecap="round" />
        <path d="M220 124 C224 114 222 102 214 94 C220 102 222 110 220 118" strokeLinecap="round" />
        <path d="M198 144 C202 148 208 150 214 148" strokeDasharray="2 2" />
        <circle cx="206" cy="154" r="2.5" />
        <path d="M40 150 C34 138 32 126 40 114 C48 126 46 138 40 150 Z" />
        <path d="M40 134 C30 135 20 142 22 152 C30 154 36 148 40 134 Z" />
        <path d="M40 134 C50 135 60 142 58 152 C50 154 44 148 40 134 Z" />
        <path d="M10 160 C30 156 50 164 70 160 C90 156 110 164 130 160 C150 156 170 164 190 160 C210 156 230 164 240 160" />
        <path d="M20 168 C40 165 60 171 80 168 C100 165 120 171 140 168 C160 165 180 171 200 168 C220 165 235 170 240 168" strokeDasharray="3 3" />
        <path d="M10 20 C60 12 120 14 180 26 C210 32 230 44 240 60" strokeDasharray="4 3" />
        <circle cx="90" cy="18" r="4" />
        <circle cx="140" cy="22" r="5" />
        <circle cx="180" cy="30" r="4" />
      </g>
    </svg>
  )
}

// Mughal Architectural Corner Flourish
export function CornerFlourish({ position = 'top-left' }) {
  const transforms = {
    'top-left': 'none',
    'top-right': 'scale(-1, 1)',
    'bottom-left': 'scale(1, -1)',
    'bottom-right': 'scale(-1, -1)',
  }

  return (
    <svg
      className={`ornament-corner ornament-corner--${position}`}
      style={{ transform: transforms[position] }}
      viewBox="0 0 70 70"
      width="52"
      height="52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer corner frame line */}
      <path d="M4 66 V18 C4 10 10 4 18 4 H66" stroke="url(#gold-foil-grad)" strokeWidth="1.2" />
      {/* Inset hairline */}
      <path d="M10 66 V20 C10 14 14 10 20 10 H66" stroke="url(#gold-foil-grad)" strokeWidth="0.7" strokeDasharray="2 2" />
      {/* Ornate Indian Paisley / Vine Tendril */}
      <path
        d="M18 18 C24 12 34 14 36 22 C37 28 32 33 26 31 C22 29 22 23 26 21 C28 20 31 22 30 24"
        stroke="url(#gold-foil-grad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M20 38 C23 34 28 34 32 37 C36 40 37 46 34 50"
        stroke="url(#gold-foil-grad)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M38 20 C34 23 34 28 37 32 C40 36 46 37 50 34"
        stroke="url(#gold-foil-grad)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Corner Pearl Accent */}
      <circle cx="10" cy="10" r="2.2" fill="url(#gold-foil-grad)" />
      <circle cx="20" cy="6" r="1.2" fill="url(#gold-foil-grad)" />
      <circle cx="6" cy="20" r="1.2" fill="url(#gold-foil-grad)" />
    </svg>
  )
}

// Royal Indian Filigree Section Divider with Lotus Centerpiece
export function RoyalDivider({ className = 'ornament-divider' }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 280 24"
        width="100%"
        height="24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Left trail */}
        <line x1="20" y1="12" x2="115" y2="12" stroke="url(#gold-linear-subtle)" strokeWidth="1" />
        <circle cx="118" cy="12" r="1.5" fill="url(#gold-foil-grad)" />
        <circle cx="100" cy="12" r="1" fill="url(#gold-foil-grad)" />
        
        {/* Center Lotus Motif */}
        <path
          d="M140 4 C137 9 135 15 140 20 C145 15 143 9 140 4 Z"
          fill="url(#gold-foil-grad)"
        />
        <path
          d="M140 14 C134 11 127 12 125 17 C130 18 136 17 140 14 Z"
          fill="url(#gold-foil-grad)"
          opacity="0.85"
        />
        <path
          d="M140 14 C146 11 153 12 155 17 C150 18 144 17 140 14 Z"
          fill="url(#gold-foil-grad)"
          opacity="0.85"
        />
        <circle cx="140" cy="12" r="2" fill="#fff8dd" />

        {/* Right trail */}
        <circle cx="162" cy="12" r="1.5" fill="url(#gold-foil-grad)" />
        <circle cx="180" cy="12" r="1" fill="url(#gold-foil-grad)" />
        <line x1="165" y1="12" x2="260" y2="12" stroke="url(#gold-linear-subtle)" strokeWidth="1" />
      </svg>
    </div>
  )
}

// Royal Monogram Seal Medallion
export function MonogramSeal({ monogram = 'P & S', className = 'ornament-monogram' }) {
  return (
    <div className={className} aria-label={`Monogram ${monogram}`}>
      <div className="monogram-seal__rim">
        <div className="monogram-seal__inner">
          <svg className="monogram-seal__wreath" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="50" cy="50" r="44" stroke="url(#gold-foil-grad)" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
            <circle cx="50" cy="50" r="39" stroke="url(#gold-foil-grad)" strokeWidth="0.8" fill="none" />
            {/* Laurel sprigs */}
            <path
              d="M24 64 C20 54 22 42 30 32 C31 37 29 44 26 50 M76 64 C80 54 78 42 70 32 C69 37 71 44 74 50"
              stroke="url(#gold-foil-grad)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Divine Peacock Feather & Flute Crown Motif */}
            <g id="crown-morpankh" transform="translate(0, 1)">
              <ellipse cx="50" cy="15" rx="5.5" ry="7" fill="url(#peacock-eye-radial)" stroke="url(#gold-foil-grad)" strokeWidth="0.8" />
              <circle cx="50" cy="15" r="2" fill="#0f172a" />
              <circle cx="50" cy="15" r="0.9" fill="#38bdf8" />
              {/* Crossed Golden Bansuri */}
              <line x1="36" y1="23" x2="64" y2="18" stroke="url(#gold-foil-grad)" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="37" cy="22.8" r="1" fill="#fff8dd" />
              <circle cx="63" cy="18.2" r="1" fill="#fff8dd" />
            </g>
          </svg>
          <span className="monogram-seal__text">{monogram}</span>
        </div>
      </div>
    </div>
  )
}

// 5 Bespoke Event Emblems for the Sacred Celebrations
export function EventEmblem({ theme = 'wedding', className = 'event-emblem' }) {
  switch (theme) {
    case 'haldi':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Haldi Sunburst & Marigold Bloom */}
          <circle cx="32" cy="32" r="28" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="32" cy="32" r="16" fill="#fef3c7" stroke="url(#gold-foil-grad)" strokeWidth="1.5" />
          {/* 8 radiating marigold petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={i}
              cx="32"
              cy="16"
              rx="4"
              ry="7"
              fill="url(#gold-foil-grad)"
              opacity="0.9"
              transform={`rotate(${angle} 32 32)`}
            />
          ))}
          <circle cx="32" cy="32" r="7" fill="#d97706" />
          <circle cx="32" cy="32" r="3" fill="#fff8dd" />
        </svg>
      )

    case 'mehendi':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Intricate Henna Mandala / Paisley */}
          <circle cx="32" cy="32" r="28" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 2" />
          <path
            d="M32 12 C38 18 42 26 40 34 C38 42 30 46 24 42 C18 38 18 28 26 24 C30 22 34 26 33 30 C32 33 28 33 27 31"
            stroke="url(#gold-foil-grad)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="28" cy="30" r="1.5" fill="#15803d" />
          <path
            d="M40 36 C44 38 48 44 46 50 C44 54 38 54 36 50"
            stroke="url(#gold-foil-grad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="32" cy="32" r="3" fill="#15803d" />
        </svg>
      )

    case 'sangeet':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Musical Stars & Royal Sitar Arch */}
          <circle cx="32" cy="32" r="28" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 2" />
          {/* Crescent & Musical Note Flourish */}
          <path
            d="M22 46 C18 42 18 34 22 26 C26 18 34 14 42 16 C38 18 34 22 34 28 C34 36 40 42 46 42 C40 48 30 50 22 46 Z"
            fill="url(#gold-foil-grad)"
            opacity="0.85"
          />
          {/* Sparkling Stars */}
          <path d="M44 22 L45 26 L49 27 L45 28 L44 32 L43 28 L39 27 L43 26 Z" fill="#7e22ce" />
          <path d="M26 20 L27 22 L29 23 L27 24 L26 26 L25 24 L23 23 L25 22 Z" fill="url(#gold-foil-grad)" />
          <circle cx="44" cy="27" r="1" fill="#fff8dd" />
        </svg>
      )

    case 'wedding':
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Sacred Vedic Agni / Havan Mandap */}
          <circle cx="32" cy="32" r="28" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 2" />
          {/* Sacred Kalash / Fire Altar */}
          <path
            d="M18 48 H46 L42 42 H22 L18 48 Z"
            fill="url(#gold-foil-grad)"
          />
          <path
            d="M24 42 H40 L38 38 H26 L24 42 Z"
            fill="#b91c1c"
            opacity="0.8"
          />
          {/* Holy Flame / Agni */}
          <path
            d="M32 16 C35 22 38 26 36 32 C34 36 30 36 28 32 C26 28 28 24 32 16 Z"
            fill="url(#gold-foil-grad)"
          />
          <path
            d="M32 23 C33 26 35 28 34 31 C33 33 31 33 30 31 C29 29 30 27 32 23 Z"
            fill="#b91c1c"
          />
        </svg>
      )

    case 'reception':
    default:
      return (
        <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Grand Palace Arch & Chandelier */}
          <circle cx="32" cy="32" r="28" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 2" />
          {/* Royal Mughal Mehrab Arch */}
          <path
            d="M20 48 V34 C20 26 26 20 32 16 C38 20 44 26 44 34 V48"
            stroke="url(#gold-foil-grad)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Chandelier pendant */}
          <line x1="32" y1="16" x2="32" y2="28" stroke="url(#gold-foil-grad)" strokeWidth="1.2" />
          <circle cx="32" cy="30" r="2.5" fill="#1e3a8a" />
          <circle cx="32" cy="30" r="1" fill="#fff8dd" />
          <path d="M26 38 H38" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      )
  }
}

// Icon Components for Clean, Unified Styling
export function MapPinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.16 8.16 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.88-.38-4.13-1.12l-.3-.18-3.07.81.82-2.99-.19-.31a8.17 8.17 0 0 1-1.25-4.45c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.55-.43l-.47-.01c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.13.17 1.74 2.65 4.21 3.71.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z" />
    </svg>
  )
}

export function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

// Bespoke 24K Gold Medallion Icons for Inner Boxes (Replacing plain emojis)
export function ScheduleMedallionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12.5" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 1.5" />
      <rect x="7.5" y="8.5" width="13" height="12" rx="2" stroke="url(#gold-foil-grad)" strokeWidth="1.3" />
      <line x1="7.5" y1="12.2" x2="20.5" y2="12.2" stroke="url(#gold-foil-grad)" strokeWidth="1.1" />
      <line x1="11" y1="6.5" x2="11" y2="9.8" stroke="url(#gold-foil-grad)" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="6.5" x2="17" y2="9.8" stroke="url(#gold-foil-grad)" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="14" cy="16.2" r="1.8" fill="currentColor" />
    </svg>
  )
}

export function PalaceVenueIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12.5" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 1.5" />
      <path
        d="M14 6.5 C10.4 6.5 7.8 9.2 7.8 12.6 C7.8 16.8 14 21.8 14 21.8 C14 21.8 20.2 16.8 20.2 12.6 C20.2 9.2 17.6 6.5 14 6.5 Z"
        stroke="url(#gold-foil-grad)"
        strokeWidth="1.35"
      />
      <circle cx="14" cy="12.4" r="2.3" fill="currentColor" />
    </svg>
  )
}

export function RoyalAttireIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12.5" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 1.5" />
      <path
        d="M14 6.5 L16 11.8 L21.5 14 L16 16.2 L14 21.5 L12 16.2 L6.5 14 L12 11.8 Z"
        stroke="url(#gold-foil-grad)"
        strokeWidth="1.25"
        fill="rgba(212, 175, 55, 0.14)"
      />
      <circle cx="14" cy="14" r="1.8" fill="currentColor" />
    </svg>
  )
}

export function SacredScrollIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12.5" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="2 1.5" />
      <rect x="8.5" y="7.5" width="11" height="13" rx="1.8" stroke="url(#gold-foil-grad)" strokeWidth="1.3" />
      <line x1="11" y1="11.5" x2="17" y2="11.5" stroke="url(#gold-foil-grad)" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="11" y1="14.2" x2="17" y2="14.2" stroke="url(#gold-foil-grad)" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="11" y1="16.9" x2="15" y2="16.9" stroke="url(#gold-foil-grad)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

export function CompassRoseIcon({ className = '' }) {
  return (
    <svg className={className} width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke="url(#gold-foil-grad)" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="24" cy="24" r="16" stroke="url(#gold-foil-grad)" strokeWidth="0.8" />
      <path d="M24 5 L27.2 20.8 L43 24 L27.2 27.2 L24 43 L20.8 27.2 L5 24 L20.8 20.8 Z" stroke="url(#gold-foil-grad)" strokeWidth="1.2" fill="rgba(212, 175, 55, 0.16)" />
      <circle cx="24" cy="24" r="3.2" fill="#641e32" stroke="url(#gold-foil-grad)" strokeWidth="1" />
    </svg>
  )
}

export function DiyaFlameIcon({ lit = true }) {
  return (
    <svg width="26" height="26" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      {/* Glowing Flame */}
      {lit && (
        <>
          <path
            d="M18 4 C21.5 9.5 23 13 21 16.5 C19.5 19 16.5 19 15 16.5 C13 13 14.5 9.5 18 4 Z"
            fill="#f59e0b"
          />
          <path
            d="M18 8 C19.8 11.2 20.5 13.5 19.5 15.5 C18.7 16.8 17.3 16.8 16.5 15.5 C15.5 13.5 16.2 11.2 18 8 Z"
            fill="#fef08a"
          />
        </>
      )}
      {/* Ornate Brass Diya Lamp Bowl */}
      <path
        d="M7 20 H29 C28 26.5 23.5 30 18 30 C12.5 30 8 26.5 7 20 Z"
        fill="url(#gold-foil-grad)"
        stroke="#7a4f15"
        strokeWidth="1"
      />
      <path d="M12 31.5 H24" stroke="url(#gold-foil-grad)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

