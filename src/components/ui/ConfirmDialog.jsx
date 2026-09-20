import { Button } from './Button.jsx'
import { Modal } from './Modal.jsx'

/**
 * Yes/No dialog built on Modal. Cancel gets the initial focus, so pressing
 * Enter by accident never confirms a destructive action.
 * Usually opened through useConfirm(), not used directly.
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} data-autofocus>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="modal__text">{message}</p>
    </Modal>
  )
}