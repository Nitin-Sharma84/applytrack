import { ALL_FILTER, SORT_BY } from '../constants/options.js'
import { getDaysToDeadline } from './applicationHelpers.js'
import { toDate } from './dateHelpers.js'

// Filter keys are named exactly like the application fields they compare with.
const FILTER_FIELDS = ['status', 'priority', 'jobType', 'workMode', 'source']
const MORE_FILTER_FIELDS = ['priority', 'jobType', 'workMode', 'source']

const toTime = (value) => toDate(value)?.getTime() ?? 0
const compareText = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })

/** Every typed word must appear somewhere, so "tcs intern" finds company TCS with role Intern. */
function matchesSearch(application, words) {
  if (words.length === 0) return true
  const haystack = [
    application.company,
    application.role,
    application.location,
    application.notes,
    ...application.tags,
  ]
    .join(' ')
    .toLowerCase()
  return words.every((word) => haystack.includes(word))
}

/**
 * @param {object[]} applications
 * @param {{ search: string, status: string, priority: string, jobType: string, workMode: string, source: string }} filters
 * @returns {object[]} new array, same application objects
 */
export function filterApplications(applications, filters) {
  const words = filters.search.toLowerCase().split(/\s+/).filter(Boolean)
  return applications.filter(
    (application) =>
      matchesSearch(application, words) &&
      FILTER_FIELDS.every(
        (field) => filters[field] === ALL_FILTER || application[field] === filters[field],
      ) &&
      (filters.tag === ALL_FILTER || application.tags.includes(filters.tag)),
  )
}

/** Deadline groups: upcoming (or today) first, then already passed, then no deadline. */
function deadlineGroup(days) {
  if (days === null) return 2
  return days >= 0 ? 0 : 1
}

/**
 * @param {object[]} applications
 * @param {string} sortBy one of SORT_BY
 * @param {Date} [today]
 * @returns {object[]} a sorted COPY. The input is never mutated.
 */
export function sortApplications(applications, sortBy, today = new Date()) {
  const list = [...applications]

  switch (sortBy) {
    case SORT_BY.UPDATED:
      return list.sort((a, b) => toTime(b.updatedAt) - toTime(a.updatedAt))
    case SORT_BY.APPLIED:
      return list.sort(
        (a, b) => toTime(b.appliedDate) - toTime(a.appliedDate) || toTime(b.createdAt) - toTime(a.createdAt),
      )
    case SORT_BY.COMPANY:
      return list.sort((a, b) => compareText(a.company, b.company))
    case SORT_BY.CTC:
      return list.sort((a, b) => (b.ctcLpa ?? -1) - (a.ctcLpa ?? -1))
    default:
      return list.sort((a, b) => {
        const daysA = getDaysToDeadline(a, today)
        const daysB = getDaysToDeadline(b, today)
        const groupA = deadlineGroup(daysA)
        const groupB = deadlineGroup(daysB)
        if (groupA !== groupB) return groupA - groupB
        if (groupA === 0) return daysA - daysB // nearest first
        if (groupA === 1) return daysB - daysA // most recently passed first
        return 0
      })
  }
}

/** @returns {boolean} true if the search box or any filter (including status) is set */
export function hasActiveFilters(filters) {
  return (
    filters.search.trim() !== '' ||
    filters.tag !== ALL_FILTER ||
    FILTER_FIELDS.some((field) => filters[field] !== ALL_FILTER)
  )
}

/** @returns {number} how many of the "More filters" dropdowns are set */
export function countMoreFilters(filters) {
  return MORE_FILTER_FIELDS.filter((field) => filters[field] !== ALL_FILTER).length
}