import { STATUSES } from '../constants/statuses.js'
import { parseDateOnly } from './dateHelpers.js'

// Deliberately simple. A fully RFC-compliant email regex is huge and still
// cannot prove that a mailbox exists. This catches normal typing mistakes.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NON_NEGATIVE_NUMBER_PATTERN = /^\d*\.?\d+$/

const toText = (value) => String(value ?? '').trim()

/** @param {unknown} value @returns {boolean} true for {} style objects (not arrays, not null) */
export function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** @param {string} value @returns {boolean} only http and https links are accepted */
export function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/** @param {string} value @returns {boolean} */
export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value)
}

/** @param {string|number} value @returns {boolean} true for 0, 12, 12.5 and .5 (not -1, not "abc") */
export function isNonNegativeNumber(value) {
  return NON_NEGATIVE_NUMBER_PATTERN.test(toText(value))
}

/**
 * Validates the application form values (all values are strings from inputs).
 * @param {Record<string, unknown>} values
 * @returns {Record<string, string>} field name to error message. {} means valid.
 */
export function validateApplicationForm(values) {
  const errors = {}

  if (!toText(values.company)) errors.company = 'Company name is required.'
  if (!toText(values.role)) errors.role = 'Role is required.'

  const jobLink = toText(values.jobLink)
  if (jobLink && !isValidUrl(jobLink)) {
    errors.jobLink = 'Enter a valid link starting with http:// or https://'
  }

  const contactEmail = toText(values.contactEmail)
  if (contactEmail && !isValidEmail(contactEmail)) {
    errors.contactEmail = 'Enter a valid email address.'
  }

  const ctcLpa = toText(values.ctcLpa)
  if (ctcLpa && !isNonNegativeNumber(ctcLpa)) {
    errors.ctcLpa = 'CTC must be a number, 0 or more.'
  }

  const appliedDate = parseDateOnly(toText(values.appliedDate))
  const deadline = parseDateOnly(toText(values.deadline))
  if (appliedDate && deadline && deadline < appliedDate) {
    errors.deadline = 'Deadline cannot be before the applied date.'
  }

  return errors
}

/** @param {Record<string, string>} errors @returns {boolean} */
export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}

/**
 * Minimum shape a stored or imported record must have to be safe to show.
 * Everything else is repaired by normalizeApplication().
 * @param {unknown} value
 * @returns {boolean}
 */
export function isApplicationRecord(value) {
  return (
    isPlainObject(value) &&
    typeof value.id === 'string' &&
    value.id !== '' &&
    typeof value.company === 'string' &&
    value.company.trim() !== '' &&
    typeof value.role === 'string' &&
    value.role.trim() !== '' &&
    STATUSES.includes(value.status)
  )
}