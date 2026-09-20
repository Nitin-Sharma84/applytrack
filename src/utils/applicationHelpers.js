import { FOLLOW_UP_STATUSES, STATUS, STATUSES } from '../constants/statuses.js'
import {
  DEFAULT_SETTINGS,
  JOB_TYPE,
  JOB_TYPES,
  PRIORITIES,
  PRIORITY,
  ROUND_MODE,
  ROUND_MODES,
  ROUND_RESULT,
  ROUND_RESULTS,
  ROUND_TYPE,
  ROUND_TYPES,
  SOURCE,
  SOURCES,
  TAG_MAX_LENGTH,
  URGENT_DEADLINE_DAYS,
  WORK_MODE,
  WORK_MODES,
} from '../constants/options.js'
import { daysBetween, parseDateOnly, startOfDay, toDate, toDateInputValue } from './dateHelpers.js'
import { isPlainObject, isValidEmail, isValidUrl } from './validators.js'

/* ==========================================================================
   Small internal helpers
   ========================================================================== */

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '')
const cleanDate = (value) => (parseDateOnly(value) ? value : '')
const pickOption = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback)
const validTimestampOr = (value, fallback) =>
  typeof value === 'string' && toDate(value) ? value : fallback

/** Optional number: "" / null / invalid becomes null, otherwise a number >= 0. */
function toNumberOrNull(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  if (typeof value === 'string' && value.trim() === '') return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

/**
 * Unique id. crypto.randomUUID() exists only in secure contexts (https or localhost).
 * Opening the dev server on a phone via a LAN IP (http://192.168...) is NOT secure,
 * so we keep a fallback to avoid a crash.
 * @returns {string}
 */
export function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * "React, react,  Remote " becomes ["react", "remote"] (trimmed, lowercase, unique).
 * @param {string|string[]} input comma separated text or an array
 * @returns {string[]}
 */
export function parseTags(input) {
  const parts = Array.isArray(input) ? input : String(input ?? '').split(',')
  const seen = new Set()
  const tags = []

  for (const part of parts) {
    const tag = String(part).trim().replace(/\s+/g, ' ').toLowerCase().slice(0, TAG_MAX_LENGTH)
    if (tag && !seen.has(tag)) {
      seen.add(tag)
      tags.push(tag)
    }
  }
  return tags
}

/* ==========================================================================
   Form values <-> application object
   Form inputs work with strings. The stored object has real types.
   Text and date fields use "" when empty. ctcLpa uses null when empty.
   ========================================================================== */

/**
 * @param {Date} [today]
 * @returns {Record<string, string>} initial values for the "New application" form
 */
export function createEmptyFormValues(today = new Date()) {
  return {
    company: '',
    role: '',
    jobType: JOB_TYPE.FULL_TIME,
    workMode: WORK_MODE.ON_SITE,
    location: '',
    source: SOURCE.CAMPUS,
    status: STATUS.APPLIED,
    priority: PRIORITY.MEDIUM,
    appliedDate: toDateInputValue(today),
    deadline: '',
    ctcLpa: '',
    jobLink: '',
    contactName: '',
    contactEmail: '',
    resumeVersion: '',
    notes: '',
    tags: '',
  }
}

/**
 * @param {object} application
 * @returns {Record<string, string>} values to pre-fill the "Edit application" form
 */
export function applicationToFormValues(application) {
  return {
    company: application.company,
    role: application.role,
    jobType: application.jobType,
    workMode: application.workMode,
    location: application.location,
    source: application.source,
    status: application.status,
    priority: application.priority,
    appliedDate: application.appliedDate,
    deadline: application.deadline,
    ctcLpa: application.ctcLpa === null ? '' : String(application.ctcLpa),
    jobLink: application.jobLink,
    contactName: application.contactName,
    contactEmail: application.contactEmail,
    resumeVersion: application.resumeVersion,
    notes: application.notes,
    tags: application.tags.join(', '),
  }
}

/** Converts validated form strings into the typed, editable fields of an application. */
function formValuesToFields(values) {
  return {
    company: cleanText(values.company),
    role: cleanText(values.role),
    jobType: values.jobType,
    workMode: values.workMode,
    location: cleanText(values.location),
    source: values.source,
    status: values.status,
    priority: values.priority,
    appliedDate: cleanText(values.appliedDate),
    deadline: cleanText(values.deadline),
    ctcLpa: toNumberOrNull(values.ctcLpa),
    jobLink: cleanText(values.jobLink),
    contactName: cleanText(values.contactName),
    contactEmail: cleanText(values.contactEmail),
    resumeVersion: cleanText(values.resumeVersion),
    notes: cleanText(values.notes),
    tags: parseTags(values.tags),
  }
}

/**
 * Builds a brand new application. NOT pure (random id, current time), so it is
 * called by the context or form, and the reducer only receives the finished object.
 * @param {Record<string, string>} values validated form values
 * @param {Date} [now]
 * @returns {object}
 */
export function createApplication(values, now = new Date()) {
  const timestamp = now.toISOString()
  const fields = formValuesToFields(values)

  return {
    id: generateId(),
    ...fields,
    rounds: [],
    prepChecklist: [],
    statusHistory: [{ status: fields.status, date: timestamp }],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

/**
 * Applies edited form values to an existing application (immutably).
 * If the status changed, a statusHistory entry is added automatically.
 * @param {object} existing
 * @param {Record<string, string>} values
 * @param {Date} [now]
 * @returns {object}
 */
export function updateApplicationFromValues(existing, values, now = new Date()) {
  const timestamp = now.toISOString()
  const fields = formValuesToFields(values)
  const statusChanged = fields.status !== existing.status

  return {
    ...existing,
    ...fields,
    statusHistory: statusChanged
      ? [...existing.statusHistory, { status: fields.status, date: timestamp }]
      : existing.statusHistory,
    updatedAt: timestamp,
  }
}

/**
 * Moves an application to another status and records it in statusHistory.
 * Returns the SAME object when the status is unchanged, so callers can skip a re-render.
 * @param {object} application
 * @param {string} status
 * @param {Date} [now]
 * @returns {object}
 */
export function changeApplicationStatus(application, status, now = new Date()) {
  if (application.status === status) return application

  const timestamp = now.toISOString()
  return {
    ...application,
    status,
    statusHistory: [...application.statusHistory, { status, date: timestamp }],
    updatedAt: timestamp,
  }
}

/* ==========================================================================
   Repairing stored or imported data
   ========================================================================== */

function normalizeRound(raw) {
  return {
    id: typeof raw.id === 'string' && raw.id !== '' ? raw.id : generateId(),
    type: pickOption(raw.type, ROUND_TYPES, ROUND_TYPE.TECHNICAL),
    date: cleanDate(raw.date),
    mode: pickOption(raw.mode, ROUND_MODES, ROUND_MODE.ONLINE),
    notes: cleanText(raw.notes),
    result: pickOption(raw.result, ROUND_RESULTS, ROUND_RESULT.PENDING),
  }
}

function normalizeChecklistItem(raw) {
  return {
    id: typeof raw.id === 'string' && raw.id !== '' ? raw.id : generateId(),
    text: cleanText(raw.text),
    done: raw.done === true,
  }
}

/**
 * Fills missing fields with safe defaults so old, imported or hand-edited data
 * cannot crash the UI. Call it only for records that passed isApplicationRecord().
 * @param {object} raw
 * @returns {object}
 */
export function normalizeApplication(raw) {
  const createdAt = validTimestampOr(
    raw.createdAt,
    validTimestampOr(raw.updatedAt, new Date().toISOString()),
  )

  const history = Array.isArray(raw.statusHistory)
    ? raw.statusHistory
        .filter((entry) => isPlainObject(entry) && STATUSES.includes(entry.status) && toDate(entry.date))
        .map((entry) => ({ status: entry.status, date: entry.date }))
    : []

  return {
    id: raw.id,
    company: cleanText(raw.company),
    role: cleanText(raw.role),
    jobType: pickOption(raw.jobType, JOB_TYPES, JOB_TYPE.FULL_TIME),
    workMode: pickOption(raw.workMode, WORK_MODES, WORK_MODE.ON_SITE),
    location: cleanText(raw.location),
    source: pickOption(raw.source, SOURCES, SOURCE.OTHER),
    status: raw.status,
    priority: pickOption(raw.priority, PRIORITIES, PRIORITY.MEDIUM),
    appliedDate: cleanDate(raw.appliedDate),
    deadline: cleanDate(raw.deadline),
    ctcLpa: toNumberOrNull(raw.ctcLpa),
    jobLink: isValidUrl(cleanText(raw.jobLink)) ? cleanText(raw.jobLink) : '',
    contactName: cleanText(raw.contactName),
    contactEmail: isValidEmail(cleanText(raw.contactEmail)) ? cleanText(raw.contactEmail) : '',
    resumeVersion: cleanText(raw.resumeVersion),
    notes: cleanText(raw.notes),
    tags: parseTags(raw.tags),
    rounds: Array.isArray(raw.rounds) ? raw.rounds.filter(isPlainObject).map(normalizeRound) : [],
    prepChecklist: Array.isArray(raw.prepChecklist)
      ? raw.prepChecklist.filter(isPlainObject).map(normalizeChecklistItem)
      : [],
    statusHistory: history.length > 0 ? history : [{ status: raw.status, date: createdAt }],
    createdAt,
    updatedAt: validTimestampOr(raw.updatedAt, createdAt),
  }
}

/* ==========================================================================
   Derived values. Calculated on demand and NEVER stored, so they cannot go stale.
   ========================================================================== */

/**
 * @param {{ deadline: string }} application
 * @param {Date} [today]
 * @returns {number|null} days until the deadline (negative if passed), null if no deadline
 */
export function getDaysToDeadline(application, today = new Date()) {
  const deadline = parseDateOnly(application.deadline)
  return deadline ? daysBetween(today, deadline) : null
}

/**
 * Whole days since the application was last updated.
 * @param {{ updatedAt: string }} application
 * @param {Date} [today]
 * @returns {number}
 */
export function getDaysSinceUpdate(application, today = new Date()) {
  const updatedAt = toDate(application.updatedAt)
  return updatedAt ? daysBetween(updatedAt, today) : 0
}

/** Deadline is today or within the next 3 days (and the application is not rejected). */
export function isUrgent(application, today = new Date()) {
  const days = getDaysToDeadline(application, today)
  return (
    days !== null &&
    days >= 0 &&
    days <= URGENT_DEADLINE_DAYS &&
    application.status !== STATUS.REJECTED
  )
}

/** Deadline has passed while the application is still only a Wishlist item. */
export function isOverdue(application, today = new Date()) {
  const days = getDaysToDeadline(application, today)
  return days !== null && days < 0 && application.status === STATUS.WISHLIST
}

/** In progress (Applied, Online Test, Interview) and no update for followUpDays or more. */
export function needsFollowUp(
  application,
  followUpDays = DEFAULT_SETTINGS.followUpDays,
  today = new Date(),
) {
  return (
    FOLLOW_UP_STATUSES.includes(application.status) &&
    getDaysSinceUpdate(application, today) >= followUpDays
  )
}

/**
 * Nearest round that is still pending and is today or later.
 * @param {{ rounds: object[] }} application
 * @param {Date} [today]
 * @returns {object|null}
 */
export function getNextRound(application, today = new Date()) {
  const todayStart = startOfDay(today)

  const upcoming = (application.rounds ?? [])
    .filter((round) => round.result === ROUND_RESULT.PENDING)
    .map((round) => ({ round, date: parseDateOnly(round.date) }))
    .filter((item) => item.date && item.date >= todayStart)
    .sort((a, b) => a.date - b.date)

  return upcoming.length > 0 ? upcoming[0].round : null
}

/**
 * All derived values in one call (components wrap it in useMemo).
 * @param {object} application
 * @param {number} [followUpDays]
 * @param {Date} [today]
 */
export function getDerivedFields(
  application,
  followUpDays = DEFAULT_SETTINGS.followUpDays,
  today = new Date(),
) {
  return {
    daysToDeadline: getDaysToDeadline(application, today),
    isUrgent: isUrgent(application, today),
    isOverdue: isOverdue(application, today),
    needsFollowUp: needsFollowUp(application, followUpDays, today),
    nextRound: getNextRound(application, today),
  }
}