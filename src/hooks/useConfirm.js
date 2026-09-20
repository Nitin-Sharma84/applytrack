import { useContext } from 'react'
import { ConfirmContext } from '../context/contexts.js'

/**
 * @returns {(options: { title: string, message: string, confirmLabel?: string,
 *   cancelLabel?: string, variant?: 'danger'|'primary' }) => Promise<boolean>}
 * Example: const ok = await confirm({ title: 'Delete?', message: '...', confirmLabel: 'Delete' })
 */
export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (!confirm) {
    throw new Error('useConfirm must be used inside <ConfirmProvider>.')
  }
  return confirm
}