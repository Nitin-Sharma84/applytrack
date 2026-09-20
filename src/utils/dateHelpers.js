/**
 * Date utilities.
 *
 * WHY manual parsing: new Date('2026-09-20') treats a date-only string as UTC
 * midnight. In timezones behind UTC that shows the PREVIOUS day. Our date
 * inputs (appliedDate, deadline, round date) are date-only, so we parse them
 * as LOCAL dates instead. Full timestamps (createdAt, updatedAt) are normal
 * ISO strings and are parsed by the Date constructor.
 *
 * Every function that needs "now" takes it as a parameter (default: new Date())
 * so the logic stays predictable and easy to test with a fixed date.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function pad2(number) {
  return String(number).padStart(2, '0')
}

/**
 * Parses "YYYY-MM-DD" as a local date at midnight.
 * @param {unknown} value
 * @returns {Date|null} null for anything invalid, including 2026-02-31
 */
export function parseDateOnly(value) {
  if (typeof value !== 'string') return null
  const match = DATE_ONLY_PATTERN.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  // The Date constructor rolls over invalid days (Feb 31 becomes Mar 3), so verify.
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  return isRealDate ? date : null
}

/**
 * Accepts a Date, a "YYYY-MM-DD" string or a full ISO timestamp.
 * @param {unknown} value
 * @returns {Date|null}
 */
export function toDate(value) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value !== 'string' || value === '') return null

  const dateOnly = parseDateOnly(value)
  if (dateOnly) return dateOnly

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/** @param {Date} date @returns {Date} same day at 00:00 local time */
export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** @param {Date} date @param {number} amount days to add (can be negative) @returns {Date} */
export function addDays(date, amount) {
  const result = new Date(date)
  // setDate handles month ends and DST correctly (adding 24h of milliseconds would not).
  result.setDate(result.getDate() + amount)
  return result
}

/**
 * Whole calendar days from one date to another (negative if "to" is earlier).
 * Time of day is ignored, so 11:59 PM to 12:01 AM counts as 1 day.
 * @param {Date} from
 * @param {Date} to
 * @returns {number}
 */
export function daysBetween(from, to) {
  // Math.round absorbs the 23 or 25 hour days that appear around DST changes.
  return Math.round((startOfDay(to) - startOfDay(from)) / MS_PER_DAY)
}

/**
 * Formats a Date as "YYYY-MM-DD" using LOCAL time, ready for <input type="date">.
 * (toISOString() would give the UTC date, which can be off by one day.)
 * @param {Date} [date]
 * @returns {string}
 */
export function toDateInputValue(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/**
 * Monday 00:00 of the week that contains the given date (weeks run Monday to Sunday).
 * @param {Date} [date]
 * @returns {Date}
 */
export function getStartOfWeek(date = new Date()) {
  const start = startOfDay(date)
  const daysSinceMonday = (start.getDay() + 6) % 7 // getDay(): Sunday is 0
  return addDays(start, -daysSinceMonday)
}

/**
 * True if the date is today or within the next `days` days (both ends included).
 * @param {unknown} value
 * @param {number} days
 * @param {Date} [today]
 * @returns {boolean}
 */
export function isWithinNextDays(value, days, today = new Date()) {
  const date = toDate(value)
  if (!date) return false
  const difference = daysBetween(today, date)
  return difference >= 0 && difference <= days
}