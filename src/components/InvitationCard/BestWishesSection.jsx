import { isConfirmed } from '../../utils/weddingHelpers.js'
import { useWeddingPerspective } from '../../utils/weddingPerspective.js'
import { RoyalDivider, FamilyBlessingsCrest } from './Ornaments'
import './BestWishesSection.css'

/**
 * Normalizes grouped family entries from weddingContent.json, preserving order
 * and filtering out any unconfirmed ('__') entries per Rule 2.1.
 */
function normalizeBestWishesGroups(bestWishes) {
  if (!bestWishes || typeof bestWishes !== 'object') return []

  if (Array.isArray(bestWishes.groomSideGroups)) {
    return bestWishes.groomSideGroups
      .map((group) => {
        if (!group || !isConfirmed(group.relation) || !Array.isArray(group.names)) {
          return null
        }
        const validNames = group.names
          .filter((name) => typeof name === 'string' && isConfirmed(name))
          .map((name) => name.trim())

        if (validNames.length === 0) return null
        return {
          relation: group.relation.trim(),
          names: validNames,
        }
      })
      .filter(Boolean)
  }

  // Fallback compatibility for flat groomSideMembers arrays
  if (Array.isArray(bestWishes.groomSideMembers)) {
    const validNames = bestWishes.groomSideMembers
      .map((entry) => {
        if (typeof entry === 'string' && isConfirmed(entry)) return entry.trim()
        if (entry && typeof entry === 'object' && isConfirmed(entry.name)) {
          return entry.name.trim()
        }
        return null
      })
      .filter(Boolean)

    if (validNames.length > 0) {
      return [{ relation: '', names: validNames }]
    }
  }

  return []
}

export default function BestWishesSection({ bestWishes }) {
  const perspective = useWeddingPerspective()

  // Strictly visible for the groom's side only (?side=groom or default URL)
  if (perspective.isBride || !bestWishes) return null

  const groups = normalizeBestWishesGroups(bestWishes)
  const closingNote = isConfirmed(bestWishes.closingNote)
    ? bestWishes.closingNote.trim()
    : ''
  const isDevPreview = import.meta.env.DEV

  // In production, never render an unpopulated placeholder section
  if (groups.length === 0 && !isDevPreview) {
    return null
  }

  const kicker = isConfirmed(bestWishes.kicker) ? bestWishes.kicker : 'Well-Wishers'
  const title = isConfirmed(bestWishes.title) ? bestWishes.title : 'With Best Wishes From'
  const subtitle = isConfirmed(bestWishes.subtitle) ? bestWishes.subtitle : ''

  return (
    <section
      className="best-wishes-section"
      aria-label="With best wishes from the groom's family"
    >
      <div className="best-wishes-section__head">
        <RoyalDivider className="best-wishes-section__divider" />
        <span className="best-wishes-section__kicker">{kicker}</span>
        <h2 className="best-wishes-section__title">{title}</h2>
      </div>

      <div className="best-wishes-card">
        <div className="best-wishes-card__crest" aria-hidden="true">
          <FamilyBlessingsCrest className="best-wishes-card__crest-icon" />
        </div>

        {subtitle && <p className="best-wishes-card__subtitle">{subtitle}</p>}

        <div className="best-wishes-card__hairline" aria-hidden="true" />

        {groups.length > 0 ? (
          <>
            <div className="best-wishes-card__groups">
              {groups.map((group, idx) => (
                <div
                  key={`${group.relation || 'group'}-${idx}`}
                  className="best-wishes-card__group"
                >
                  {group.relation && (
                    <h3 className="best-wishes-card__relation-heading">
                      <span className="best-wishes-card__relation-dot" aria-hidden="true">
                        ✦
                      </span>
                      <span>{group.relation}</span>
                      <span className="best-wishes-card__relation-dot" aria-hidden="true">
                        ✦
                      </span>
                    </h3>
                  )}

                  <ul
                    className={`best-wishes-card__names-list${
                      group.names.length === 1 ? ' best-wishes-card__names-list--single' : ''
                    }`}
                  >
                    {group.names.map((name, nameIdx) => (
                      <li key={`${name}-${nameIdx}`} className="best-wishes-card__name-pill">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {closingNote && (
              <>
                <div
                  className="best-wishes-card__hairline best-wishes-card__hairline--closing"
                  aria-hidden="true"
                />
                <p className="best-wishes-card__closing-note">{closingNote}</p>
              </>
            )}
          </>
        ) : (
          <div className="best-wishes-card__empty-preview">
            <span className="best-wishes-card__empty-badge">
              ✦ Groom&apos;s Side Family Preview ✦
            </span>
            <p className="best-wishes-card__empty-note">
              Groom&apos;s side family members&apos; names will appear gracefully here once added.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
