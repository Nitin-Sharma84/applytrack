import { useId } from 'react'
import { getStatusSlug } from '../../constants/statuses.js'
import './Analytics.css'

/** @param {{ stages: { status: string, count: number, conversion: number|null }[] }} props */
export function FunnelChart({ stages }) {
  const titleId = useId()
  const largest = Math.max(1, ...stages.map((stage) => stage.count))

  return (
    <section className="analytics-card glass" aria-labelledby={titleId}>
      <h2 id={titleId} className="analytics-card__title">
        Application funnel
      </h2>
      <ol className="funnel">
        {stages.map((stage, index) => (
          <li key={stage.status} className="funnel__row">
            <div className="funnel__label">
              <span>{stage.status}</span>
              <span className="tabular-nums">{stage.count}</span>
            </div>
            <div className="funnel__track">
              {/* transform is animated (not width), so it stays smooth. */}
              <div
                className={`funnel__bar solid--${getStatusSlug(stage.status)}`}
                style={{ transform: `scaleX(${stage.count / largest})` }}
              />
            </div>
            {stage.conversion !== null && (
              <p className="funnel__conversion">
                {stage.conversion}% moved on from {stages[index - 1].status}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}