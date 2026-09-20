import { daysBetween, toDate } from './dateHelpers.js'

// Fixed month names instead of Intl: the output is identical on every browser
// and locale ("20 Sep 2026"), and some ICU versions print "Sept" for September.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * @param {number} count
 * @param {string} singular
 * @param {string} [plural]
 * @returns {string} the correct word form for the count
 */
export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}

/** @param {unknown} value @returns {string} "20 Sep 2026", or "" if the value is not a date */
export function formatDate(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** @param {unknown} value @returns {string} "20 Sep", or "" if the value is not a date */
export function formatShortDate(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

/** @param {unknown} value @returns {string} "20 Sep 2026, 3:45 PM", or "" */
export function formatDateTime(value) {
  const date = toDate(value)
  if (!date) return ''
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  return `${formatDate(date)}, ${hours % 12 || 12}:${minutes} ${period}`
}

/**
 * "Today", "Yesterday", "3 days ago", "2 weeks ago", "5 months ago"...
 * @param {unknown} value
 * @param {Date} [now]
 * @returns {string}
 */
export function formatRelativeTime(value, now = new Date()) {
  const date = toDate(value)
  if (!date) return ''

  const days = daysBetween(date, now)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} ${pluralize(weeks, 'week')} ago`
  }
  if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months} ${pluralize(months, 'month')} ago`
  }
  const years = Math.floor(days / 365)
  return `${years} ${pluralize(years, 'year')} ago`
}

/**
 * Countdown text for the deadline badge.
 * @param {number|null} days from getDaysToDeadline()
 * @returns {string} "3 days left", "Due today", "Overdue by 2 days", or "" if no deadline
 */
export function formatDeadlineCountdown(days) {
  if (days === null || days === undefined) return ''
  if (days < 0) {
    const overdueDays = Math.abs(days)
    return `Overdue by ${overdueDays} ${pluralize(overdueDays, 'day')}`
  }
  if (days === 0) return 'Due today'
  return `${days} ${pluralize(days, 'day')} left`
}

/** @param {number|null} ctcLpa @returns {string} "₹12.5 LPA", or "" if there is no CTC */
export function formatCtc(ctcLpa) {
  if (typeof ctcLpa !== 'number' || !Number.isFinite(ctcLpa)) return ''
  // Number(toFixed(2)) drops useless zeros: 12.00 becomes 12, 12.50 becomes 12.5
  return `₹${Number(ctcLpa.toFixed(2))} LPA`
}