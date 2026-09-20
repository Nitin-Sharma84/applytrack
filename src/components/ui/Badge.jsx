import { getStatusSlug } from '../../constants/statuses.js'
import './Badge.css'

/**
 * Small label. Two ways to use it:
 *  <Badge status="Interview" />                 status color + dot + text
 *  <Badge tone="warning" icon={<Icon />}>Urgent</Badge>
 * Color is never the only signal: there is always text, and often an icon or dot.
 *
 * @param {{ tone?: 'neutral'|'primary'|'success'|'warning'|'danger'|'info', status?: string,
 *           icon?: import('react').ReactNode, children?: import('react').ReactNode }} props
 */
export function Badge({ tone = 'neutral', status, icon = null, children }) {
  if (status) {
    return (
      <span className={`badge badge--status badge--status-${getStatusSlug(status)}`}>
        <span className="badge__dot" aria-hidden="true" />
        {children ?? status}
      </span>
    )
  }

  return (
    <span className={`badge badge--${tone}`}>
      {icon}
      {children}
    </span>
  )
}