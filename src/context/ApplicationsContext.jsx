import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { APPLICATION_ACTIONS, applicationsReducer } from '../reducers/applicationsReducer.js'
import { loadApplications, sanitizeApplications, saveApplications } from '../services/storage.js'
import { createApplication } from '../utils/applicationHelpers.js'
import { cleanRoundFields, createChecklistItem, createRound } from '../utils/detailHelpers.js'
import { useToast } from '../hooks/useToast.js'
import { ApplicationsContext } from './contexts.js'

const now = () => new Date().toISOString()

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
    dispatch({ type: APPLICATION_ACTIONS.UPDATE, id, values, timestamp: now() })
  }, [])

  const changeStatus = useCallback((id, status) => {
    dispatch({ type: APPLICATION_ACTIONS.CHANGE_STATUS, id, status, timestamp: now() })
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

  /* ---------- Details drawer: rounds, checklist, notes ---------- */
  const addRound = useCallback((id, values) => {
    dispatch({ type: APPLICATION_ACTIONS.ADD_ROUND, id, round: createRound(values), timestamp: now() })
  }, [])

  const updateRound = useCallback((id, roundId, values) => {
    dispatch({
      type: APPLICATION_ACTIONS.UPDATE_ROUND,
      id,
      roundId,
      changes: cleanRoundFields(values),
      timestamp: now(),
    })
  }, [])

  const deleteRound = useCallback((id, roundId) => {
    dispatch({ type: APPLICATION_ACTIONS.DELETE_ROUND, id, roundId, timestamp: now() })
  }, [])

  const addChecklistItem = useCallback((id, text) => {
    dispatch({ type: APPLICATION_ACTIONS.ADD_CHECKLIST_ITEM, id, item: createChecklistItem(text) })
  }, [])

  const toggleChecklistItem = useCallback((id, itemId) => {
    dispatch({ type: APPLICATION_ACTIONS.TOGGLE_CHECKLIST_ITEM, id, itemId })
  }, [])

  const deleteChecklistItem = useCallback((id, itemId) => {
    dispatch({ type: APPLICATION_ACTIONS.DELETE_CHECKLIST_ITEM, id, itemId })
  }, [])

  const setNotes = useCallback((id, notes) => {
    dispatch({ type: APPLICATION_ACTIONS.SET_NOTES, id, notes: notes.trim() })
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
      addRound,
      updateRound,
      deleteRound,
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
      setNotes,
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
      addRound,
      updateRound,
      deleteRound,
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
      setNotes,
    ],
  )

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>
}