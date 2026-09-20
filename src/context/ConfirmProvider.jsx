import { useCallback, useRef, useState } from 'react'
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx'
import { ConfirmContext } from './contexts.js'

/**
 * Makes a promise-based confirm() available everywhere, so any component can
 * write `if (await confirm({...})) { ... }` without owning dialog state.
 * The dialog itself renders once, here, through the Modal portal.
 */
export function ConfirmProvider({ children }) {
  const [options, setOptions] = useState(null)
  // The pending promise's resolve function. A ref, because it is not UI state.
  const resolveRef = useRef(null)

  const settle = useCallback((result) => {
    resolveRef.current?.(result)
    resolveRef.current = null
    setOptions(null)
  }, [])

  const confirm = useCallback((requestOptions) => {
    resolveRef.current?.(false) // a new request replaces an unanswered one
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setOptions(requestOptions)
    })
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        isOpen={options !== null}
        title={options?.title ?? ''}
        message={options?.message ?? ''}
        confirmLabel={options?.confirmLabel}
        cancelLabel={options?.cancelLabel}
        variant={options?.variant}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ConfirmContext.Provider>
  )
}