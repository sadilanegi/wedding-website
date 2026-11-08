import { useEffect } from 'react'

const REVEAL_SELECTOR =
  '[data-reveal], .ornament-divider, .countdown-section, .timeline-section__head, .event-card, .venue-section__head, .venue-card, .rsvp-section__head, .rsvp-card, .footer-section'

/**
 * useScrollReveal.js
 * Rock-solid viewport + scroll-container observer that triggers `.is-in-view`
 * across all sections, cards, and dividers inside `.invite-stage`.
 */
export function useScrollReveal(containerRef, active = true) {
  useEffect(() => {
    const rootEl = containerRef?.current
    if (!rootEl || !active) return undefined

    const checkVisibleElements = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight || 800
      const targets = rootEl.querySelectorAll(REVEAL_SELECTOR)
      targets.forEach((el) => {
        if (el.classList.contains('is-in-view')) return
        const rect = el.getBoundingClientRect()
        if (rect.top < vh * 0.94 && rect.bottom > -40) {
          el.classList.add('is-in-view')
        }
      })
    }

    // Immediately mark all currently visible elements
    checkVisibleElements()
    const timer1 = setTimeout(checkVisibleElements, 120)
    const timer2 = setTimeout(checkVisibleElements, 500)

    rootEl.addEventListener('scroll', checkVisibleElements, { passive: true })
    window.addEventListener('resize', checkVisibleElements, { passive: true })

    // IntersectionObserver with viewport root (avoids 3D perspective root clipping bugs)
    let io = null
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in-view')
            }
          })
        },
        {
          root: null,
          threshold: 0.08,
        }
      )
      rootEl.querySelectorAll(REVEAL_SELECTOR).forEach((el) => io.observe(el))
    }

    // Also watch for DOM / HMR updates so newly mounted cards are never missed
    let mo = null
    if (typeof MutationObserver !== 'undefined') {
      mo = new MutationObserver(() => {
        checkVisibleElements()
        if (io) {
          rootEl.querySelectorAll(REVEAL_SELECTOR).forEach((el) => io.observe(el))
        }
      })
      mo.observe(rootEl, { childList: true, subtree: true })
    }

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      rootEl.removeEventListener('scroll', checkVisibleElements)
      window.removeEventListener('resize', checkVisibleElements)
      if (io) io.disconnect()
      if (mo) mo.disconnect()
    }
  }, [containerRef, active])
}
