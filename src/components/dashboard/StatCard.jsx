import './StatCard.css'

/**
 * One number with a label. Rendered inside a <dl>, so screen readers hear
 * "Total, 12" as a term and its value.
 * @param {{ label: string, value: string|number, hint?: string,
 *           tone?: 'primary'|'applied'|'interview'|'offer'|'rejected'|'neutral' }} props
 */
export function StatCard({ label, value, hint, tone = 'primary' }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <dt className="stat-card__label">{label}</dt>
      <dd className="stat-card__value">{value}</dd>
      {hint && <dd className="stat-card__hint">{hint}</dd>}
    </div>
  )
}