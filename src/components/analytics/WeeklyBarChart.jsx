import { useId } from 'react'
import './Analytics.css'

// Everything is drawn in one fixed coordinate system (viewBox). CSS scales it to the card width.
const WIDTH = 320
const HEIGHT = 170
const BASELINE = 135
const PLOT_TOP = 22
const BAR_WIDTH = 26

/** @param {{ weeks: { label: string, count: number }[] }} props oldest week first */
export function WeeklyBarChart({ weeks }) {
  const titleId = useId()
  const largest = Math.max(1, ...weeks.map((week) => week.count))
  const slot = WIDTH / weeks.length
  const summary = weeks.map((week) => `week of ${week.label}: ${week.count}`).join(', ')

  return (
    <section className="analytics-card glass" aria-labelledby={titleId}>
      <h2 id={titleId} className="analytics-card__title">
        Applications per week
      </h2>
      <svg
        className="bar-chart"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Applications sent per week for the last ${weeks.length} weeks. ${summary}.`}
      >
        <line className="bar-chart__axis" x1="0" x2={WIDTH} y1={BASELINE} y2={BASELINE} />
        {weeks.map((week, index) => {
          const barHeight = (week.count / largest) * (BASELINE - PLOT_TOP)
          const x = index * slot + (slot - BAR_WIDTH) / 2
          const isCurrent = index === weeks.length - 1
          return (
            <g key={week.label}>
              <rect
                className={`bar-chart__bar${isCurrent ? ' bar-chart__bar--current' : ''}`}
                x={x}
                y={BASELINE - barHeight}
                width={BAR_WIDTH}
                height={barHeight}
                rx="4"
              />
              <text
                className="bar-chart__value"
                x={x + BAR_WIDTH / 2}
                y={BASELINE - barHeight - 6}
                textAnchor="middle"
              >
                {week.count}
              </text>
              <text className="bar-chart__label" x={x + BAR_WIDTH / 2} y={BASELINE + 18} textAnchor="middle">
                {week.label}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="analytics-card__note">Each bar is a week starting Monday. The last bar is this week.</p>
    </section>
  )
}