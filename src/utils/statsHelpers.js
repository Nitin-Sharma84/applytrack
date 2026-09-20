import { ROUND_RESULT, UPCOMING_WINDOW_DAYS } from '../constants/options.js'
import { ACTIVE_STATUSES, STATUS, STATUSES } from '../constants/statuses.js'
import {
  getDaysSinceUpdate,
  getDaysToDeadline,
  isUrgent,
  needsFollowUp,
} from './applicationHelpers.js'
import { daysBetween, isWithinNextDays, parseDateOnly } from './dateHelpers.js'

/** @returns {number} whole percent, 0 when the total is 0 (no NaN on screen) */
export function toPercent(part, whole) {
  return whole === 0 ? 0 : Math.round((part / whole) * 100)
}

/** @returns {Record<string, number>} count per status, every status present (0 if none) */
export function getStatusCounts(applications) {
  const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]))
  for (const application of applications) counts[application.status] += 1
  return counts
}

/**
 * Numbers for the dashboard cards.
 * "Applied" means actually sent, so Wishlist items are left out of both rates.
 * "Responded" means any reply: online test, interview, offer or rejection.
 */
export function getOverviewStats(applications) {
  const counts = getStatusCounts(applications)
  const applied = applications.length - counts[STATUS.WISHLIST]
  const responded =
    counts[STATUS.ONLINE_TEST] + counts[STATUS.INTERVIEW] + counts[STATUS.OFFER] + counts[STATUS.REJECTED]

  return {
    total: applications.length,
    active: ACTIVE_STATUSES.reduce((sum, status) => sum + counts[status], 0),
    interviews: counts[STATUS.INTERVIEW],
    offers: counts[STATUS.OFFER],
    rejected: counts[STATUS.REJECTED],
    appliedCount: applied,
    responseRate: toPercent(responded, applied),
    offerRate: toPercent(counts[STATUS.OFFER], applied),
  }
}

/** Deadlines from today to the next 7 days, nearest first. Rejected ones are skipped. */
export function getUpcomingDeadlines(applications, today = new Date(), days = UPCOMING_WINDOW_DAYS) {
  return applications
    .filter((application) => application.status !== STATUS.REJECTED && isWithinNextDays(application.deadline, days, today))
    .sort((a, b) => getDaysToDeadline(a, today) - getDaysToDeadline(b, today))
}

/** Pending interview rounds in the next 7 days, soonest first. */
export function getUpcomingRounds(applications, today = new Date(), days = UPCOMING_WINDOW_DAYS) {
  const items = []
  for (const application of applications) {
    if (application.status === STATUS.REJECTED) continue
    for (const round of application.rounds) {
      if (round.result === ROUND_RESULT.PENDING && isWithinNextDays(round.date, days, today)) {
        items.push({ application, round, daysAway: daysBetween(today, parseDateOnly(round.date)) })
      }
    }
  }
  return items.sort((a, b) => a.daysAway - b.daysAway)
}

/** @returns {{ followUps: object[], urgent: object[] }} both lists, most pressing first */
export function getReminders(applications, followUpDays, today = new Date()) {
  const followUps = applications
    .filter((application) => needsFollowUp(application, followUpDays, today))
    .sort((a, b) => getDaysSinceUpdate(b, today) - getDaysSinceUpdate(a, today))
  const urgent = applications
    .filter((application) => isUrgent(application, today))
    .sort((a, b) => getDaysToDeadline(a, today) - getDaysToDeadline(b, today))
  return { followUps, urgent }
}