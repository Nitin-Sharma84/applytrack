import { useApplications } from '../../hooks/useApplications.js'
import { useDeleteApplication } from '../../hooks/useDeleteApplication.js'
import { useToast } from '../../hooks/useToast.js'
import { Button } from '../ui/Button.jsx'
import { IconTrash } from '../ui/Icons.jsx'
import { Modal } from '../ui/Modal.jsx'
import { ApplicationForm } from './ApplicationForm.jsx'
import './ApplicationFormModal.css'

const FORM_ID = 'application-form'

/**
 * Modal shell around ApplicationForm. It decides what "submit" means:
 * add a new application, or update the one being edited.
 * While the modal is closed, Modal renders nothing, so the form is not mounted
 * and its values reset automatically on every open.
 */
export function ApplicationFormModal({ isOpen, application, onClose }) {
  const { addApplication, updateApplication } = useApplications()
  const deleteWithUndo = useDeleteApplication()
  const toast = useToast()
  const isEditing = application !== null

  function handleSubmit(values) {
    if (isEditing) {
      updateApplication(application.id, values)
      toast.success('Changes saved')
    } else {
      addApplication(values)
      toast.success('Application added. Change its status anytime from the list.')
    }
    onClose()
  }

  async function handleDelete() {
    const wasDeleted = await deleteWithUndo(application)
    if (wasDeleted) onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? 'Edit application' : 'Add application'}
      description="Only company and role are required."
      onClose={onClose}
      footer={
        <>
          {isEditing && (
            <Button
              variant="ghost"
              className="application-form-modal__delete"
              leftIcon={<IconTrash size={16} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID}>
            {isEditing ? 'Save changes' : 'Add application'}
          </Button>
        </>
      }
    >
      <ApplicationForm id={FORM_ID} application={application} onSubmit={handleSubmit} />
    </Modal>
  )
}