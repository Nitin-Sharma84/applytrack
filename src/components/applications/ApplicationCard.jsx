import { memo, useMemo } from 'react'
import { SAMPLE_TAG } from '../../constants/sampleData.js'
import { getDerivedFields } from '../../utils/applicationHelpers.js'
import { formatCtc } from '../../utils/formatters.js'
import { Badge } from '../ui/Badge.jsx'
import { IconClock } from '../ui/Icons.jsx'
import { ApplicationActions } from './ApplicationActions.jsx'
import { DeadlineBadge } from './DeadlineBadge.jsx'
import { StatusSelect } from './StatusSelect.jsx'
import './ApplicationList.css'

// memo for the same reason as ApplicationRow: unchanged applications skip re-rendering.
export const ApplicationCard = memo(function ApplicationCard({
  application,
  followUpDays,
  onEdit,
  onDelete,
  onChangeStatus,
}) {
  const derived = useMemo(
    () => getDerivedFields(application, followUpDays),
    [application, followUpDays],
  )
  const ctc = formatCtc(application.ctcLpa)
  const meta = [`${application.priority} priority`, application.workMode, application.location]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="application-card">
      <header className="application-card__header">
        <div className="application-card__title">
          <button type="button" className="application-row__name" onClick={() => onEdit(application)}>
            {application.company}
          </button>
          <p className="application-card__role">{application.role}</p>
        </div>
        <ApplicationActions application={application} onEdit={onEdit} onDelete={onDelete} />
      </header>

      <div className="application-card__status">
        <StatusSelect
          id={application.id}
          company={application.company}
          value={application.status}
          onChange={onChangeStatus}
        />
        {ctc && <span className="tabular-nums text-muted">{ctc}</span>}
      </div>

      <div className="application-badges">
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
        {application.tags.includes(SAMPLE_TAG) && <Badge>Sample</Badge>}
      </div>

      <p className="application-card__meta">{meta}</p>
    </article>
  )
})