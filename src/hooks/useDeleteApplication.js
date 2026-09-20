import { useCallback } from 'react'
import { UNDO_TIMEOUT_MS } from '../constants/options.js'
import { useApplications } from './useApplications.js'
import { useConfirm } from './useConfirm.js'
import { useToast } from './useToast.js'

/**
 * Delete flow used by every screen: confirm dialog, delete, then a 5 second
 * Undo toast. Keeping it in one hook means the table, cards, board and drawer
 * all behave exactly the same.
 *
 * @returns {(application: object) => Promise<boolean>} resolves true if it was deleted
 */
export function useDeleteApplication() {
  const { deleteApplication, restoreApplication } = useApplications()
  const confirm = useConfirm()
  const toast = useToast()

  return useCallback(
    async (application) => {
      const isConfirmed = await confirm({
        title: 'Delete this application?',
        message: `${application.company} (${application.role}) will be removed. You can undo for a few seconds.`,
        confirmLabel: 'Delete',
      })
      if (!isConfirmed) return false

      deleteApplication(application.id)
      // The full object stays in this closure, so Undo can put it back exactly as it was.
      toast.info(`${application.company} deleted`, {
        duration: UNDO_TIMEOUT_MS,
        action: {
          label: 'Undo',
          onClick: () => {
            restoreApplication(application)
            toast.success('Application restored')
          },
        },
      })
      return true
    },
    [confirm, deleteApplication, restoreApplication, toast],
  )
}