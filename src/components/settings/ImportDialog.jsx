import { Button } from '../ui/Button.jsx'
import { Modal } from '../ui/Modal.jsx'
import './ImportDialog.css'

/**
 * The 3-way choice after a backup file was read: merge, replace or cancel.
 * @param {{ result: { applications: object[], skipped: number }|null, currentCount: number,
 *           onMerge: () => void, onReplace: () => void, onCancel: () => void }} props
 */
export function ImportDialog({ result, currentCount, onMerge, onReplace, onCancel }) {
  return (
    <Modal
      isOpen={result !== null}
      title="Import backup"
      size="sm"
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onMerge} data-autofocus>
            Merge with current
          </Button>
          <Button variant="danger" onClick={onReplace}>
            Replace current data
          </Button>
        </>
      }
    >
      {result && (
        <div className="import-dialog">
          <p>
            Found <strong>{result.applications.length}</strong> valid applications
            {result.skipped > 0 && ` (${result.skipped} skipped: invalid or duplicate)`}.
          </p>
          <p className="modal__text">
            <strong>Merge</strong> keeps your {currentCount} current applications and adds the new
            ones. If the same application exists in both, the newer version wins.{' '}
            <strong>Replace</strong> deletes your current data first.
          </p>
        </div>
      )}
    </Modal>
  )
}