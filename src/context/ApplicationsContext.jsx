import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { APPLICATION_ACTIONS, applicationsReducer } from '../reducers/applicationsReducer.js'
import { loadApplications, sanitizeApplications, saveApplications } from '../services/storage.js'
import { createApplication } from '../utils/applicationHelpers.js'
import { useToast } from '../hooks/useToast.js'
import { ApplicationsContext } from './contexts.js'

export function ApplicationsProvider({ children }) {
  // Third argument is a lazy initializer: storage is read once on mount.
  const [applications, dispatch] = useReducer(applicationsReducer, null, loadApplications)
  const toast = useToast()

  // Persist after every change. Saving is a side effect, so it lives in useEffect.
  useEffect(() => {
    const isSaved = saveApplications(applications)
    if (!isSaved) {
      toast.error('Could not save your data. Browser storage may be full or blocked.')
    }
  }, [applications, toast])

  // dispatch never changes identity, so these callbacks are created once.
  // Impure work (id, clock) happens here, before dispatch, so the reducer stays pure.
  const addApplication = useCallback((values) => {
    const application = createApplication(values)
    dispatch({ type: APPLICATION_ACTIONS.ADD, application })
    return application
  }, [])

  const updateApplication = useCallback((id, values) => {
    dispatch({ type: APPLICATION_ACTIONS.UPDATE, id, values, timestamp: new Date().toISOString() })
  }, [])

  const changeStatus = useCallback((id, status) => {
    dispatch({
      type: APPLICATION_ACTIONS.CHANGE_STATUS,
      id,
      status,
      timestamp: new Date().toISOString(),
    })
  }, [])

  const deleteApplication = useCallback((id) => {
    dispatch({ type: APPLICATION_ACTIONS.DELETE, id })
  }, [])

  /** Used by Undo. Pass the full application object that was deleted. */
  const restoreApplication = useCallback((application) => {
    dispatch({ type: APPLICATION_ACTIONS.RESTORE, application })
  }, [])

  const replaceAllApplications = useCallback((list) => {
    dispatch({ type: APPLICATION_ACTIONS.REPLACE_ALL, applications: sanitizeApplications(list) })
  }, [])

  const clearApplications = useCallback(() => {
    dispatch({ type: APPLICATION_ACTIONS.CLEAR_ALL })
  }, [])

  // Memoized: without it a new object is created on every render and every
  // consumer re-renders even when nothing changed.
  const value = useMemo(
    () => ({
      applications,
      addApplication,
      updateApplication,
      changeStatus,
      deleteApplication,
      restoreApplication,
      replaceAllApplications,
      clearApplications,
    }),
    [
      applications,
      addApplication,
      updateApplication,
      changeStatus,
      deleteApplication,
      restoreApplication,
      replaceAllApplications,
      clearApplications,
    ],
  )

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>
}