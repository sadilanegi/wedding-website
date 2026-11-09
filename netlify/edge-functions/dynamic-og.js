/**
 * Netlify Edge Function: dynamic-og.js
 * Dynamically rewrites OpenGraph, Twitter, and SEO metadata on the server-side
 * based on the URL query parameter (?side=bride vs ?side=groom).
 *
 * WhatsApp, Facebook, iMessage, and Twitter crawlers do NOT execute client-side
 * React JavaScript. This edge function runs at the Netlify CDN edge in ~1ms and
 * serves the customized preview image, title, and description directly to social crawlers.
 */

export default async function handler(request, context) {
  const url = new URL(request.url)
  const sideParam = (
    url.searchParams.get('side') ||
    url.searchParams.get('by') ||
    url.searchParams.get('from') ||
    ''
  )
    .toLowerCase()
    .trim()

  const isBride =
    sideParam === 'bride' ||
    sideParam === 'prachi' ||
    sideParam === 'ladkiwale' ||
    sideParam === 'bride_side'

  const isGroom =
    sideParam === 'groom' ||
    sideParam === 'sumit' ||
    sideParam === 'ladkewale' ||
    sideParam === 'groom_side'

  // Fetch the static index.html from Netlify CDN
  const response = await context.next()
  const contentType = response.headers.get('content-type') || ''

  // Only rewrite HTML documents
  if (!contentType.includes('text/html')) {
    return response
  }

  let html = await response.text()

  const origin = url.origin || 'https://sumit-weds-prachi.netlify.app'

  if (isBride) {
    const brideTitle = 'Prachi Weds Sumit'
    const brideDesc =
      'Together with their families, Prachi & Sumit request the honour of your gracious presence and blessings at their auspicious wedding celebrations. Celebrating love, sacred tradition, and joyous beginnings.'
    const brideImage = `${origin}/og/wedding-preview-bride.jpg`
    const brideUrl = `${origin}/?side=bride`
    const brideAlt =
      'Prachi Weds Sumit — Royal Wedding Celebration featuring Prachi & Sumit'

    // Document Title
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${brideTitle}</title>`)

    // Primary Meta Description & Canonical
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${brideDesc}" />`
    )
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${brideUrl}" />`
    )

    // OpenGraph / WhatsApp / Facebook
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${brideTitle}" />`
    )
    html = html.replace(
      /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:site_name" content="${brideTitle}" />`
    )
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${brideDesc}" />`
    )
    html = html.replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${brideUrl}" />`
    )
    html = html.replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${brideImage}" />`
    )
    html = html.replace(
      /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:secure_url" content="${brideImage}" />`
    )
    html = html.replace(
      /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:alt" content="${brideAlt}" />`
    )

    // Twitter / X
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${brideTitle}" />`
    )
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${brideDesc}" />`
    )
    html = html.replace(
      /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:url" content="${brideUrl}" />`
    )
    html = html.replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${brideImage}" />`
    )
    html = html.replace(
      /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image:alt" content="${brideAlt}" />`
    )
  } else if (isGroom) {
    const groomTitle = 'Sumit Weds Prachi'
    const groomDesc =
      'Together with their families, Sumit & Prachi request the honour of your gracious presence and blessings at their auspicious wedding celebrations. Celebrating love, sacred tradition, and joyous beginnings.'
    const groomImage = `${origin}/og/wedding-preview-groom.jpg`
    const groomUrl = `${origin}/?side=groom`
    const groomAlt =
      'Sumit Weds Prachi — Royal Wedding Celebration featuring Sumit & Prachi'

    // Canonical & OG URLs
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${groomTitle}</title>`)
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${groomDesc}" />`
    )
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${groomUrl}" />`
    )
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${groomTitle}" />`
    )
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${groomDesc}" />`
    )
    html = html.replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${groomUrl}" />`
    )
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${groomTitle}" />`
    )
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${groomDesc}" />`
    )
    html = html.replace(
      /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:url" content="${groomUrl}" />`
    )
    html = html.replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${groomImage}" />`
    )
    html = html.replace(
      /<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:secure_url" content="${groomImage}" />`
    )
    html = html.replace(
      /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image:alt" content="${groomAlt}" />`
    )
    html = html.replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${groomImage}" />`
    )
    html = html.replace(
      /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image:alt" content="${groomAlt}" />`
    )
  }

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  })
}

