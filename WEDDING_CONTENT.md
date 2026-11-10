# WEDDING_CONTENT.md — Confirmed Information, Placeholders & Data Architecture

## 1. Verified Information (Do Not Modify Without User Input)
- **Bride**: Prachi
- **Groom**: Sumit
- **Couple Monogram**: P & S
- **Celebration Scope**: Five sacred functions:
  1. Haldi
  2. Mehendi
  3. Sangeet
  4. Wedding Ceremony (Vivah Sanskar / Pheras)
  5. Reception

> [!WARNING]
> **STRICT EXCLUSION**: The **Engagement** ceremony is private/concluded and **MUST NOT** appear in any form on the wedding website or in any data structure.

---

## 2. Unconfirmed Details & Placeholder Tokens
All values listed below are currently unconfirmed and must be designated with the strict token `__`. 
**Under no circumstances should dates, venues, contacts, or family surnames be invented or assumed.**

| Content Field | Status | Placeholder Token |
| :--- | :--- | :--- |
| **Bride's Surname & Family Details** | Confirmed | Sharma (Pramod Sharma & Reena Sharma) |
| **Groom's Surname & Family Details** | Confirmed | Negi (Sadbir Negi & Urmila Negi) |
| **Parents & Family Host Names** | Confirmed | Confirmed in `weddingContent.json` |
| **Wedding Dates (Day, Month, Year)** | Confirmed | 10 – 11 December 2026 |
| **Function Start & End Timings** | Confirmed | Haldi: 10 AM, Mehendi: 5 PM, Vivah: 10 AM, Reception: 7 PM |
| **Venue Names & Banquet Halls** | Confirmed | Shri Giridhari Gaudiya Math |
| **City, State & Full Physical Addresses**| Confirmed | FFW9+GF6, Radha Kund Road, Govardhan, District Mathura, UP – 281123, India |
| **Nearby Landmark** | Confirmed | Govardhan Bus Stand |
| **Google Maps Coordinates & Links** | Confirmed | `https://share.google/C7Wn48eprzZGzMbFE` |
| **Dress Codes & Attire Color Themes** | Confirmed | Confirmed in `weddingContent.json` |
| **RSVP Contacts & Phone Numbers** | Unconfirmed | `__` |
| **Official Wedding Hashtag** | Confirmed | `#SUPRA` |
| **Live Deployed Domain URL** | Confirmed | `https://sumit-weds-prachi.netlify.app/` |

---

## 3. The 5 Wedding Functions (Detailed Blueprint)

### 3.1 Haldi Ceremony
- **Significance**: An intimate, joyous morning ritual of blessings where turmeric paste is applied to the couple for radiance and auspicious beginnings.
- **Date**: `__`
- **Time**: `__`
- **Venue**: `__`
- **Address**: `__`
- **Map Link**: `__`
- **Dress Code / Mood**: Sunshine Yellow, Mustards, Floral Attire (`__`)

### 3.2 Mehendi Ceremony
- **Significance**: A vibrant afternoon of intricate henna art, rhythmic folk songs, dholak beats, and lively celebration.
- **Date**: `__`
- **Time**: `__`
- **Venue**: `__`
- **Address**: `__`
- **Map Link**: `__`
- **Dress Code / Mood**: Henna Greens, Teal, Bright Festive Pastels (`__`)

### 3.3 Sangeet Night
- **Significance**: An electrifying musical extravaganza featuring family choreography, celebratory toasts, dazzling performances, and DJ beats.
- **Date**: `__`
- **Time**: `__`
- **Venue**: `__`
- **Address**: `__`
- **Map Link**: `__`
- **Dress Code / Mood**: Glamorous Evening Wear, Shimmer, Royal Purples & Golds (`__`)

### 3.4 Wedding Ceremony (Vivah Sanskar / Pheras)
- **Significance**: The sacred union solemnized through Vedic rituals, Jaimala, Kanyadaan, and the seven sacred vows (Saat Pheras) around the holy fire.
- **Date**: `__`
- **Time**: `__`
- **Venue**: `__`
- **Address**: `__`
- **Map Link**: `__`
- **Dress Code / Mood**: Traditional Royal Ethnic, Vermillion, Ivory & Gold (`__`)

### 3.5 Reception
- **Significance**: The grand finale evening welcoming family, friends, and dignitaries to congratulate the newly wedded couple and celebrate over royal banquet dinner.
- **Date**: `__`
- **Time**: `__`
- **Venue**: `__`
- **Address**: `__`
- **Map Link**: `__`
- **Dress Code / Mood**: Black Tie, Formal Elegance, Indo-Western Haute Couture (`__`)

---

## 4. Content Architecture & JavaScript Schema

When implementing the website, all content must be stored in a standalone data module (e.g. `src/data/weddingData.js`). This ensures zero tight-coupling between data and visual components.

```javascript
// Target Schema Example for src/data/weddingData.js
export const weddingData = {
  couple: {
    bride: {
      firstName: "Prachi",
      lastName: "__",
      parents: "__",
    },
    groom: {
      firstName: "Sumit",
      lastName: "__",
      parents: "__",
    },
    monogram: "P & S",
    hashtag: "#PrachiWedsSumit",
  },
  general: {
    invitationGreeting: "Together with their families",
    invitationMessage: "Request the pleasure of your company to celebrate the wedding festivities of their children",
    blessingInvocation: "Om Shri Ganeshaya Namah",
    welcomeNote: "We look forward to celebrating these unforgettable moments with you.",
  },
  events: [
    {
      id: "haldi",
      title: "Haldi Ceremony",
      tagline: "A morning of turmeric, sunshine, and laughter",
      date: "__",
      time: "__",
      venue: "__",
      address: "__",
      mapUrl: "https://maps.google.com/?q=__",
      dressCode: "Sunshine Yellow & Florals",
      accentColor: "#f59e0b",
      icon: "sun",
    },
    {
      id: "mehendi",
      title: "Mehendi Ceremony",
      tagline: "Intricate henna, lively songs, and festive cheer",
      date: "__",
      time: "__",
      venue: "__",
      address: "__",
      mapUrl: "https://maps.google.com/?q=__",
      dressCode: "Henna Greens & Pastels",
      accentColor: "#15803d",
      icon: "feather",
    },
    {
      id: "sangeet",
      title: "Sangeet Night",
      tagline: "An evening of music, dance, and celebration",
      date: "__",
      time: "__",
      venue: "__",
      address: "__",
      mapUrl: "https://maps.google.com/?q=__",
      dressCode: "Glamour, Glitz & Royal Hues",
      accentColor: "#7e22ce",
      icon: "music",
    },
    {
      id: "wedding",
      title: "Wedding Ceremony",
      tagline: "The sacred vows and the seven holy pheras",
      date: "__",
      time: "__",
      venue: "__",
      address: "__",
      mapUrl: "https://maps.google.com/?q=__",
      dressCode: "Traditional Royal Ethnic",
      accentColor: "#b91c1c",
      icon: "flame",
    },
    {
      id: "reception",
      title: "Grand Reception",
      tagline: "Dinner, toasts, and blessings for the newlyweds",
      date: "__",
      time: "__",
      venue: "__",
      address: "__",
      mapUrl: "https://maps.google.com/?q=__",
      dressCode: "Formal Elegance / Indo-Western",
      accentColor: "#1e3a8a",
      icon: "wine",
    },
  ],
  rsvp: {
    note: "Please kindly confirm your presence by __",
    phone: "__",
    whatsappNumber: "__",
    email: "__",
    formUrl: "", // Must never contain private editing links
  },
}
```
