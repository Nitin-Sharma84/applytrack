import { STATUS } from '../../constants/statuses.js'
import { formatDeadlineCountdown, formatShortDate } from '../../utils/formatters.js'
import { Badge } from '../ui/Badge.jsx'
import { IconAlertCircle, IconClock } from '../ui/Icons.jsx'
import './ApplicationList.css'

/**
 * Deadline date + smart countdown badge ("3 days left", "Due today",
 * "Urgent · 2 days left", "Overdue by 2 days").
 * The badge always has text and an icon, so color is never the only signal.
 *
 * @param {{ application: object, daysToDeadline: number|null, isUrgent: boolean }} props
 */
export function DeadlineBadge({ application, daysToDeadline, isUrgent }) {
  if (daysToDeadline === null) return <span className="deadline-badge__none">No deadline</span>

  const isOverdue = daysToDeadline < 0
  // A passed deadline only matters while the job is still just on the Wishlist.
  const showCountdown =
    application.status !== STATUS.REJECTED && (!isOverdue || application.status === STATUS.WISHLIST)
  const countdown = formatDeadlineCountdown(daysToDeadline)

  return (
    <div className="deadline-badge">
      <span className="deadline-badge__date">{formatShortDate(application.deadline)}</span>
      {showCountdown && (
        <Badge
          tone={isOverdue ? 'danger' : isUrgent ? 'warning' : 'neutral'}
          icon={isOverdue || isUrgent ? <IconAlertCircle size={14} /> : <IconClock size={14} />}
        >
          {isUrgent ? `Urgent · ${countdown}` : countdown}
        </Badge>
      )}
    </div>
  )
}