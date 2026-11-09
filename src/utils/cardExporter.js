import * as htmlToImage from 'html-to-image'
import { jsPDF } from 'jspdf'
import { getPerspectiveFromUrl } from './weddingPerspective.js'

/**
 * cardExporter.js
 * Captures the full-fidelity, rich PrintableInvitationCard DOM node
 * (including all 4 ceremony photos with jharokha arches, flowing peacock feather drapes,
 * couple varmala portrait, Lord Ganesha, Radha-Krishna Bansuri crest, Kamdhenu cows,
 * Pichwai torans, personalized guest ribbon, Vrindavan venue, and scannable QR code).
 *
 * Exports to:
 * Print-Ready PDF 1.4+ Document via jsPDF with high-res JPEG compression.
 */

const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Great+Vibes&family=Tiro+Devanagari+Hindi&display=swap'

/**
 * Safety net injected into the export sandbox.
 * html-to-image copies window.getComputedStyle(node).cssText onto every cloned
 * element's inline style, freezing exact sub-pixel widths and single-line heights.
 * If text metrics differ by even 0.2px inside the SVG <foreignObject>, frozen
 * inline widths force the last word to wrap while frozen inline heights cause the
 * wrapped line to overlap the element below.
 * These !important rules unfreeze both width and height on all text and layout
 * containers (fixed-size media/icon boxes are intentionally excluded).
 */
const EXPORT_SAFETY_CSS = `
.print-card p,
.print-card h1,
.print-card h2,
.print-card h3,
.print-card span:not(.print-card__meta-icon) {
  width: auto !important;
  max-width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
}

.print-card__inner,
.print-card__header,
.print-card__couple-section,
.print-card__guest-ribbon,
.print-card__schedule-highlights,
.print-card__events-section,
.print-card__events-list,
.print-card__event-card,
.print-card__event-body,
.print-card__event-header-row,
.print-card__event-meta-row,
.print-card__venue-section,
.print-card__venue-box,
.print-card__footer,
.print-card__rsvp-badge {
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
}

.print-card__kicker-wrap,
.print-card__span-badge,
.print-card__guest-ribbon-badge,
.print-card__highlight-box,
.print-card__krishna-banner,
.print-card__event-titles,
.print-card__meta-item,
.print-card__meta-text,
.print-card__venue-info,
.print-card__venue-header-row,
.print-card__venue-header-text,
.print-card__qr-wrap {
  width: auto !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
}
`

let cachedFontEmbedCss = null
const fontDataUrlCache = new Map()

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function fontUrlToDataUrl(url) {
  if (fontDataUrlCache.has(url)) return fontDataUrlCache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Font fetch failed: ${url}`)
  const dataUrl = await blobToDataUrl(await res.blob())
  fontDataUrlCache.set(url, dataUrl)
  return dataUrl
}

/**
 * Build fully self-contained @font-face CSS.
 * The export renders inside an SVG <foreignObject> sandbox that cannot download
 * external files, so every font file must be inlined as a base64 data URL —
 * otherwise all text silently falls back to Georgia (much wider) and wraps.
 */
async function getEmbeddedFontCss() {
  if (cachedFontEmbedCss) return cachedFontEmbedCss
  try {
    const res = await fetch(GOOGLE_FONTS_CSS_URL)
    if (!res.ok) return ''
    const css = await res.text()

    const blocks = css.match(/@font-face\s*\{[^}]*\}/g) || []

    const inlined = await Promise.all(
      blocks.map(async (block) => {
        const urlMatch = block.match(/url\(([^)]+)\)/)
        if (!urlMatch) return block
        const rawUrl = urlMatch[1].replace(/["']/g, '')
        try {
          const dataUrl = await fontUrlToDataUrl(rawUrl)
          return block.replace(urlMatch[0], `url(${dataUrl})`)
        } catch {
          return ''
        }
      })
    )

    cachedFontEmbedCss = inlined.filter(Boolean).join('\n')
    return cachedFontEmbedCss
  } catch (err) {
    console.warn('[CardExporter] Could not embed Google Fonts:', err)
    return ''
  }
}

/**
 * Make sure the on-screen (offscreen-staged) card is laid out with the real
 * fonts before we measure it, so measured sizes match the sandbox render.
 */
async function ensureDocumentFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return
  const families = [
    '700 28px "Cormorant Garamond"',
    'italic 500 15px "Cormorant Garamond"',
    '600 15px "Cormorant Garamond"',
    '700 12px "Cinzel"',
    '600 12px "Cinzel"',
    '700 20px "Tiro Devanagari Hindi"',
  ]
  try {
    await Promise.all(families.map((f) => document.fonts.load(f, 'Aa श्री')))
    await document.fonts.ready
  } catch {
    // non-fatal
  }
}

/**
 * Wait until all <img> tags inside the card node are fully loaded and decoded.
 */
async function ensureImagesLoaded(node) {
  const images = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve()
      return new Promise((resolve) => {
        img.onload = () => resolve()
        img.onerror = () => resolve()
        setTimeout(resolve, 3500)
      })
    })
  )
}

/**
 * Universal robust PDF generator using jsPDF with high-fidelity JPEG compression.
 */
export async function exportCardNodeAsPdf(node, guestName = '') {
  if (!node) return false

  try {
    console.log('[CardExporter] Ensuring fonts & images loaded for PDF...')
    await ensureDocumentFontsReady()
    await ensureImagesLoaded(node)
    // Let layout settle after fonts swap in
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

    const embeddedFonts = await getEmbeddedFontCss()
    const fontEmbedCSS = `${embeddedFonts}\n${EXPORT_SAFETY_CSS}`

    const cardWidth = 760
    const cardHeight = Math.ceil(node.scrollHeight || node.offsetHeight || 2500)

    console.log(`[CardExporter] Capturing card image: ${cardWidth}x${cardHeight}...`)

    // Capture as high-quality JPEG data URL
    const jpegDataUrl = await htmlToImage.toJpeg(node, {
      width: cardWidth,
      height: cardHeight,
      quality: 0.92,
      pixelRatio: 1.5,
      backgroundColor: '#fcf8ee',
      cacheBust: false,
      skipFonts: true,
      fontEmbedCSS,
    })

    if (!jpegDataUrl) {
      console.error('[CardExporter] Failed to generate JPEG data URL')
      return false
    }

    console.log('[CardExporter] JPEG captured, creating PDF...')

    // Printable points (72 pt per inch, standard A4 width base = 595.28 pt)
    const pdfWidthPt = 595.28
    const pdfHeightPt = (pdfWidthPt / cardWidth) * cardHeight

    // Create jsPDF instance with exact aspect ratio
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [pdfWidthPt, pdfHeightPt],
      compress: true,
    })

    // Embed high-res image into the PDF page
    pdf.addImage(
      jpegDataUrl,
      'JPEG',
      0,
      0,
      pdfWidthPt,
      pdfHeightPt,
      undefined,
      'FAST'
    )

    const sanitized = (guestName.trim() || 'Guest')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 32)
    const perspective = getPerspectiveFromUrl()
    const prefix = `${perspective.primaryName}_${perspective.secondaryName}`
    const fileName = `${prefix}_Wedding_Invitation_${sanitized}.pdf`

    pdf.save(fileName)
    console.log('[CardExporter] PDF download triggered successfully via jsPDF:', fileName)
    return true
  } catch (err) {
    console.error('[CardExporter] PDF export failed:', err)
    return false
  }
}
