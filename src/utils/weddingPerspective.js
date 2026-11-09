import { useMemo, useEffect } from 'react'

/**
 * weddingPerspective.js
 * Dynamically switches couple name ordering and perspective based on URL parameters:
 *
 * Bride's Side (Prachi & Sumit):
 *   - ?side=bride
 *   - ?side=prachi
 *   - ?by=bride
 *   - ?by=prachi
 *   - ?from=bride
 *   - ?from=prachi
 *
 * Groom's Side (Sumit & Prachi):
 *   - ?side=groom
 *   - ?side=sumit
 *   - ?by=groom
 *   - ?by=sumit
 *   - ?from=groom
 *   - ?from=sumit
 *   - Default (when no parameter is present)
 */

export function getPerspectiveFromUrl() {
  if (typeof window === 'undefined') {
    return {
      isBride: false,
      side: 'groom',
      primaryName: 'Sumit',
      secondaryName: 'Prachi',
      coupleLabel: 'Sumit & Prachi',
      tabTitle: 'Sumit Weds Prachi',
    }
  }

  const params = new URLSearchParams(window.location.search)
  const sideParam = (
    params.get('side') ||
    params.get('by') ||
    params.get('from') ||
    ''
  )
    .toLowerCase()
    .trim()

  const isBride =
    sideParam === 'bride' ||
    sideParam === 'prachi' ||
    sideParam === 'ladkiwale' ||
    sideParam === 'bride_side'

  return {
    isBride,
    side: isBride ? 'bride' : 'groom',
    primaryName: isBride ? 'Prachi' : 'Sumit',
    secondaryName: isBride ? 'Sumit' : 'Prachi',
    coupleLabel: isBride ? 'Prachi & Sumit' : 'Sumit & Prachi',
    tabTitle: isBride ? 'Prachi Weds Sumit' : 'Sumit Weds Prachi',
  }
}

export function useWeddingPerspective() {
  const perspective = useMemo(() => getPerspectiveFromUrl(), [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = perspective.tabTitle
    }
  }, [perspective.tabTitle])

  return perspective
}
