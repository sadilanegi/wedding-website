import * as htmlToImage from 'html-to-image'

/**
 * cardExporter.js
 * Captures the full-fidelity, rich PrintableInvitationCard DOM node
 * (including all 4 ceremony photos with jharokha arches, flowing peacock feather drapes,
 * couple varmala portrait, Lord Ganesha, Radha-Krishna Bansuri crest, Kamdhenu cows,
 * Pichwai torans, personalized guest ribbon, Vrindavan venue, and scannable QR code).
 *
 * Exports to:
 * 1. Ultra-high-resolution JPG Image (pixelRatio: 2.0, 300 DPI equivalent)
 * 2. Print-Ready PDF 1.4 Document (single full-resolution document)
 */

const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Great+Vibes&family=Tiro+Devanagari+Hindi&display=swap'

let cachedFontEmbedCss = null

/**
 * Fetch and cache Google Fonts CSS so html-to-image can embed the exact @font-face rules
 * directly into the SVG foreignObject, avoiding fallback font shifts and line wrapping collisions.
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
    console.warn('[CardExporter] Could not fetch remote Google Fonts CSS for embedding:', err)
  }
  return ''
}

/**
 * Wait for all images in the node to be completely loaded and decoded
 */
async function ensureImagesLoaded(node) {
  if (!node) return
  const imgs = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalHeight !== 0) {
        return typeof img.decode === 'function' ? img.decode().catch(() => {}) : Promise.resolve()
      }
      return new Promise((resolve) => {
        img.onload = () => {
          if (typeof img.decode === 'function') {
            img.decode().then(resolve).catch(resolve)
          } else {
            resolve()
          }
        }
        img.onerror = resolve
      })
    })
  )
}

/**
 * Download high-resolution JPG image from the rendered card element
 */
export async function exportCardNodeAsJpg(node, guestName = '') {
  if (!node) return false

  try {
    console.log('[CardExporter] Ensuring images loaded...')
    await ensureImagesLoaded(node)

    const fontEmbedCSS = await getGoogleFontsEmbedCss()
    console.log('[CardExporter] Fonts CSS fetched, length:', fontEmbedCSS.length)

    const cardWidth = 760
    const cardHeight = node.scrollHeight || node.offsetHeight || 2500

    const blob = await htmlToImage.toBlob(node, {
      width: cardWidth,
      height: cardHeight,
      quality: 0.96,
      pixelRatio: 2.0,
      backgroundColor: '#fcf8ee',
      cacheBust: false,
      skipFonts: true,
      fontEmbedCSS,
    })

    console.log('[CardExporter] toBlob completed, blob size:', blob?.size)
    if (!blob) return false

    const sanitized = (guestName.trim() || 'Guest')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 32)
    const fileName = `Sumit_Prachi_Wedding_Invitation_${sanitized}.jpg`

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    console.log('[CardExporter] JPG download triggered successfully.')
    return true
  } catch (err) {
    console.error('[CardExporter] toBlob failed:', err)
    return false
  }
}

/**
 * Universal zero-dependency PDF 1.4 generator embedding the high-res image stream
 */
export async function exportCardNodeAsPdf(node, guestName = '') {
  if (!node) return false

  try {
    console.log('[CardExporter] Ensuring images loaded for PDF...')
    await ensureImagesLoaded(node)

    const fontEmbedCSS = await getGoogleFontsEmbedCss()

    const cardWidth = 760
    const cardHeight = node.scrollHeight || node.offsetHeight || 2500

    const jpegBlob = await htmlToImage.toBlob(node, {
      width: cardWidth,
      height: cardHeight,
      quality: 0.95,
      pixelRatio: 1.8,
      backgroundColor: '#fcf8ee',
      cacheBust: false,
      skipFonts: true,
      fontEmbedCSS,
    })

    console.log('[CardExporter] PDF jpegBlob created, size:', jpegBlob?.size)
    if (!jpegBlob) return false

    const arrayBuffer = await jpegBlob.arrayBuffer()
    const jpegBytes = new Uint8Array(arrayBuffer)

    // Calculate target image dimensions matching 1.8 pixelRatio
    const imgWidth = Math.round(cardWidth * 1.8)
    const imgHeight = Math.round(cardHeight * 1.8)

    // Printable points (72 pt per inch)
    const widthPt = 595.28 // Standard A4 width base
    const heightPt = (widthPt / cardWidth) * cardHeight

    const contentStream =
      `q\n${widthPt.toFixed(2)} 0 0 ${heightPt.toFixed(2)} 0 0 cm\n/Im1 Do\nQ\n`

    const encoder = new TextEncoder()
    const contentBytes = encoder.encode(contentStream)

    const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'
    const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n'
    const obj3 =
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${widthPt.toFixed(2)} ${heightPt.toFixed(2)}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`

    const obj4Header =
      `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
    const obj4Footer = '\nendstream\nendobj\n'

    const obj5 = `5 0 obj\n<< /Length ${contentBytes.length} >>\nstream\n${contentStream}endstream\nendobj\n`

    const header = '%PDF-1.4\n'

    let offset = header.length
    const offsets = [0]

    offsets.push(offset)
    offset += encoder.encode(obj1).length

    offsets.push(offset)
    offset += encoder.encode(obj2).length

    offsets.push(offset)
    offset += encoder.encode(obj3).length

    offsets.push(offset)
    offset += encoder.encode(obj4Header).length + jpegBytes.length + encoder.encode(obj4Footer).length

    offsets.push(offset)
    offset += encoder.encode(obj5).length

    const startXref = offset
    let xref = 'xref\n0 6\n0000000000 65535 f \n'
    for (let i = 1; i <= 5; i++) {
      xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
    }

    const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`

    const pdfBlob = new Blob(
      [
        header,
        obj1,
        obj2,
        obj3,
        obj4Header,
        jpegBytes,
        obj4Footer,
        obj5,
        xref,
        trailer,
      ],
      { type: 'application/pdf' }
    )

    const sanitized = (guestName.trim() || 'Guest')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 32)
    const fileName = `Sumit_Prachi_Wedding_Invitation_${sanitized}.pdf`

    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    console.log('[CardExporter] PDF download triggered successfully.')
    return true
  } catch (err) {
    console.error('[CardExporter] PDF export failed:', err)
    return false
  }
}
