import { Button } from './Button.jsx'
import './EmptyState.css'

/** Decorative illustration (inline SVG). Colors come from CSS variables, so it follows the theme. */
function EmptyIllustration() {
  return (
    <svg className="empty-state__art" viewBox="0 0 200 150" aria-hidden="true" focusable="false">
      <ellipse className="empty-state__art-shadow" cx="100" cy="134" rx="70" ry="9" />
      <rect className="empty-state__art-card" x="48" y="16" width="104" height="106" rx="16" />
      <rect className="empty-state__art-accent" x="64" y="36" width="30" height="10" rx="5" />
      <rect className="empty-state__art-line" x="64" y="58" width="72" height="8" rx="4" />
      <rect className="empty-state__art-line" x="64" y="76" width="54" height="8" rx="4" />
      <rect className="empty-state__art-line" x="64" y="94" width="62" height="8" rx="4" />
      <circle className="empty-state__art-badge" cx="148" cy="108" r="22" />
      <path className="empty-state__art-plus" d="M138 108h20M148 98v20" />
    </svg>
  )
}

/**
 * Friendly "nothing here yet" message with a clear next step.
 * @param {{ title: string, description?: string, actionLabel?: string, onAction?: () => void,
 *           secondaryLabel?: string, onSecondaryAction?: () => void }} props
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
}) {
  return (
    <div className="empty-state">
      <EmptyIllustration />
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__description">{description}</p>}
      {(actionLabel || secondaryLabel) && (
        <div className="empty-state__actions">
          {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
          {secondaryLabel && (
            <Button variant="secondary" onClick={onSecondaryAction}>
              {secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}