import { STATUS } from '../constants/statuses.js'
import { needsFollowUp } from './applicationHelpers.js'
import { addDays, getStartOfWeek, parseDateOnly, toDate } from './dateHelpers.js'
import { formatDate } from './formatters.js'

function isInWeek(date, weekStart) {
  return date !== null && date >= weekStart && date < addDays(weekStart, 7)
}

/**
 * Numbers for the current week (Monday to Sunday).
 * "Moved to interview" and "offers" come from statusHistory dates, so they
 * count what happened THIS week, not what the current status is.
 */
export function getWeekSummary(applications, followUpDays, today = new Date()) {
  const weekStart = getStartOfWeek(today)
  const reachedThisWeek = (application, status) =>
    application.statusHistory.some(
      (entry) => entry.status === status && isInWeek(toDate(entry.date), weekStart),
    )

  return {
    weekStart,
    weekEnd: addDays(weekStart, 6),
    sent: applications.filter((application) =>
      isInWeek(parseDateOnly(application.appliedDate), weekStart),
    ).length,
    interviews: applications.filter((application) => reachedThisWeek(application, STATUS.INTERVIEW)).length,
    offers: applications.filter((application) => reachedThisWeek(application, STATUS.OFFER)).length,
    followUps: applications.filter((application) => needsFollowUp(application, followUpDays, today)).length,
  }
}

/** @returns {string} plain text, ready to paste into a message or email */
export function buildWeeklyReport(summary) {
  return [
    `ApplyTrack weekly report (${formatDate(summary.weekStart)} to ${formatDate(summary.weekEnd)})`,
    `- Applications sent: ${summary.sent}`,
    `- Moved to interview: ${summary.interviews}`,
    `- Offers received: ${summary.offers}`,
    `- Follow-ups pending: ${summary.followUps}`,
  ].join('\n')
}