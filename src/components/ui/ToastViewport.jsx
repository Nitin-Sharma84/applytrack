import { createPortal } from 'react-dom'
import { useToast, useToastList } from '../../hooks/useToast.js'
import { Toast } from './Toast.jsx'

/**
 * Renders all toasts through a portal. The aria-live region is always in the
 * DOM (even when empty), because screen readers only announce changes inside
 * a live region that already existed.
 */
export function ToastViewport() {
  const toasts = useToastList()
  const { dismissToast } = useToast()

  function handleAction(toast) {
    toast.action.onClick()
    dismissToast(toast.id)
  }

  return createPortal(
    <div className="toast-viewport" aria-live="polite" aria-relevant="additions text">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onAction={handleAction} onDismiss={dismissToast} />
      ))}
    </div>,
    document.body,
  )
}