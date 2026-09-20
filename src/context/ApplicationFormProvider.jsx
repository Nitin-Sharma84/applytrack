import { useCallback, useMemo, useState } from 'react'
import { ApplicationFormModal } from '../components/applications/ApplicationFormModal.jsx'
import { ApplicationFormContext } from './contexts.js'

/**
 * Owns only "is the form open, and for which application". The form VALUES
 * stay inside ApplicationForm (local state), because nobody else needs them.
 */
export function ApplicationFormProvider({ children }) {
  // null = closed, { application: null } = adding, { application } = editing
  const [target, setTarget] = useState(null)

  const openNewApplication = useCallback(() => setTarget({ application: null }), [])
  const openEditApplication = useCallback((application) => setTarget({ application }), [])
  const closeForm = useCallback(() => setTarget(null), [])

  const value = useMemo(
    () => ({ openNewApplication, openEditApplication }),
    [openNewApplication, openEditApplication],
  )

  return (
    <ApplicationFormContext.Provider value={value}>
      {children}
      <ApplicationFormModal
        isOpen={target !== null}
        application={target?.application ?? null}
        onClose={closeForm}
      />
    </ApplicationFormContext.Provider>
  )
}