import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { IconEdit, IconTrash } from '../components/ui/Icons.jsx'
import { useApplicationForm } from '../hooks/useApplicationForm.js'
import { useApplications } from '../hooks/useApplications.js'
import { useDeleteApplication } from '../hooks/useDeleteApplication.js'
import './PreviewPage.css'

export function PreviewPage({ pageLabel }) {
  const { applications } = useApplications()
  const { openNewApplication, openEditApplication } = useApplicationForm()
  const deleteWithUndo = useDeleteApplication()

  if (applications.length === 0) {
    return (
      <section className="preview-page__card glass">
        <EmptyState
          title="No applications yet"
          description="Add your first application and start tracking deadlines and interviews."
          actionLabel="Add application"
          onAction={openNewApplication}
        />
      </section>
    )
  }

  return (
    <section className="preview-page__card glass" aria-labelledby="preview-title">
      <h1 id="preview-title" className="preview-page__title">
        {pageLabel} (temporary list, real page in Phase 5)
      </h1>
      <ul className="preview-page__list">
        {applications.map((application) => (
          <li key={application.id} className="preview-page__item">
            <div className="preview-page__info">
              <strong className="truncate">{application.company}</strong>
              <span className="text-muted truncate">{application.role}</span>
            </div>
            <Badge status={application.status} />
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={`Edit ${application.company}`}
              onClick={() => openEditApplication(application)}
            >
              <IconEdit size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={`Delete ${application.company}`}
              onClick={() => deleteWithUndo(application)}
            >
              <IconTrash size={18} />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}