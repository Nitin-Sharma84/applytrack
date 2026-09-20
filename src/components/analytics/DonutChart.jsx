import { useId } from 'react'
import { getStatusSlug } from '../../constants/statuses.js'
import { toPercent } from '../../utils/statsHelpers.js'
import './Analytics.css'

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Donut chart drawn with SVG circles. Each status is one circle whose visible
 * part is set with stroke-dasharray (length of the arc) and stroke-dashoffset
 * (where the arc starts).
 * @param {{ items: { status: string, count: number }[], total: number }} props
 */
export function DonutChart({ items, total }) {
  const titleId = useId()
  const summary = items.map((item) => `${item.status}: ${item.count}`).join(', ')

  const segments = items.map((item, index) => {
    const countBefore = items.slice(0, index).reduce((sum, other) => sum + other.count, 0)
    return {
      ...item,
      length: (item.count / total) * CIRCUMFERENCE,
      offset: (countBefore / total) * CIRCUMFERENCE,
    }
  })

  return (
    <section className="analytics-card glass" aria-labelledby={titleId}>
      <h2 id={titleId} className="analytics-card__title">
        Status distribution
      </h2>
      <div className="donut">
        <svg className="donut__svg" viewBox="0 0 100 100" role="img" aria-label={`Applications by status. ${summary}.`}>
          <circle className="donut__track" cx="50" cy="50" r={RADIUS} />
          {segments.map((segment) => (
            <circle
              key={segment.status}
              className={`donut__segment solid--${getStatusSlug(segment.status)}`}
              cx="50"
              cy="50"
              r={RADIUS}
              strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
              strokeDashoffset={-segment.offset}
              transform="rotate(-90 50 50)"
            />
          ))}
          <text className="donut__total" x="50" y="52" textAnchor="middle">
            {total}
          </text>
          <text className="donut__caption" x="50" y="63" textAnchor="middle">
            total
          </text>
        </svg>

        {/* The legend repeats every number as text, so the chart never depends on color alone. */}
        <ul className="donut__legend">
          {items.map((item) => (
            <li key={item.status} className="donut__legend-item">
              <span className={`donut__swatch solid--${getStatusSlug(item.status)}`} aria-hidden="true" />
              <span>{item.status}</span>
              <strong className="tabular-nums">{item.count}</strong>
              <span className="text-muted tabular-nums">({toPercent(item.count, total)}%)</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}