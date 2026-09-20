import './ProgressBar.css'

/** @param {{ value: number, label: string }} props value is 0 to 100. label is read by screen readers. */
export function ProgressBar({ value, label }) {
  const percent = Math.min(100, Math.max(0, value))

  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      {/* scaleX (not width) is animated: transform is smooth and does not trigger layout. */}
      <div className="progress__fill" style={{ transform: `scaleX(${percent / 100})` }} />
    </div>
  )
}