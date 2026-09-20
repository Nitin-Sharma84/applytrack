import { formatDateTime } from '../../utils/formatters.js'
import { Badge } from '../ui/Badge.jsx'
import './ApplicationDrawer.css'

/** Status history, oldest first. Every status change is recorded automatically. */
export function StatusTimeline({ history }) {
  return (
    <ol className="timeline">
      {history.map((entry, index) => (
        <li key={`${entry.status}-${entry.date}`} className="timeline__item">
          <Badge status={entry.status} />
          <span className="timeline__date">{formatDateTime(entry.date)}</span>
          {index === history.length - 1 && <span className="timeline__now">Current</span>}
        </li>
      ))}
    </ol>
  )
}