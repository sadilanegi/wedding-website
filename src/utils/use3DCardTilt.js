import { useEffect, useRef } from 'react'

/**
 * Global helper to request iOS 13+ DeviceOrientation & DeviceMotion permissions from a user gesture.
 * Safari STRICTLY requires this to be called from a user action (click/touchend).
 */
export async function requestMotionPermission() {
  if (typeof window === 'undefined') return 'granted'

  let granted = false

  // 1. iOS 13+ DeviceOrientationEvent permission
  if (
    typeof window.DeviceOrientationEvent !== 'undefined' &&
    typeof window.DeviceOrientationEvent.requestPermission === 'function'
  ) {
    try {
      const response = await window.DeviceOrientationEvent.requestPermission()
      if (response === 'granted') {
        granted = true
      }
    } catch {
      // Silently ignore if called outside gesture or dismissed
    }
  }

  // 2. iOS 14.5+ DeviceMotionEvent permission (for accelerometer fallback)
  if (
    typeof window.DeviceMotionEvent !== 'undefined' &&
    typeof window.DeviceMotionEvent.requestPermission === 'function'
  ) {
    try {
      const response = await window.DeviceMotionEvent.requestPermission()
      if (response === 'granted') {
        granted = true
      }
    } catch {
      // Silently ignore
    }
  }

  // If requestPermission API is not present (standard Android, desktop, or older browsers)
  if (
    typeof window.DeviceOrientationEvent?.requestPermission !== 'function' &&
    typeof window.DeviceMotionEvent?.requestPermission !== 'function'
  ) {
    granted = true
  }

  if (granted) {
    window.__motionPermissionGranted = true
    window.dispatchEvent(new CustomEvent('motionpermissiongranted'))
    return 'granted'
  }

  return 'denied'
}

/**
 * use3DCardTilt.js
 * Refined 60fps 3D depth parallax, liquid 24K gold foil shimmer & gentle micro-tilt hook.
 *  - Subtle, restrained card tilt (max ±3.5° Rx, ±4° Ry) so it never feels over-tilted
 *  - Rich multi-layer 3D parallax variables (--gyro-x, --gyro-y) for floating particles & sacred halo
 *  - Dynamic 24K hot-foil metallic shimmer sweep (--foil-x, --foil-y, --sheen-x, --sheen-y)
 *  - Seamless invisible activation (no floating banners or status pills)
 */
export function use3DCardTilt() {
  const containerRef = useRef(null)
  const cardRef = useRef(null)

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

    // Gyroscope tracking state
    let baselineBeta = null
    let baselineGamma = null
    let hasReceivedGyroData = false
    let hasReceivedOrientationEvent = false

    // Scroll velocity tracking state
    let lastScrollY = container.scrollTop
    let lastScrollTime = performance.now()
    let scrollVelocity = 0

    // Set initial transform-origin anchor point
    card.style.setProperty('--scroll-y', `${container.scrollTop}px`)

    const updatePhysics = () => {
      // Smooth spring damping interpolation towards target
      currentRx += (targetRx - currentRx) * 0.1
      currentRy += (targetRy - currentRy) * 0.1
      currentGyroX += (targetGyroX - currentGyroX) * 0.1
      currentGyroY += (targetGyroY - currentGyroY) * 0.1
      currentSheenX += (targetSheenX - currentSheenX) * 0.09
      currentSheenY += (targetSheenY - currentSheenY) * 0.09

      const foilX = 50 + currentGyroX * 50
      const foilY = 50 + currentGyroY * 50

      card.style.setProperty('--card-rx', `${currentRx.toFixed(2)}deg`)
      card.style.setProperty('--card-ry', `${currentRy.toFixed(2)}deg`)
      card.style.setProperty('--card-rx-num', currentRx.toFixed(2))
      card.style.setProperty('--card-ry-num', currentRy.toFixed(2))
      card.style.setProperty('--gyro-x', currentGyroX.toFixed(3))
      card.style.setProperty('--gyro-y', currentGyroY.toFixed(3))
      card.style.setProperty('--foil-x', `${foilX.toFixed(1)}%`)
      card.style.setProperty('--foil-y', `${foilY.toFixed(1)}%`)
      card.style.setProperty('--sheen-x', `${currentSheenX.toFixed(1)}%`)
      card.style.setProperty('--sheen-y', `${currentSheenY.toFixed(1)}%`)

      // Check if momentum has settled
      const diff =
        Math.abs(targetRx - currentRx) +
        Math.abs(targetRy - currentRy) +
        Math.abs(targetGyroX - currentGyroX) +
        Math.abs(targetGyroY - currentGyroY) +
        Math.abs(targetSheenX - currentSheenX) +
        Math.abs(targetSheenY - currentSheenY)

      if (diff > 0.015 || isMoving) {
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

    // 1. Process Device Orientation Angles (Unified Pipeline)
    const processAngles = (pitch, roll) => {
      if (!hasReceivedGyroData) {
        hasReceivedGyroData = true
      }

      // Handle screen orientation angle (portrait vs landscape)
      let screenAngle = 0
      try {
        if (window.screen?.orientation?.angle !== undefined) {
          screenAngle = window.screen.orientation.angle
        } else if (typeof window.orientation === 'number') {
          screenAngle = window.orientation
        }
      } catch {
        screenAngle = 0
      }

      let adjustedRoll = roll
      let adjustedPitch = pitch

      if (screenAngle === 90) {
        adjustedRoll = pitch
        adjustedPitch = -roll
      } else if (screenAngle === -90 || screenAngle === 270) {
        adjustedRoll = -pitch
        adjustedPitch = roll
      } else if (screenAngle === 180) {
        adjustedRoll = -roll
        adjustedPitch = -pitch
      }

      // Initial baseline calibration (neutral reading posture)
      if (baselineBeta === null) {
        baselineBeta = Math.max(15, Math.min(75, adjustedPitch))
        baselineGamma = Math.max(-25, Math.min(25, adjustedRoll))
      } else {
        // Ultra-gentle posture adaptation so resting angle stays natural without erasing movement
        baselineBeta += (adjustedPitch - baselineBeta) * 0.0015
        baselineGamma += (adjustedRoll - baselineGamma) * 0.0015
      }

      // Normalized gyro values (-1 to +1) across a ±22° range
      const normX = Math.max(-1, Math.min(1, (adjustedRoll - baselineGamma) / 22))
      const normY = Math.max(-1, Math.min(1, (adjustedPitch - baselineBeta) / 22))

      targetGyroX = normX
      targetGyroY = normY

      // Subtle, refined card micro-tilt (max ±4deg Ry, ±3.2deg Rx — never overdone)
      targetRy = normX * 4.0
      targetRx = -normY * 3.2

      // Wide, expressive 24K gold foil & sunbeam reflection sweep
      targetSheenX = Math.max(8, Math.min(92, 50 + normX * 42))
      targetSheenY = Math.max(8, Math.min(92, 35 - normY * 38))

      startRaf()
    }

    // 2. Device Orientation Event Handlers
    const handleDeviceOrientation = (e) => {
      const beta = e.beta
      const gamma = e.gamma
      if (beta === null || gamma === null || beta === undefined || gamma === undefined) {
        return
      }
      hasReceivedOrientationEvent = true
      processAngles(beta, gamma)
    }

    // 3. Accelerometer Fallback Handler (DeviceMotion)
    const handleDeviceMotion = (e) => {
      if (hasReceivedOrientationEvent) return // Native orientation takes precedence

      const acc = e.accelerationIncludingGravity
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return

      const x = acc.x || 0
      const y = acc.y || 0
      const z = acc.z || 0

      const roll = Math.atan2(x, Math.sqrt(y * y + z * z)) * (180 / Math.PI)
      const pitch = Math.atan2(-y, z) * (180 / Math.PI)

      processAngles(pitch, roll)
    }

    // 4. Desktop & Pointer Movement Handler
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

      targetGyroX = normX
      targetGyroY = normY

      // Subtle card micro-tilt on desktop too
      targetRx = -normY * 3.2
      targetRy = normX * 4.0
      targetSheenX = Math.max(10, Math.min(90, (x / width) * 100))
      targetSheenY = Math.max(10, Math.min(90, (y / height) * 100))

      startRaf()
    }

    const handlePointerLeave = () => {
      if (hasReceivedGyroData) return
      isMoving = false
      targetRx = 0
      targetRy = 0
      targetGyroX = 0
      targetGyroY = 0
      targetSheenX = 50
      targetSheenY = 35
      startRaf()
    }

    // 5. Scroll Tracking: Updates transform-origin & adds subtle tactile velocity tilt
    const handleScroll = () => {
      const now = performance.now()
      const currentScrollY = container.scrollTop
      const dt = Math.max(1, now - lastScrollTime)
      const dy = currentScrollY - lastScrollY

      // Update transform origin so card tilts around viewport focal plane
      card.style.setProperty('--scroll-y', `${currentScrollY}px`)

      // If no gyroscope active, use scroll velocity for subtle tactile 3D perspective feedback
      if (!hasReceivedGyroData) {
        scrollVelocity = dy / dt
        const clampedVel = Math.max(-3, Math.min(3, scrollVelocity * 1.2))
        targetRx = clampedVel * 1.4
        isMoving = true
        startRaf()

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

    // 6. Silent First-Interaction Permission & Baseline Calibration
    const handleFirstInteraction = () => {
      if (!window.__motionPermissionGranted) {
        requestMotionPermission().catch(() => {})
      }
    }

    // 7. Connect Orientation & Motion Listeners
    const bindMotionListeners = () => {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true })
      window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, { passive: true })
      window.addEventListener('devicemotion', handleDeviceMotion, { passive: true })
    }

    const unbindMotionListeners = () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
      window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation)
      window.removeEventListener('devicemotion', handleDeviceMotion)
    }

    const onPermissionGranted = () => {
      bindMotionListeners()
    }
    window.addEventListener('motionpermissiongranted', onPermissionGranted)

    const needsPermission =
      typeof window.DeviceOrientationEvent?.requestPermission === 'function' ||
      typeof window.DeviceMotionEvent?.requestPermission === 'function'

    if (!needsPermission || window.__motionPermissionGranted) {
      bindMotionListeners()
    }

    // Event listeners
    container.addEventListener('mousemove', handlePointerMove, { passive: true })
    container.addEventListener('mouseleave', handlePointerLeave, { passive: true })
    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true })
    container.addEventListener('click', handleFirstInteraction, { passive: true, once: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('motionpermissiongranted', onPermissionGranted)
      unbindMotionListeners()
      container.removeEventListener('mousemove', handlePointerMove)
      container.removeEventListener('mouseleave', handlePointerLeave)
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('touchstart', handleFirstInteraction)
      container.removeEventListener('click', handleFirstInteraction)
    }
  }, [])

  return {
    containerRef,
    cardRef,
  }
}
