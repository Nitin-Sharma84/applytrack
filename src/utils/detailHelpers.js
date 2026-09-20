import { ROUND_MODE, ROUND_RESULT, ROUND_TYPE } from '../constants/options.js'
import { generateId } from './applicationHelpers.js'
import { toPercent } from './statsHelpers.js'

/** @returns {{ type: string, date: string, mode: string, result: string, notes: string }} */
export function createEmptyRoundValues() {
  return {
    type: ROUND_TYPE.TECHNICAL,
    date: '',
    mode: ROUND_MODE.ONLINE,
    result: ROUND_RESULT.PENDING,
    notes: '',
  }
}

/** Picks and trims the editable round fields (used for both new and edited rounds). */
export function cleanRoundFields(values) {
  return {
    type: values.type,
    date: values.date,
    mode: values.mode,
    result: values.result,
    notes: values.notes.trim(),
  }
}

/** Not pure (random id), so it is called before dispatch, never inside the reducer. */
export function createRound(values) {
  return { id: generateId(), ...cleanRoundFields(values) }
}

export function createChecklistItem(text) {
  return { id: generateId(), text: text.trim(), done: false }
}

/** Dated rounds first (earliest first), rounds without a date last. */
export function sortRounds(rounds) {
  return [...rounds].sort((a, b) => {
    if (a.date === b.date) return 0
    if (a.date === '') return 1
    if (b.date === '') return -1
    return a.date < b.date ? -1 : 1 // "YYYY-MM-DD" text sorts correctly as text
  })
}

/** @returns {{ done: number, total: number, percent: number }} */
export function getChecklistProgress(items) {
  const done = items.filter((item) => item.done).length
  return { done, total: items.length, percent: toPercent(done, items.length) }
}