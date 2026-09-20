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
})

/**
 * Pure reducer: same state + same action always gives the same result.
 * It never mutates state, never reads the clock and never generates ids.
 * Everything impure (new id, current time) is done BEFORE dispatch and
 * travels inside the action (application, timestamp).
 *
 * State shape: array of application objects, newest first.
 *
 * @param {object[]} state
 * @param {{ type: string } & Record<string, *>} action
 * @returns {object[]}
 */
export function applicationsReducer(state, action) {
  switch (action.type) {
    case APPLICATION_ACTIONS.ADD:
      return [action.application, ...state]

    case APPLICATION_ACTIONS.UPDATE: {
      const now = new Date(action.timestamp)
      return state.map((application) =>
        application.id === action.id
          ? updateApplicationFromValues(application, action.values, now)
          : application,
      )
    }

    case APPLICATION_ACTIONS.CHANGE_STATUS: {
      const now = new Date(action.timestamp)
      let hasChanged = false

      const nextState = state.map((application) => {
        if (application.id !== action.id) return application
        const updated = changeApplicationStatus(application, action.status, now)
        if (updated !== application) hasChanged = true
        return updated
      })

      // Same array back means React skips the re-render when nothing changed.
      return hasChanged ? nextState : state
    }

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

    default:
      // A typo in an action type should fail loudly during development.
      throw new Error(`Unknown applications action: ${action.type}`)
  }
}