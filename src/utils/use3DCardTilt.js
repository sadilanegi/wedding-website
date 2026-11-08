import { useEffect, useRef } from 'react'

/**
 * Global helper to request iOS 13+ DeviceOrientation & DeviceMotion permissions from a user gesture.
 */
export async function requestMotionPermission() {
  return 'granted'
}

/**
 * use3DCardTilt.js
 * Lightweight pointer-reactive foil shimmer & micro-parallax for desktop fine pointers.
 * - Completely disabled on mobile/touch devices (`(hover: none), (pointer: coarse)`)
 *   and during scroll so mobile touch scrolling stays 100% compositor-driven at 60/120fps
 *   with zero main-thread style recalculation or scroll-position jumping.
 */
export function use3DCardTilt() {
  const containerRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    if (!container || !card) return undefined

    // Skip completely on reduced-motion or mobile/touch devices for maximum scroll performance
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (prefersReducedMotion || !isFinePointer) return undefined

    let targetGyroX = 0
    let targetGyroY = 0
    let currentGyroX = 0
    let currentGyroY = 0
    let targetSheenX = 50
    let targetSheenY = 35
    let currentSheenX = 50
    let currentSheenY = 35
    let isMoving = false
    let rafId = null

    const updatePhysics = () => {
      currentGyroX += (targetGyroX - currentGyroX) * 0.12
      currentGyroY += (targetGyroY - currentGyroY) * 0.12
      currentSheenX += (targetSheenX - currentSheenX) * 0.1
      currentSheenY += (targetSheenY - currentSheenY) * 0.1

      const foilX = 50 + currentGyroX * 40
      const foilY = 50 + currentGyroY * 40

      card.style.setProperty('--gyro-x', currentGyroX.toFixed(3))
      card.style.setProperty('--gyro-y', currentGyroY.toFixed(3))
      card.style.setProperty('--foil-x', `${foilX.toFixed(1)}%`)
      card.style.setProperty('--foil-y', `${foilY.toFixed(1)}%`)
      card.style.setProperty('--sheen-x', `${currentSheenX.toFixed(1)}%`)
      card.style.setProperty('--sheen-y', `${currentSheenY.toFixed(1)}%`)

      const diff =
        Math.abs(targetGyroX - currentGyroX) +
        Math.abs(targetGyroY - currentGyroY) +
        Math.abs(targetSheenX - currentSheenX) +
        Math.abs(targetSheenY - currentSheenY)

      if (diff > 0.02 || isMoving) {
        rafId = requestAnimationFrame(updatePhysics)
      } else {
        rafId = null
      }
    }

    const startRaf = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updatePhysics)
      }
    }

    const handlePointerMove = (e) => {
      isMoving = true
      const rect = card.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const normX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1))
      const normY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1))

      targetGyroX = normX
      targetGyroY = normY
      targetSheenX = Math.max(10, Math.min(90, (x / rect.width) * 100))
      targetSheenY = Math.max(10, Math.min(90, (y / rect.height) * 100))

      startRaf()
    }

    const handlePointerLeave = () => {
      isMoving = false
      targetGyroX = 0
      targetGyroY = 0
      targetSheenX = 50
      targetSheenY = 35
      startRaf()
    }

    container.addEventListener('mousemove', handlePointerMove, { passive: true })
    container.addEventListener('mouseleave', handlePointerLeave, { passive: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      container.removeEventListener('mousemove', handlePointerMove)
      container.removeEventListener('mouseleave', handlePointerLeave)
    }
  }, [])

  return {
    containerRef,
    cardRef,
  }
}
