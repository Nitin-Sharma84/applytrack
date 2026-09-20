import { useApplicationForm } from '../../hooks/useApplicationForm.js'
import { useApplications } from '../../hooks/useApplications.js'
import { useDeleteApplication } from '../../hooks/useDeleteApplication.js'
import { useSettings } from '../../hooks/useSettings.js'
import { useToast } from '../../hooks/useToast.js'
import { getDerivedFields } from '../../utils/applicationHelpers.js'
import { formatCtc, formatDate } from '../../utils/formatters.js'
import { DeadlineBadge } from '../applications/DeadlineBadge.jsx'
import { StatusSelect } from '../applications/StatusSelect.jsx'
import { Badge } from '../ui/Badge.jsx'
import { Button } from '../ui/Button.jsx'
import { Drawer } from '../ui/Drawer.jsx'
import { IconEdit, IconTrash } from '../ui/Icons.jsx'
import { NotesEditor } from './NotesEditor.jsx'
import { PrepChecklist } from './PrepChecklist.jsx'
import { RoundsList } from './RoundsList.jsx'
import { StatusTimeline } from './StatusTimeline.jsx'
import './ApplicationDrawer.css'

/**
 * Everything about one application: facts, status history, rounds, checklist, notes.
 * It receives only the id and reads the live application from context.
 */
export function ApplicationDrawer({ applicationId, onClose }) {
  const {
    applications,
    changeStatus,
    addRound,
    updateRound,
    deleteRound,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    setNotes,
  } = useApplications()
  const { settings } = useSettings()
  const { openEditApplication } = useApplicationForm()
  const deleteWithUndo = useDeleteApplication()
  const toast = useToast()

  const application = applications.find((item) => item.id === applicationId)
  if (!application) return null

  const id = application.id
  const derived = getDerivedFields(application, settings.followUpDays)

  async function handleDelete() {
    const wasDeleted = await deleteWithUndo(application)
    if (wasDeleted) onClose()
  }

  function handleSaveNotes(notes) {
    setNotes(id, notes)
    toast.success('Notes saved')
  }

  const contact = application.contactEmail ? (
    <a href={`mailto:${application.contactEmail}`}>
      {application.contactName || application.contactEmail}
    </a>
  ) : (
    application.contactName
  )

  // Only facts that have a value are shown, so the panel stays short and clean.
  const facts = [
    application.deadline && [
      'Deadline',
      <DeadlineBadge
        application={application}
        daysToDeadline={derived.daysToDeadline}
        isUrgent={derived.isUrgent}
      />,
    ],
    application.appliedDate && ['Applied on', formatDate(application.appliedDate)],
    application.ctcLpa !== null && ['Package', formatCtc(application.ctcLpa)],
    ['Priority', application.priority],
    ['Job type', application.jobType],
    ['Work mode', application.workMode],
    application.location && ['Location', application.location],
    ['Source', application.source],
    application.resumeVersion && ['Resume', application.resumeVersion],
    contact && ['Contact', contact],
    application.jobLink && [
      'Job link',
      <a href={application.jobLink} target="_blank" rel="noopener noreferrer">
        Open link
      </a>,
    ],
  ].filter(Boolean)

  return (
    <Drawer title={application.company} subtitle={application.role} onClose={onClose}>
      <div className="details">
        <div className="details__toolbar">
          <StatusSelect
            id={id}
            company={application.company}
            value={application.status}
            onChange={changeStatus}
          />
          {derived.needsFollowUp && <Badge tone="info">Follow-up due</Badge>}
          <div className="details__toolbar-actions">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<IconEdit size={16} />}
              onClick={() => openEditApplication(application)}
            >
              Edit details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="details__delete"
              leftIcon={<IconTrash size={16} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        <dl className="details__facts">
          {facts.map(([label, value]) => (
            <div key={label} className="details__fact">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {application.tags.length > 0 && (
          <ul className="details__tags" aria-label="Tags">
            {application.tags.map((tag) => (
              <li key={tag}>
                <Badge tone="primary">{tag}</Badge>
              </li>
            ))}
          </ul>
        )}

        <section className="details__section">
          <h3 className="details__heading">Status history</h3>
          <StatusTimeline history={application.statusHistory} />
        </section>

        <section className="details__section">
          <h3 className="details__heading">Interview rounds</h3>
          <RoundsList
            rounds={application.rounds}
            onAdd={(values) => addRound(id, values)}
            onUpdate={(roundId, values) => updateRound(id, roundId, values)}
            onDelete={(roundId) => deleteRound(id, roundId)}
          />
        </section>

        <section className="details__section">
          <h3 className="details__heading">Preparation checklist</h3>
          <PrepChecklist
            items={application.prepChecklist}
            onAdd={(text) => addChecklistItem(id, text)}
            onToggle={(itemId) => toggleChecklistItem(id, itemId)}
            onDelete={(itemId) => deleteChecklistItem(id, itemId)}
          />
        </section>

        <section className="details__section">
          <h3 className="details__heading">Notes</h3>
          {/* key: if the notes change from the Edit form, this box restarts with the saved text. */}
          <NotesEditor key={application.notes} notes={application.notes} onSave={handleSaveNotes} />
        </section>
      </div>
    </Drawer>
  )
}