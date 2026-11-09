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

let cachedFontEmbedCss = null

/**
 * Fetch and cache raw Google Fonts CSS with @font-face rules
 * so they render properly in standalone off-DOM canvases.
 */
async function getGoogleFontsEmbedCss() {
  if (cachedFontEmbedCss) return cachedFontEmbedCss
  try {
    const res = await fetch(GOOGLE_FONTS_CSS_URL)
    if (res.ok) {
      cachedFontEmbedCss = await res.text()
      return cachedFontEmbedCss
    }
  } catch (err) {
    console.warn('[CardExporter] Could not fetch Google Fonts for embedding:', err)
  }
  return ''
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
    console.log('[CardExporter] Ensuring images loaded for PDF...')
    await ensureImagesLoaded(node)

    const fontEmbedCSS = await getGoogleFontsEmbedCss()

    const cardWidth = 760
    const cardHeight = node.scrollHeight || node.offsetHeight || 2500

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
