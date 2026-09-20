import { memo, useMemo } from 'react'
import { SAMPLE_TAG } from '../../constants/sampleData.js'
import { PRIORITY } from '../../constants/options.js'
import { getDerivedFields } from '../../utils/applicationHelpers.js'
import { formatCtc } from '../../utils/formatters.js'
import { Badge } from '../ui/Badge.jsx'
import { IconClock } from '../ui/Icons.jsx'
import { ApplicationActions } from './ApplicationActions.jsx'
import { DeadlineBadge } from './DeadlineBadge.jsx'
import { StatusSelect } from './StatusSelect.jsx'
import './ApplicationList.css'
import { useApplicationDrawer } from '../../hooks/useApplicationDrawer.js'

// memo: the reducer keeps the same object for untouched applications, and the
// callbacks from the page are stable. So changing one status re-renders one row, not all.
export const ApplicationRow = memo(function ApplicationRow({
  application,
  followUpDays,
  onEdit,
  onDelete,
  onChangeStatus,
}) {

  const { openApplicationDetails } = useApplicationDrawer()
  // Derived values are calculated here and never stored.
  const derived = useMemo(
    () => getDerivedFields(application, followUpDays),
    [application, followUpDays],
  )

  return (
    <tr className="application-row">
      <td className="application-row__main">
        <button type="button" className="application-row__name" onClick={() => openApplicationDetails(application)}>
          {application.company}
        </button>
        <span className="application-row__role">
          {application.role}
          {application.tags.includes(SAMPLE_TAG) && <Badge>Sample</Badge>}
        </span>
      </td>
      <td>
        <StatusSelect
          id={application.id}
          company={application.company}
          value={application.status}
          onChange={onChangeStatus}
        />
      </td>
      <td>
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
        </div>
      </td>
      <td className="tabular-nums">{formatCtc(application.ctcLpa) || '-'}</td>
      <td>
        <span className={application.priority === PRIORITY.HIGH ? 'application-priority--high' : undefined}>
          {application.priority}
        </span>
      </td>
      <td>
        <ApplicationActions application={application} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  )
})