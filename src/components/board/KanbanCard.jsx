import { memo, useMemo } from 'react'
import { getDerivedFields } from '../../utils/applicationHelpers.js'
import { formatCtc } from '../../utils/formatters.js'
import { DeadlineBadge } from '../applications/DeadlineBadge.jsx'
import { StatusSelect } from '../applications/StatusSelect.jsx'
import { Badge } from '../ui/Badge.jsx'
import { IconClock } from '../ui/Icons.jsx'
import './KanbanBoard.css'

// memo: while a card is being dragged, only its own props change,
// so the other cards skip re-rendering. This works because the callbacks are stable.
export const KanbanCard = memo(function KanbanCard({
  application,
  followUpDays,
  isDragging,
  onDragStart,
  onDragEnd,
  onEdit,
  onMove,
}) {
  const derived = useMemo(
    () => getDerivedFields(application, followUpDays),
    [application, followUpDays],
  )
  const ctc = formatCtc(application.ctcLpa)

  return (
    <article
      className={`kanban-card${isDragging ? ' kanban-card--dragging' : ''}`}
      draggable
      onDragStart={(event) => onDragStart(event, application.id)}
      onDragEnd={onDragEnd}
    >
      <button type="button" className="kanban-card__name" onClick={() => onEdit(application)}>
        {application.company}
      </button>
      <p className="kanban-card__role">{application.role}</p>
      {ctc && <p className="kanban-card__ctc tabular-nums">{ctc}</p>}

      <div className="kanban-card__badges">
        <DeadlineBadge
          application={application}
          daysToDeadline={derived.daysToDeadline}
          isUrgent={derived.isUrgent}
        />
        {derived.needsFollowUp && (
          <Badge tone="info" icon={<IconClock size={14} />}>
            Follow-up due
          </Badge>
        )}
      </div>

      {/* The non-drag alternative: works with keyboard, screen readers and touch. */}
      <StatusSelect
        id={application.id}
        company={application.company}
        value={application.status}
        onChange={(id, status) => onMove(application, status)}
      />
    </article>
  )
})