import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Global helper to request iOS 13+ DeviceOrientation permission from ANY user gesture.
 * Safari STRICTLY requires this to be called from a user action (click/touchend).
 */
export async function requestMotionPermission() {
  if (
    typeof window !== 'undefined' &&
    typeof window.DeviceOrientationEvent !== 'undefined' &&
    typeof window.DeviceOrientationEvent.requestPermission === 'function'
  ) {
    try {
      const response = await window.DeviceOrientationEvent.requestPermission()
      if (response === 'granted') {
        window.__motionPermissionGranted = true
        window.dispatchEvent(new CustomEvent('motionpermissiongranted'))
        return 'granted'
      }
      return response
    } catch (err) {
      console.warn('[3D Tilt] Motion permission error:', err)
      return 'denied'
    }
  }
  return 'granted'
}

/**
 * use3DCardTilt.js
 * High-performance 60fps 3D card tilt & specular light reflection hook.
 * Full mobile support:
 *  - iOS Gyroscope (via synchronous user gesture permission on wax seal & tap)
 *  - Android Gyroscope (deviceorientation on HTTPS / localhost)
 *  - Screen orientation adaptation (portrait & landscape)
 *  - Dynamic neutral angle auto-calibration with smooth posture drift
 *  - Scroll-driven velocity tilt fallback (delivers tactile 3D feedback everywhere)
 *  - Desktop smooth pointer tracking
 *  - Respects prefers-reduced-motion
 */
export function use3DCardTilt() {
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const [gyroActive, setGyroActive] = useState(false)
  const [needsIosPermission, setNeedsIosPermission] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      typeof window.DeviceOrientationEvent !== 'undefined' &&
      typeof window.DeviceOrientationEvent.requestPermission === 'function' &&
      !window.__motionPermissionGranted
    )
  })

  const enableMotion = useCallback(async () => {
    const res = await requestMotionPermission()
    if (res === 'granted') {
      setNeedsIosPermission(false)
      setGyroActive(true)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    if (!container || !card) return undefined

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    let targetRx = 0
    let targetRy = 0
    let currentRx = 0
    let currentRy = 0
    let targetSheenX = 50
    let targetSheenY = 30
    let currentSheenX = 50
    let currentSheenY = 30
    let isMoving = false
    let rafId = null

    // Gyroscope tracking state
    let baselineBeta = null
    let baselineGamma = null
    let hasReceivedGyroData = false

    // Scroll velocity tracking state
    let lastScrollY = container.scrollTop
    let lastScrollTime = performance.now()
    let scrollVelocity = 0

    // Set initial transform-origin anchor point
    card.style.setProperty('--scroll-y', `${container.scrollTop}px`)

    const updatePhysics = () => {
      // Smooth spring damping interpolation towards target
      currentRx += (targetRx - currentRx) * 0.12
      currentRy += (targetRy - currentRy) * 0.12
      currentSheenX += (targetSheenX - currentSheenX) * 0.1
      currentSheenY += (targetSheenY - currentSheenY) * 0.1

      card.style.setProperty('--card-rx', `${currentRx.toFixed(2)}deg`)
      card.style.setProperty('--card-ry', `${currentRy.toFixed(2)}deg`)
      card.style.setProperty('--card-rx-num', currentRx.toFixed(2))
      card.style.setProperty('--card-ry-num', currentRy.toFixed(2))
      card.style.setProperty('--sheen-x', `${currentSheenX.toFixed(1)}%`)
      card.style.setProperty('--sheen-y', `${currentSheenY.toFixed(1)}%`)

      // Check if momentum has settled
      const diff =
        Math.abs(targetRx - currentRx) +
        Math.abs(targetRy - currentRy) +
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

    // 1. Desktop & Pointer Movement Handler
    const handlePointerMove = (e) => {
      if (hasReceivedGyroData) return // Gyro takes precedence on mobile

      isMoving = true
      const rect = card.getBoundingClientRect()
      const clientX = e.clientX
      const clientY = e.clientY
      if (clientX === undefined || clientY === undefined) return

      const x = clientX - rect.left
      const y = clientY - rect.top
      const width = rect.width
      const height = rect.height

      const normX = Math.max(-1, Math.min(1, (x / width) * 2 - 1))
      const normY = Math.max(-1, Math.min(1, (y / height) * 2 - 1))

      // Clamped tilt angles (max ±5.5deg)
      targetRx = -normY * 5.5
      targetRy = normX * 6.5
      targetSheenX = Math.max(0, Math.min(100, (x / width) * 100))
      targetSheenY = Math.max(0, Math.min(100, (y / height) * 100))

      startRaf()
    }

    const handlePointerLeave = () => {
      if (hasReceivedGyroData) return
      isMoving = false
      targetRx = 0
      targetRy = 0
      targetSheenX = 50
      targetSheenY = 30
      startRaf()
    }

    // 2. Gyroscope Orientation Handler with Screen Orientation & Drift Auto-Calibration
    const handleDeviceOrientation = (e) => {
      if (e.beta === null || e.gamma === null) return

      if (!hasReceivedGyroData) {
        hasReceivedGyroData = true
        setGyroActive(true)
      }
      isMoving = true

      let rawBeta = e.beta
      let rawGamma = e.gamma

      // Account for screen rotation
      const screenAngle =
        (window.screen && window.screen.orientation && window.screen.orientation.angle) ??
        (typeof window.orientation === 'number' ? window.orientation : 0)

      let roll = rawGamma
      let pitch = rawBeta

      if (screenAngle === 90) {
        roll = rawBeta
        pitch = -rawGamma
      } else if (screenAngle === -90 || screenAngle === 270) {
        roll = -rawBeta
        pitch = rawGamma
      } else if (screenAngle === 180) {
        roll = -rawGamma
        pitch = -rawBeta
      }

      // Initial baseline calibration
      if (baselineBeta === null) {
        baselineBeta = pitch
        baselineGamma = roll
      } else {
        // Slow continuous drift calibration (adapts to user posture over ~2-3 seconds)
        baselineBeta += (pitch - baselineBeta) * 0.015
        baselineGamma += (roll - baselineGamma) * 0.015
      }

      // Calculate angle deltas from calibrated holding angle (max ±26deg range)
      const deltaGamma = Math.max(-26, Math.min(26, roll - baselineGamma))
      const deltaBeta = Math.max(-26, Math.min(26, pitch - baselineBeta))

      targetRy = (deltaGamma / 26) * 6.5
      targetRx = (deltaBeta / 26) * 5.5
      targetSheenX = 50 + (deltaGamma / 26) * 45
      targetSheenY = 30 + (deltaBeta / 26) * 45

      startRaf()
    }

    // 3. Scroll Tracking: Updates transform-origin & adds subtle tactile velocity tilt
    const handleScroll = () => {
      const now = performance.now()
      const currentScrollY = container.scrollTop
      const dt = Math.max(1, now - lastScrollTime)
      const dy = currentScrollY - lastScrollY

      // Update transform origin so card tilts around viewport focal plane
      card.style.setProperty('--scroll-y', `${currentScrollY}px`)

      // If no gyroscope active, use scroll velocity for tactile 3D perspective feedback
      if (!hasReceivedGyroData) {
        scrollVelocity = dy / dt
        const clampedVel = Math.max(-4, Math.min(4, scrollVelocity * 1.5))
        targetRx = clampedVel * 2.5
        isMoving = true
        startRaf()

        // Decay velocity tilt back to 0
        clearTimeout(handleScroll.timer)
        handleScroll.timer = setTimeout(() => {
          targetRx = 0
          isMoving = false
          startRaf()
        }, 120)
      }

      lastScrollY = currentScrollY
      lastScrollTime = now
    }

    // 4. Tap Recalibration: Tapping screen instantly centers the baseline neutral angle
    const handleTapRecalibrate = () => {
      baselineBeta = null
      baselineGamma = null
    }

    // 5. Connect Orientation Listeners
    const bindOrientation = () => {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true })
    }

    // Listen for custom event triggered when permission is granted elsewhere (e.g. wax seal)
    const onPermissionGranted = () => {
      setNeedsIosPermission(false)
      bindOrientation()
    }
    window.addEventListener('motionpermissiongranted', onPermissionGranted)

    // Android & standard secure contexts without iOS permission gate
    if (
      typeof window.DeviceOrientationEvent !== 'undefined' &&
      typeof window.DeviceOrientationEvent.requestPermission !== 'function'
    ) {
      bindOrientation()
    } else if (window.__motionPermissionGranted) {
      bindOrientation()
    }

    // Event listeners
    container.addEventListener('mousemove', handlePointerMove, { passive: true })
    container.addEventListener('mouseleave', handlePointerLeave, { passive: true })
    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('click', handleTapRecalibrate, { passive: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('motionpermissiongranted', onPermissionGranted)
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
      container.removeEventListener('mousemove', handlePointerMove)
      container.removeEventListener('mouseleave', handlePointerLeave)
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('click', handleTapRecalibrate)
    }
  }, [])

  return {
    containerRef,
    cardRef,
    gyroActive,
    needsIosPermission,
    enableMotion,
  }
}
