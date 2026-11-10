import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { isConfirmed } from '../../utils/weddingHelpers.js'
import './ScratchSaveTheDate.css'

/**
 * Generates an SVG path string for a perforated postage stamp outline.
 * Semicircular cutouts are carved inward on all 4 edges with sharp 90-degree corner teeth.
 */
function createStampPath(width, height, radius = 5.0) {
  const w = Math.max(200, Math.round(width || 320))
  const h = Math.max(100, Math.round(height || 140))
  const r = radius
  const nx = Math.max(3, Math.round((w - 24) / 18))
  const ny = Math.max(2, Math.round((h - 24) / 18))
  const stepX = (w - 24) / nx
  const stepY = (h - 24) / ny

  let d = 'M 0 0'

  // Top edge (left to right)
  for (let i = 0; i < nx; i++) {
    const cx = 12 + (i + 0.5) * stepX
    d += ` L ${(cx - r).toFixed(1)} 0`
    d += ` A ${r} ${r} 0 0 0 ${(cx + r).toFixed(1)} 0`
  }
  d += ` L ${w} 0`

  // Right edge (top to bottom)
  for (let i = 0; i < ny; i++) {
    const cy = 12 + (i + 0.5) * stepY
    d += ` L ${w} ${(cy - r).toFixed(1)}`
    d += ` A ${r} ${r} 0 0 0 ${w} ${(cy + r).toFixed(1)}`
  }
  d += ` L ${w} ${h}`

  // Bottom edge (right to left)
  for (let i = nx - 1; i >= 0; i--) {
    const cx = 12 + (i + 0.5) * stepX
    d += ` L ${(cx + r).toFixed(1)} ${h}`
    d += ` A ${r} ${r} 0 0 0 ${(cx - r).toFixed(1)} ${h}`
  }
  d += ` L 0 ${h}`

  // Left edge (bottom to top)
  for (let i = ny - 1; i >= 0; i--) {
    const cy = 12 + (i + 0.5) * stepY
    d += ` L 0 ${(cy + r).toFixed(1)}`
    d += ` A ${r} ${r} 0 0 0 0 ${(cy - r).toFixed(1)}`
  }
  d += ' Z'

  return { d, w, h }
}

/**
 * ScratchSaveTheDate.jsx
 * Interactive 24K Metallic Gold Foil Scratch-to-Reveal Card for the "Save The Date" medallion.
 * Guests can scratch with their finger (mobile touch) or cursor (desktop) to reveal
 * the wedding date announcement with live gold-dust sparks and celebratory confetti.
 */
export default function ScratchSaveTheDate({ general, onUnlock }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef(null)
  const moveCounterRef = useRef(0)
  const pointerDownMetaRef = useRef(null)
  const tapCountRef = useRef(0)
  const demoRafRef = useRef(null)
  const autoUnlockTimerRef = useRef(null)
  const hasRunDemoRef = useRef(false)

  const [dimensions, setDimensions] = useState({ width: 320, height: 152 })
  const stamp = useMemo(
    () => createStampPath(dimensions.width, dimensions.height, 4.8),
    [dimensions.width, dimensions.height]
  )

  const [isRevealed, setIsRevealed] = useState(false)
  const [hasStartedScratching, setHasStartedScratching] = useState(false)
  const [demoFinger, setDemoFinger] = useState(null)
  const [sparks, setSparks] = useState([])
  const [resetCount, setResetCount] = useState(0)

  const hasDate = isConfirmed(general?.date)
  const hasPlace = isConfirmed(general?.place)
  const hasGuestArrival = isConfirmed(general?.guestArrivalTime)

  const triggerUnlock = useCallback(() => {
    if (demoRafRef.current) cancelAnimationFrame(demoRafRef.current)
    if (autoUnlockTimerRef.current) clearTimeout(autoUnlockTimerRef.current)
    setIsRevealed(true)
    setDemoFinger(null)
    if (onUnlock) onUnlock()
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([35, 50, 35])
      } catch {
        // ignore
      }
    }
  }, [onUnlock])

  // Paint rich 24K brushed gold foil onto the canvas
  const initGoldFoilCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const width = Math.max(260, Math.round(rect.width || 320))
    const height = Math.max(128, Math.round(rect.height || 152))
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.globalCompositeOperation = 'source-over'

    // 1. Rich 24K Metallic Gold Foil Base Gradient
    const goldGrad = ctx.createLinearGradient(0, 0, width, height)
    goldGrad.addColorStop(0, '#8c6218')
    goldGrad.addColorStop(0.18, '#d4af37')
    goldGrad.addColorStop(0.36, '#fff4c2')
    goldGrad.addColorStop(0.52, '#c5962e')
    goldGrad.addColorStop(0.7, '#f8e394')
    goldGrad.addColorStop(0.86, '#a67821')
    goldGrad.addColorStop(1, '#6e490f')

    ctx.fillStyle = goldGrad
    ctx.fillRect(0, 0, width, height)

    // 2. Subtle Brushed Metallic Sheen Lines & Gold Leaf Shimmer Dots
    ctx.strokeStyle = 'rgba(255, 252, 232, 0.22)'
    ctx.lineWidth = 0.7
    for (let y = 4; y < height; y += 5) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y + (y % 10 === 0 ? 1.5 : -1.5))
      ctx.stroke()
    }

    // 3. Inner Dashed Philatelic Border Inset inside the Gold Foil Stamp
    ctx.strokeStyle = 'rgba(255, 250, 224, 0.75)'
    ctx.lineWidth = 0.9
    ctx.setLineDash([4, 3])
    ctx.strokeRect(12, 12, width - 24, height - 24)
    ctx.setLineDash([])

    // 4. Subtle Decorative Mandala Rosettes on Left & Right
    const drawRosette = (cx, cy, r) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.strokeStyle = 'rgba(105, 68, 14, 0.28)'
      ctx.lineWidth = 0.9
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.stroke()
      for (let a = 0; a < 8; a++) {
        ctx.rotate(Math.PI / 4)
        ctx.beginPath()
        ctx.ellipse(0, r * 0.5, r * 0.18, r * 0.45, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()
    }
    drawRosette(36, height / 2, 19)
    drawRosette(width - 36, height / 2, 19)

    // 5. Stamped Foil Typography for Unlocking Festivities
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = '700 9.5px "Cinzel", Georgia, serif'
    ctx.fillStyle = 'rgba(78, 46, 8, 0.92)'
    ctx.fillText('✦   S A C R E D   U N V E I L I N G   ✦', width / 2, height / 2 - 24)

    ctx.font = 'italic 700 20px "Cormorant Garamond", Georgia, serif'
    ctx.fillStyle = '#3b2105'
    ctx.shadowColor = 'rgba(255, 250, 225, 0.85)'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 1
    ctx.shadowBlur = 0
    ctx.fillText('Scratch with Finger to Reveal', width / 2, height / 2 + 1)

    ctx.shadowColor = 'transparent'
    ctx.font = '700 8.5px "Cinzel", Georgia, serif'
    ctx.fillStyle = 'rgba(88, 52, 10, 0.92)'
    ctx.fillText('👆 SWIPE GOLD FOIL OR TAP BUTTON BELOW', width / 2, height / 2 + 25)

    ctx.restore()
  }, [])

  // Programmatically erase a smooth tutorial swipe across the canvas
  // Programmatically draw a small, thin, elegant S-shaped scratch tutorial across the gold foil
  const runDemoScratch = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || isRevealed || hasStartedScratching) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    const width = Math.max(260, Math.round(rect.width || 320))
    const height = Math.max(128, Math.round(rect.height || 152))
    const dpr = canvas.width / Math.max(1, width)

    // Center of S placed naturally on the card
    // Small, thin dimensions: ~24px wide, ~38px high
    const cx = width * 0.5 * dpr
    const cy = height * 0.5 * dpr
    const ws = 12 * dpr
    const hs = 19 * dpr

    // S-curve control points (top arc loops left, bottom arc loops right)
    const p0 = { x: cx + ws * 0.85, y: cy - hs }
    const cp1 = { x: cx - ws * 1.85, y: cy - hs * 0.95 }
    const p1 = { x: cx, y: cy }
    const cp2 = { x: cx + ws * 1.85, y: cy + hs * 0.95 }
    const p2 = { x: cx - ws * 0.85, y: cy + hs }

    const duration = 1000
    const startTime = performance.now()
    let prevPoint = null

    const animateDemo = (now) => {
      if (hasStartedScratching || isRevealed) {
        setDemoFinger(null)
        return
      }

      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      // Ease in-out cubic
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

      // Evaluate the S-curve
      let currX
      let currY
      if (eased <= 0.5) {
        const u = eased * 2
        const invU = 1 - u
        currX = invU * invU * p0.x + 2 * invU * u * cp1.x + u * u * p1.x
        currY = invU * invU * p0.y + 2 * invU * u * cp1.y + u * u * p1.y
      } else {
        const u = (eased - 0.5) * 2
        const invU = 1 - u
        currX = invU * invU * p1.x + 2 * invU * u * cp2.x + u * u * p2.x
        currY = invU * invU * p1.y + 2 * invU * u * cp2.y + u * u * p2.y
      }

      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      // Thin, realistic fingernail scratch line: 6.5px (NOT thick)
      ctx.lineWidth = 6.5 * dpr

      if (prevPoint) {
        ctx.beginPath()
        ctx.moveTo(prevPoint.x, prevPoint.y)
        ctx.lineTo(currX, currY)
        ctx.stroke()
      }
      ctx.restore()

      prevPoint = { x: currX, y: currY }

      // Update demo finger position (CSS pixels)
      const cssX = currX / dpr
      const cssY = currY / dpr
      setDemoFinger({ x: cssX, y: cssY, active: true })

      // Spawn subtle golden spark
      if (Math.random() > 0.5) {
        const sparkId = `demo-${Date.now()}-${Math.random()}`
        const dx = (Math.random() - 0.5) * 16
        const dy = -4 - Math.random() * 14
        setSparks((prev) => [
          ...prev.slice(-8),
          { id: sparkId, x: cssX, y: cssY, dx: `${dx.toFixed(1)}px`, dy: `${dy.toFixed(1)}px` },
        ])
      }

      if (progress < 1) {
        demoRafRef.current = requestAnimationFrame(animateDemo)
      } else {
        // S scratch complete: gracefully dismiss finger guide after 350ms so card is clean
        setTimeout(() => {
          if (!hasStartedScratching && !isRevealed) {
            setDemoFinger(null)
          }
        }, 350)
      }
    }

    demoRafRef.current = requestAnimationFrame(animateDemo)
  }, [hasStartedScratching, isRevealed])

  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current
      if (container) {
        const rect = container.getBoundingClientRect()
        const w = Math.round(rect.width)
        const h = Math.round(rect.height)
        if (w > 0 && h > 0) {
          setDimensions((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }))
        }
      }
    }
    updateSize()

    let resizeObserver = null
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(updateSize)
      resizeObserver.observe(containerRef.current)
    }

    if (isRevealed) {
      return () => {
        if (resizeObserver) resizeObserver.disconnect()
      }
    }
    initGoldFoilCanvas()

    const targetEl = containerRef.current
    let demoTimer = null

    const startDemoAndSafety = () => {
      if (hasRunDemoRef.current) return
      hasRunDemoRef.current = true

      // Run demo scratch swipe 420ms after appearing in view
      demoTimer = setTimeout(() => {
        if (!hasStartedScratching && !isRevealed) {
          runDemoScratch()
        }
      }, 420)

      // Auto-unlock safety timer: generous 16s safety window so nobody gets stuck
      autoUnlockTimerRef.current = setTimeout(() => {
        if (!isRevealed) {
          triggerUnlock()
        }
      }, 16000)
    }

    let observer = null
    if (typeof IntersectionObserver !== 'undefined' && targetEl) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry && entry.isIntersecting) {
            startDemoAndSafety()
            if (observer) {
              observer.disconnect()
              observer = null
            }
          }
        },
        { threshold: 0.25 }
      )
      observer.observe(targetEl)
    } else {
      startDemoAndSafety()
    }

    const handleResize = () => {
      updateSize()
      if (!hasStartedScratching && !isRevealed) {
        initGoldFoilCanvas()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      if (resizeObserver) resizeObserver.disconnect()
      if (observer) observer.disconnect()
      if (demoTimer) clearTimeout(demoTimer)
      if (autoUnlockTimerRef.current) clearTimeout(autoUnlockTimerRef.current)
      if (demoRafRef.current) cancelAnimationFrame(demoRafRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [initGoldFoilCanvas, isRevealed, hasStartedScratching, resetCount, runDemoScratch, triggerUnlock])

  // Measure what percentage of the canvas has been scratched transparent
  const checkScratchCompletion = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || isRevealed) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    try {
      const { width, height } = canvas
      const imageData = ctx.getImageData(0, 0, width, height).data
      let transparentPixels = 0
      let totalSampled = 0
      // Sample every 16th pixel alpha channel for fast O(1)-like performance
      const stride = 4 * 16
      for (let i = 3; i < imageData.length; i += stride) {
        totalSampled++
        if (imageData[i] < 128) {
          transparentPixels++
        }
      }

      const ratio = totalSampled > 0 ? transparentPixels / totalSampled : 0
      // Lower threshold to 20% so 2 natural finger swipes unlock the festivities!
      if (ratio >= 0.20) {
        triggerUnlock()
      }
    } catch {
      // Fallback if getImageData is restricted
    }
  }, [isRevealed, triggerUnlock])

  // Clear a circular patch at tap point
  const clearCircleAtPoint = useCallback((clientX, clientY, radius = 22) => {
    const canvas = canvasRef.current
    if (!canvas || isRevealed) return
    const rect = canvas.getBoundingClientRect()
    const dpr = canvas.width / Math.max(1, rect.width)
    const x = (clientX - rect.left) * dpr
    const y = (clientY - rect.top) * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, radius * dpr, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }, [isRevealed])

  // Erase a circular/feathered stroke between previous and current pointer points
  const scratchAtPoint = useCallback(
    (clientX, clientY) => {
      const canvas = canvasRef.current
      if (!canvas || isRevealed) return

      const rect = canvas.getBoundingClientRect()
      const dpr = canvas.width / Math.max(1, rect.width)
      const x = (clientX - rect.left) * dpr
      const y = (clientY - rect.top) * dpr

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 34 * dpr

      ctx.beginPath()
      if (lastPointRef.current) {
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
        ctx.lineTo(x, y)
      } else {
        ctx.arc(x, y, 17 * dpr, 0, Math.PI * 2)
      }
      ctx.stroke()
      ctx.restore()

      lastPointRef.current = { x, y }

      // Spawn live gold dust sparks along finger trail
      moveCounterRef.current += 1
      if (moveCounterRef.current % 2 === 0) {
        const localX = clientX - rect.left
        const localY = clientY - rect.top
        const sparkId = `${Date.now()}-${Math.random()}`
        const dx = (Math.random() - 0.5) * 34
        const dy = -10 - Math.random() * 24
        setSparks((prev) => [
          ...prev.slice(-12),
          { id: sparkId, x: localX, y: localY, dx: `${dx.toFixed(1)}px`, dy: `${dy.toFixed(1)}px` },
        ])
      }

      if (moveCounterRef.current % 6 === 0) {
        checkScratchCompletion()
      }
    },
    [checkScratchCompletion, isRevealed]
  )

  const handlePointerDown = (e) => {
    if (isRevealed) return
    if (demoRafRef.current) cancelAnimationFrame(demoRafRef.current)
    if (autoUnlockTimerRef.current) clearTimeout(autoUnlockTimerRef.current)
    isDrawingRef.current = true
    setHasStartedScratching(true)
    setDemoFinger(null)
    lastPointRef.current = null
    pointerDownMetaRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }

    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    }
    scratchAtPoint(e.clientX, e.clientY)
  }

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current || isRevealed) return
    scratchAtPoint(e.clientX, e.clientY)
  }

  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return
    isDrawingRef.current = false
    lastPointRef.current = null

    // Check if this interaction was a quick tap
    const meta = pointerDownMetaRef.current
    if (meta && e) {
      const dist = Math.hypot(e.clientX - meta.x, e.clientY - meta.y)
      const duration = Date.now() - meta.time
      if (dist < 10 && duration < 380) {
        tapCountRef.current += 1
        clearCircleAtPoint(e.clientX, e.clientY, 22)
        if (tapCountRef.current >= 3) {
          triggerUnlock()
        }
      }
    }
    pointerDownMetaRef.current = null
    checkScratchCompletion()
  }

  const handleResetScratch = () => {
    setIsRevealed(false)
    setHasStartedScratching(false)
    setSparks([])
    tapCountRef.current = 0
    hasRunDemoRef.current = false
    setResetCount((c) => c + 1)
  }

  return (
    <div className="hero__date-medallion scratch-medallion">
      {/* Hidden SVG defs defining the exact postage stamp clip-path and metallic gold gradient */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <clipPath id="scratch-stamp-clip" clipPathUnits="userSpaceOnUse">
            <path d={stamp.d} />
          </clipPath>
          <linearGradient id="stamp-gold-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ba8e3e" />
            <stop offset="35%" stopColor="#ffd978" />
            <stop offset="65%" stopColor="#b8862d" />
            <stop offset="100%" stopColor="#8a5a12" />
          </linearGradient>
        </defs>
      </svg>

      <div
        ref={containerRef}
        className={`hero__medallion-border scratch-medallion__box ${isRevealed ? 'is-revealed' : ''}`}
      >
        {/* Crisp Embossed Postage Stamp Golden Outline & Inner Dotted Border */}
        <svg
          className="scratch-medallion__stamp-frame"
          viewBox={`0 0 ${stamp.w} ${stamp.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={stamp.d} fill="none" stroke="url(#stamp-gold-border)" strokeWidth="2.2" />
          <rect
            x="11"
            y="11"
            width={Math.max(1, stamp.w - 22)}
            height={Math.max(1, stamp.h - 22)}
            rx="2"
            fill="none"
            stroke="rgba(186, 142, 62, 0.45)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </svg>

        {/* Bottom Revealed Layer: The Wedding Date & Auspicious Details */}
        <div className="scratch-medallion__prize">
          <div className="scratch-medallion__prize-header">
            <span className="scratch-medallion__star" aria-hidden="true">✦</span>
            <p className="hero__medallion-badge">Save The Sacred Date</p>
            <span className="scratch-medallion__star" aria-hidden="true">✦</span>
          </div>

          <p className="scratch-medallion__radhe-sub" lang="sa">
            ॥ श्री राधाकृष्णाभ्यां नमः ॥
          </p>

          {hasDate ? (
            <p className="hero__medallion-date scratch-medallion__date-text">
              {general.date}
            </p>
          ) : (
            <p className="hero__medallion-pending scratch-medallion__pending-text">
              Celebration Dates To Be Unveiled Soon
            </p>
          )}

          {hasPlace && (
            <p className="hero__medallion-place">{general.place}</p>
          )}

          {hasGuestArrival && (
            <p className="hero__medallion-arrival">
              Guest Arrival: {general.guestArrivalTime}
            </p>
          )}

          {isRevealed && (
            <button
              type="button"
              className="scratch-medallion__reset-btn"
              onClick={handleResetScratch}
              aria-label="Reset gold foil to scratch again"
            >
              ↺ Scratch Foil Again
            </button>
          )}
        </div>

        {/* Celebratory Burst Confetti Particles on Full Reveal */}
        {isRevealed && (
          <div className="scratch-medallion__burst" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => {
              const angle = (i / 16) * Math.PI * 2
              const dist = 55 + (i % 3) * 28
              const tx = `${(Math.cos(angle) * dist).toFixed(1)}px`
              const ty = `${(Math.sin(angle) * dist).toFixed(1)}px`
              return (
                <span
                  key={i}
                  className="scratch-medallion__confetti"
                  style={{ '--tx': tx, '--ty': ty }}
                />
              )
            })}
          </div>
        )}

        {/* Top Interactive 24K Gold Foil Scratch Canvas */}
        <div
          className={`scratch-medallion__foil-wrap ${isRevealed ? 'is-dissolved' : ''}`}
          aria-hidden={isRevealed}
        >
          <canvas
            ref={canvasRef}
            className="scratch-medallion__canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />

          {/* Animated Scratch Guide Hand & Pulse Wave during S demo */}
          {!hasStartedScratching && !isRevealed && demoFinger && (
            <div
              className={`scratch-medallion__hand-guide ${demoFinger?.active ? 'is-demoing' : ''}`}
              style={{
                left: `${demoFinger.x}px`,
                top: `${demoFinger.y}px`,
              }}
              aria-hidden="true"
            >
              <span className="scratch-medallion__hand-pulse" />
              <span className="scratch-medallion__hand-icon">👆</span>
            </div>
          )}

          {/* Live Gold Sparks while Scratching */}
          <div className="scratch-medallion__sparks" aria-hidden="true">
            {sparks.map((s) => (
              <span
                key={s.id}
                className="scratch-medallion__spark"
                style={{
                  left: `${s.x}px`,
                  top: `${s.y}px`,
                  '--dx': s.dx,
                  '--dy': s.dy,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Radiant One-Tap Unlock Button below the Medallion */}
      {!isRevealed && (
        <button
          type="button"
          className="scratch-medallion__quick-reveal"
          onClick={triggerUnlock}
          aria-label="Tap to unlock wedding festivities immediately"
        >
          <span className="scratch-medallion__quick-icon" aria-hidden="true">✨</span>
          <span className="scratch-medallion__quick-text">Tap Here to Reveal All Celebrations</span>
          <span className="scratch-medallion__quick-arrow" aria-hidden="true">↓</span>
        </button>
      )}

      {/* Celebratory Unlocked Scroll Cue Button */}
      {isRevealed && (
        <div
          className="scratch-medallion__unlocked-cue"
          onClick={() => {
            const nextChapter = document.querySelector('.invite-card__chapters-below')
            if (nextChapter) {
              nextChapter.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              const nextChapter = document.querySelector('.invite-card__chapters-below')
              if (nextChapter) {
                nextChapter.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Scroll to explore celebrations"
        >
          <span className="scratch-medallion__unlocked-sparkle" aria-hidden="true">✨</span>
          <span className="scratch-medallion__unlocked-text">Festivities Unlocked • Scroll to Explore</span>
          <span className="scratch-medallion__unlocked-arrow" aria-hidden="true">↓</span>
        </div>
      )}
    </div>
  )
}

