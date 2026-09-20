import { useContext } from 'react'
import { ToastContext, ToastListContext } from '../context/contexts.js'

/**
 * Stable toast actions: showToast, dismissToast, success, error, info.
 * Example: toast.success('Saved'), toast.info('Deleted', { action: { label: 'Undo', onClick } })
 */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>.')
  }
  return context
}

/** The current toasts. Only the toast viewport (Phase 3) needs this. */
export function useToastList() {
  return useContext(ToastListContext)
}