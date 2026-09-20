import './ProgressRing.css'

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Circular progress. The arc length is set with stroke-dasharray / stroke-dashoffset.
 * @param {{ percent: number, label: string, children?: import('react').ReactNode }} props
 * percent is 0 to 100. children is shown in the middle of the ring.
 */
export function ProgressRing({ percent, label, children }) {
  const value = Math.min(100, Math.max(0, percent))

  return (
    <div
      className="ring"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <svg className="ring__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle className="ring__track" cx="50" cy="50" r={RADIUS} />
        <circle
          className="ring__value"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - value / 100)}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="ring__center">{children}</div>
    </div>
  )
}