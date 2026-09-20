import { TOAST_TYPE } from '../../constants/toast.js'
import { Button } from './Button.jsx'
import { IconAlertCircle, IconCheckCircle, IconClose, IconInfo } from './Icons.jsx'
import './Toast.css'

const TOAST_ICONS = {
  [TOAST_TYPE.SUCCESS]: IconCheckCircle,
  [TOAST_TYPE.ERROR]: IconAlertCircle,
  [TOAST_TYPE.INFO]: IconInfo,
}

const TOAST_LABELS = {
  [TOAST_TYPE.SUCCESS]: 'Success',
  [TOAST_TYPE.ERROR]: 'Error',
  [TOAST_TYPE.INFO]: 'Notice',
}

/** One toast. Type is shown by icon + hidden text label, not by color alone. */
export function Toast({ toast, onAction, onDismiss }) {
  const TypeIcon = TOAST_ICONS[toast.type] ?? IconInfo

  return (
    <div className={`toast toast--${toast.type}`}>
      <TypeIcon className="toast__icon" size={20} />
      <p className="toast__message">
        <span className="sr-only">{TOAST_LABELS[toast.type] ?? 'Notice'}: </span>
        {toast.message}
      </p>
      {toast.action && (
        <Button variant="ghost" size="sm" onClick={() => onAction(toast)}>
          {toast.action.label}
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
      >
        <IconClose size={16} />
      </Button>
    </div>
  )
}