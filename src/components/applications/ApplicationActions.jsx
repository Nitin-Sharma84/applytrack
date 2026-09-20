import { Button } from '../ui/Button.jsx'
import { IconEdit, IconExternalLink, IconTrash } from '../ui/Icons.jsx'
import './ApplicationList.css'

/** Open link (if any), edit and delete buttons. Shared by the table row and the mobile card. */
export function ApplicationActions({ application, onEdit, onDelete }) {
  return (
    <div className="application-actions">
      {application.jobLink && (
        <a
          className="btn btn--ghost btn--sm btn--icon"
          href={application.jobLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open job link for ${application.company}`}
          title="Open job link"
        >
          <IconExternalLink size={18} />
        </a>
      )}
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label={`Edit ${application.company}`}
        title="Edit"
        onClick={() => onEdit(application)}
      >
        <IconEdit size={18} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label={`Delete ${application.company}`}
        title="Delete"
        onClick={() => onDelete(application)}
      >
        <IconTrash size={18} />
      </Button>
    </div>
  )
}