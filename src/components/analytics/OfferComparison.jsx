import { useId, useState } from 'react'
import { formatCtc, formatDate } from '../../utils/formatters.js'
import { Badge } from '../ui/Badge.jsx'
import './Analytics.css'
import './OfferComparison.css'

const MAX_COMPARE = 3

// One entry per table row: the label, and how to show that value for an offer.
const ROWS = [
  {
    label: 'Package',
    render: (offer, isBest) =>
      offer.ctcLpa === null ? (
        '-'
      ) : (
        <>
          {formatCtc(offer.ctcLpa)} {isBest && <Badge tone="success">Highest</Badge>}
        </>
      ),
  },
  { label: 'Role', render: (offer) => offer.role },
  { label: 'Location', render: (offer) => offer.location || '-' },
  { label: 'Work mode', render: (offer) => offer.workMode },
  { label: 'Job type', render: (offer) => offer.jobType },
  { label: 'Reply by', render: (offer) => (offer.deadline ? formatDate(offer.deadline) : '-') },
  { label: 'Notes', render: (offer) => offer.notes || '-' },
]

/** Compare up to 3 applications that are in the Offer status, side by side. */
export function OfferComparison({ offers }) {
  const titleId = useId()
  const [selectedIds, setSelectedIds] = useState([])

  // Derived: ids of offers that no longer exist (status changed) are simply ignored.
  const selected = offers.filter((offer) => selectedIds.includes(offer.id))
  const bestCtc = Math.max(...selected.map((offer) => offer.ctcLpa ?? -1))

  function handleToggle(id) {
    const currentIds = selected.map((offer) => offer.id)
    if (currentIds.includes(id)) {
      setSelectedIds(currentIds.filter((currentId) => currentId !== id))
    } else if (currentIds.length < MAX_COMPARE) {
      setSelectedIds([...currentIds, id])
    }
  }

  return (
    <section className="analytics-card glass" aria-labelledby={titleId}>
      <h2 id={titleId} className="analytics-card__title">
        Compare offers
      </h2>

      {offers.length < 2 ? (
        <p className="analytics-card__note">
          You have {offers.length} {offers.length === 1 ? 'offer' : 'offers'}. Move two or more
          applications to the Offer status to compare them here.
        </p>
      ) : (
        <>
          <fieldset className="offer-compare__picker">
            <legend>Pick 2 or 3 offers</legend>
            {offers.map((offer) => {
              const isSelected = selected.some((item) => item.id === offer.id)
              return (
                <label key={offer.id} className="offer-compare__option">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={!isSelected && selected.length >= MAX_COMPARE}
                    onChange={() => handleToggle(offer.id)}
                  />
                  <span>{offer.company}</span>
                  <span className="text-muted">{offer.role}</span>
                </label>
              )
            })}
          </fieldset>

          {selected.length < 2 ? (
            <p className="analytics-card__note">Select at least 2 offers to see them side by side.</p>
          ) : (
            <div className="offer-compare__wrap">
              <table className="offer-compare__table">
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">Detail</span>
                    </th>
                    {selected.map((offer) => (
                      <th key={offer.id} scope="col">
                        {offer.company}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {selected.map((offer) => (
                        <td key={offer.id}>
                          {row.render(offer, offer.ctcLpa !== null && offer.ctcLpa === bestCtc)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  )
}