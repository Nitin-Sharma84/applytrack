import {
  changeApplicationStatus,
  updateApplicationFromValues,
} from '../utils/applicationHelpers.js'

export const APPLICATION_ACTIONS = Object.freeze({
  ADD: 'applications/add',
  UPDATE: 'applications/update',
  CHANGE_STATUS: 'applications/changeStatus',
  DELETE: 'applications/delete',
  RESTORE: 'applications/restore',
  REPLACE_ALL: 'applications/replaceAll',
  CLEAR_ALL: 'applications/clearAll',
  ADD_ROUND: 'applications/addRound',
  UPDATE_ROUND: 'applications/updateRound',
  DELETE_ROUND: 'applications/deleteRound',
  ADD_CHECKLIST_ITEM: 'applications/addChecklistItem',
  TOGGLE_CHECKLIST_ITEM: 'applications/toggleChecklistItem',
  DELETE_CHECKLIST_ITEM: 'applications/deleteChecklistItem',
  SET_NOTES: 'applications/setNotes',
})

/**
 * Applies `change` to the application with this id, without mutating anything.
 * Returns the SAME array when nothing changed, so React can skip a re-render.
 */
function updateById(state, id, change) {
  let hasChanged = false
  const nextState = state.map((application) => {
    if (application.id !== id) return application
    const updated = change(application)
    if (updated !== application) hasChanged = true
    return updated
  })
  return hasChanged ? nextState : state
}

/**
 * Pure reducer: same state + same action always gives the same result.
 * It never mutates state, never reads the clock and never generates ids.
 * Everything impure (new id, current time) is done BEFORE dispatch and
 * travels inside the action (application, round, item, timestamp).
 *
 * Only round changes refresh updatedAt (real progress). Checklist and notes
 * changes do not, so preparing for an interview does not reset the follow-up timer.
 *
 * @param {object[]} state array of applications, newest first
 * @param {{ type: string } & Record<string, *>} action
 * @returns {object[]}
 */
export function applicationsReducer(state, action) {
  switch (action.type) {
    case APPLICATION_ACTIONS.ADD:
      return [action.application, ...state]

    case APPLICATION_ACTIONS.UPDATE:
      return updateById(state, action.id, (application) =>
        updateApplicationFromValues(application, action.values, new Date(action.timestamp)),
      )

    case APPLICATION_ACTIONS.CHANGE_STATUS:
      return updateById(state, action.id, (application) =>
        changeApplicationStatus(application, action.status, new Date(action.timestamp)),
      )

    case APPLICATION_ACTIONS.DELETE: {
      const nextState = state.filter((application) => application.id !== action.id)
      return nextState.length === state.length ? state : nextState
    }

    case APPLICATION_ACTIONS.RESTORE: {
      // Undo can be clicked twice. Never create a duplicate.
      const alreadyExists = state.some((application) => application.id === action.application.id)
      return alreadyExists ? state : [action.application, ...state]
    }

    case APPLICATION_ACTIONS.REPLACE_ALL:
      return action.applications

    case APPLICATION_ACTIONS.CLEAR_ALL:
      return []

    case APPLICATION_ACTIONS.ADD_ROUND:
      return updateById(state, action.id, (application) => ({
        ...application,
        rounds: [...application.rounds, action.round],
        updatedAt: action.timestamp,
      }))

    case APPLICATION_ACTIONS.UPDATE_ROUND:
      return updateById(state, action.id, (application) => ({
        ...application,
        rounds: application.rounds.map((round) =>
          round.id === action.roundId ? { ...round, ...action.changes } : round,
        ),
        updatedAt: action.timestamp,
      }))

    case APPLICATION_ACTIONS.DELETE_ROUND:
      return updateById(state, action.id, (application) => ({
        ...application,
        rounds: application.rounds.filter((round) => round.id !== action.roundId),
        updatedAt: action.timestamp,
      }))

    case APPLICATION_ACTIONS.ADD_CHECKLIST_ITEM:
      return updateById(state, action.id, (application) => ({
        ...application,
        prepChecklist: [...application.prepChecklist, action.item],
      }))

    case APPLICATION_ACTIONS.TOGGLE_CHECKLIST_ITEM:
      return updateById(state, action.id, (application) => ({
        ...application,
        prepChecklist: application.prepChecklist.map((item) =>
          item.id === action.itemId ? { ...item, done: !item.done } : item,
        ),
      }))

    case APPLICATION_ACTIONS.DELETE_CHECKLIST_ITEM:
      return updateById(state, action.id, (application) => ({
        ...application,
        prepChecklist: application.prepChecklist.filter((item) => item.id !== action.itemId),
      }))

    case APPLICATION_ACTIONS.SET_NOTES:
      return updateById(state, action.id, (application) => ({
        ...application,
        notes: action.notes,
      }))

    default:
      // A typo in an action type should fail loudly during development.
      throw new Error(`Unknown applications action: ${action.type}`)
  }
}