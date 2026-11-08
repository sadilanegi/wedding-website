import { useEffect } from 'react'

const REVEAL_SELECTOR =
  '[data-reveal], .ornament-divider, .countdown-section, .timeline-section__head, .event-card, .venue-section__head, .venue-card, .rsvp-section__head, .rsvp-card, .footer-section'

/**
 * useScrollReveal.js
 * High-performance, zero-jank scroll reveal observer.
 * - Pre-triggers 100px ahead of the bottom viewport edge so cards smoothly
 *   glide into place as the user scrolls down (never visible before animating,
 *   never snapping back).
 * - Unobserves elements immediately once revealed and detaches its RAF-throttled
 *   scroll listener as soon as all sections are revealed.
 */
export function useScrollReveal(containerRef, active = true) {
  useEffect(() => {
    const rootEl = containerRef?.current
    if (!rootEl || !active) return undefined

    const pending = new Set(rootEl.querySelectorAll(REVEAL_SELECTOR))
    let rafId = null
    let io = null

    // Always ensure the first section below Hero (Countdown) is immediately revealed
    const firstCountdown = rootEl.querySelector('.countdown-section')
    if (firstCountdown) {
      firstCountdown.classList.add('is-in-view')
      pending.delete(firstCountdown)
    }

    const revealElement = (el) => {
      if (!el.classList.contains('is-in-view')) {
        el.classList.add('is-in-view')
      }
      pending.delete(el)
      if (io) io.unobserve(el)
    }

    const checkVisibleElements = () => {
      rafId = null
      if (pending.size === 0) return

      const vh = window.innerHeight || document.documentElement.clientHeight || 800
      const triggerBottom = vh + 90

      pending.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < triggerBottom && rect.bottom > -60) {
          revealElement(el)
        }
      })

      if (pending.size === 0) {
        rootEl.removeEventListener('scroll', onScroll)
      }
    }

    const onScroll = () => {
      if (rafId !== null || pending.size === 0) return
      rafId = requestAnimationFrame(checkVisibleElements)
    }

    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealElement(entry.target)
            }
          })
        },
        {
          root: null,
          rootMargin: '0px 0px 100px 0px',
          threshold: 0.01,
        }
      )
      pending.forEach((el) => io.observe(el))
    }

    // Initial synchronous pass + post-layout pass
    checkVisibleElements()
    const timer1 = setTimeout(checkVisibleElements, 150)

    rootEl.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      clearTimeout(timer1)
      rootEl.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (io) io.disconnect()
    }
  }, [containerRef, active])
}
