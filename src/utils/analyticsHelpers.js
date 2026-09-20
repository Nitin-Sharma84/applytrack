import { SOURCES } from '../constants/options.js'
import { STATUS, STATUSES } from '../constants/statuses.js'
import { needsFollowUp } from './applicationHelpers.js'
import { addDays, daysBetween, getStartOfWeek, parseDateOnly } from './dateHelpers.js'
import { formatShortDate, pluralize } from './formatters.js'
import { getStatusCounts, toPercent } from './statsHelpers.js'

/** The stages a successful application moves through, in order. */
export const FUNNEL_STAGES = [STATUS.APPLIED, STATUS.ONLINE_TEST, STATUS.INTERVIEW, STATUS.OFFER]

const INTERVIEW_STAGE = FUNNEL_STAGES.indexOf(STATUS.INTERVIEW) + 1
const OFFER_STAGE = FUNNEL_STAGES.indexOf(STATUS.OFFER) + 1

/** 0 = Wishlist, 1 = Applied ... 4 = Offer. Rejected counts as 1: you must have applied to be rejected. */
function stageOf(status) {
  if (status === STATUS.REJECTED) return 1
  return FUNNEL_STAGES.indexOf(status) + 1
}

/**
 * How far an application ever got, from its status history. Using the furthest
 * stage (not just the current status) keeps the funnel correct when an
 * application was rejected after an interview, or when a stage was skipped.
 */
export function getReachedStage(application) {
  return application.statusHistory.reduce(
    (furthest, entry) => Math.max(furthest, stageOf(entry.status)),
    stageOf(application.status),
  )
}

/**
 * @returns {{ status: string, count: number, conversion: number|null }[]}
 * count = applications that reached this stage. conversion = % of the previous stage that moved on.
 */
export function getFunnel(applications) {
  const reached = applications.map(getReachedStage)

  return FUNNEL_STAGES.map((status, index) => ({
    status,
    count: reached.filter((stage) => stage >= index + 1).length,
  })).map((stage, index, stages) => ({
    ...stage,
    conversion: index === 0 ? null : toPercent(stage.count, stages[index - 1].count),
  }))
}

/**
 * Applications sent per week (Monday to Sunday) for the last `weeks` weeks.
 * @returns {{ label: string, count: number }[]} oldest first, the last one is the current week
 */
export function getWeeklyCounts(applications, today = new Date(), weeks = 8) {
  const currentWeekStart = getStartOfWeek(today)
  const buckets = Array.from({ length: weeks }, (_, index) => {
    const start = addDays(currentWeekStart, -7 * (weeks - 1 - index))
    return { label: formatShortDate(start), count: 0 }
  })

  for (const application of applications) {
    const applied = parseDateOnly(application.appliedDate)
    if (!applied) continue
    const weeksAgo = Math.floor(daysBetween(getStartOfWeek(applied), currentWeekStart) / 7)
    if (weeksAgo >= 0 && weeksAgo < weeks) buckets[weeks - 1 - weeksAgo].count += 1
  }
  return buckets
}

/** @returns {{ status: string, count: number }[]} only statuses that have at least one application */
export function getStatusDistribution(applications) {
  const counts = getStatusCounts(applications)
  return STATUSES.map((status) => ({ status, count: counts[status] })).filter((item) => item.count > 0)
}

/**
 * One row per source that has at least one sent application (Wishlist items are not "sent").
 * interviewRate = interviews / applied.
 */
export function getSourceStats(applications) {
  return SOURCES.map((source) => {
    const sent = applications.filter(
      (application) => application.source === source && application.status !== STATUS.WISHLIST,
    )
    const interviews = sent.filter((application) => getReachedStage(application) >= INTERVIEW_STAGE).length
    const offers = sent.filter((application) => getReachedStage(application) >= OFFER_STAGE).length
    return {
      source,
      applied: sent.length,
      interviews,
      offers,
      interviewRate: toPercent(interviews, sent.length),
    }
  })
    .filter((row) => row.applied > 0)
    .sort((a, b) => b.applied - a.applied)
}

/** Plain-English sentences generated from the data. @returns {string[]} */
export function getInsights(applications, followUpDays, today = new Date()) {
  const insights = []

  // 1. Best source. Needs at least 2 applications, so one lucky application does not decide.
  const sources = getSourceStats(applications).filter((row) => row.applied >= 2 && row.interviews > 0)
  if (sources.length > 0) {
    const best = [...sources].sort(
      (a, b) => b.interviewRate - a.interviewRate || b.applied - a.applied,
    )[0]
    insights.push(
      `${best.source} has your best interview rate: ${best.interviewRate}% (${best.interviews} of ${best.applied}).`,
    )
  }

  // 2. Follow-ups waiting.
  const followUps = applications.filter((application) =>
    needsFollowUp(application, followUpDays, today),
  ).length
  if (followUps > 0) {
    insights.push(
      `${followUps} ${pluralize(followUps, 'application')} ${pluralize(followUps, 'has', 'have')} no update for ${followUpDays}+ days.`,
    )
  }

  // 3. Where most applications stop. Needs at least 3 in a stage to be meaningful.
  const funnel = getFunnel(applications)
  const steps = funnel
    .slice(1)
    .map((stage, index) => ({ from: funnel[index], to: stage }))
    .filter((step) => step.from.count >= 3)
  if (steps.length > 0) {
    const worst = steps.reduce((a, b) => (b.to.conversion < a.to.conversion ? b : a))
    if (worst.to.conversion < 100) {
      insights.push(
        `Most applications stop between ${worst.from.status} and ${worst.to.status} (${worst.to.conversion}% move on).`,
      )
    }
  }

  // 4. This week versus last week.
  const weeks = getWeeklyCounts(applications, today)
  const thisWeek = weeks[weeks.length - 1].count
  const lastWeek = weeks[weeks.length - 2].count
  insights.push(
    `You sent ${thisWeek} ${pluralize(thisWeek, 'application')} this week and ${lastWeek} last week.`,
  )

  return insights
}