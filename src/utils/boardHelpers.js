import { SORT_BY } from '../constants/options.js'
import { STATUSES } from '../constants/statuses.js'
import { sortApplications } from './filterHelpers.js'

/**
 * Splits applications into one list per status (every status is present, even if empty).
 * Inside each column the nearest deadline comes first.
 * @param {object[]} applications
 * @param {Date} [today]
 * @returns {Record<string, object[]>}
 */
export function groupByStatus(applications, today = new Date()) {
  const groups = Object.fromEntries(STATUSES.map((status) => [status, []]))
  for (const application of applications) groups[application.status].push(application)
  for (const status of STATUSES) {
    groups[status] = sortApplications(groups[status], SORT_BY.DEADLINE, today)
  }
  return groups
}