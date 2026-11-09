import { useState, useEffect, useRef } from 'react'
import PrintableInvitationCard from './PrintableInvitationCard'
import { exportCardNodeAsPdf } from '../../utils/cardExporter.js'
import './PersonalizedCardModal.css'

export default function PersonalizedCardModal({
  isOpen,
  onClose,
  weddingData,
}) {
  const [guestName, setGuestName] = useState('')
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState('')
  const [exportError, setExportError] = useState('')

  const exportCardRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleDownloadPdf = async () => {
    const node = exportCardRef.current
    if (!node || isExportingPdf) return

    setIsExportingPdf(true)
    setDownloadSuccess('')
    setExportError('')
    try {
      const success = await exportCardNodeAsPdf(node, guestName)
      if (success) {
        setDownloadSuccess('✓ Print-Ready PDF downloaded successfully!')
        setTimeout(() => setDownloadSuccess(''), 4500)
      } else {
        setExportError('Could not generate PDF. Please try again.')
      }
    } catch {
      setExportError('Export encountered an error. Please try again.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  const appendFamilyChip = () => {
    setGuestName((prev) => {
      const trimmed = prev.trim()
      if (!trimmed) return 'Shri & Smt. & Family'
      if (trimmed.toLowerCase().includes('& family')) return trimmed
      return `${trimmed} & Family`
    })
  }

  const displayName = guestName.trim() || 'Our Honoured Guests & Family'

  return (
    <div
      className="card-download-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-download-title"
    >
      <div className="card-download-modal__backdrop" onClick={onClose} />

      <div className="card-download-modal__container">
        {/* Modal Header */}
        <div className="card-download-modal__header">
          <div className="card-download-modal__header-titles">
            <span className="card-download-modal__kicker">
              ✦ Personalize &amp; Download ✦
            </span>
            <h2 id="card-download-title" className="card-download-modal__title">
              Your Wedding Invitation Card
            </h2>
          </div>
          <button
            type="button"
            className="card-download-modal__close"
            onClick={onClose}
            aria-label="Close download dialog"
          >
            ✕
          </button>
        </div>

        {/* Guest Name Input Form */}
        <div className="card-download-modal__form">
          <label htmlFor="guest-name-input" className="card-download-modal__label">
            <span>Enter Guest or Family Name</span>
            <span className="card-download-modal__label-sub">
              (Appears in golden calligraphy on your personalized card)
            </span>
          </label>

          <div className="card-download-modal__input-wrap">
            <input
              id="guest-name-input"
              type="text"
              className="card-download-modal__input"
              placeholder="e.g. Shri Rajesh Sharma &amp; Family"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              maxLength={50}
              autoFocus
            />
            {guestName && (
              <button
                type="button"
                className="card-download-modal__input-clear"
                onClick={() => setGuestName('')}
                aria-label="Clear name"
              >
                ✕
              </button>
            )}
          </div>

          <div className="card-download-modal__chips">
            <button
              type="button"
              className="card-download-modal__chip"
              onClick={appendFamilyChip}
            >
              + Add &quot;&amp; Family&quot;
            </button>
          </div>
        </div>

        {/* Clean Luxury Card Summary */}
        <div className="card-download-modal__card-summary">
          <div className="card-download-modal__summary-badge">
            <span className="card-download-modal__summary-star">✦</span>
            <span>INVITING</span>
            <span className="card-download-modal__summary-star">✦</span>
          </div>

          <h3 className="card-download-modal__summary-guest">{displayName}</h3>

          <p className="card-download-modal__summary-desc">
            Your card includes the royal couple portrait, all 4 ceremony photos (Haldi, Mehendi, Shaadi, Reception), Vrindavan venue, and offline scannable QR directions.
          </p>
        </div>

        {/* Status Alerts */}
        {downloadSuccess && (
          <p className="card-download-modal__success" role="status">
            {downloadSuccess}
          </p>
        )}
        {exportError && (
          <p className="card-download-modal__error" role="alert">
            {exportError}
          </p>
        )}

        {/* Direct Immediate PDF Download Action */}
        <div className="card-download-modal__actions">
          <button
            type="button"
            className="card-download-modal__btn card-download-modal__btn--primary"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
          >
            <span className="card-download-modal__btn-icon">📄</span>
            <span>
              {isExportingPdf
                ? 'Generating High-Res PDF...'
                : 'Download Personalized PDF'}
            </span>
          </button>
        </div>

        <p className="card-download-modal__offline-note">
          ✦ High-resolution printable PDF with complete ceremonies, couple portrait &amp; QR map.
        </p>
      </div>

      {/* Dedicated Offscreen 760px Export Container — Guaranteed Full Desktop Resolution on All Devices */}
      <div
        className="card-download-modal__export-staging"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '760px',
          minWidth: '760px',
          maxWidth: '760px',
          pointerEvents: 'none',
          zIndex: -1000,
          opacity: 1,
        }}
      >
        <PrintableInvitationCard
          forwardedRef={exportCardRef}
          guestName={guestName}
          weddingData={weddingData}
        />
      </div>
    </div>
  )
}
