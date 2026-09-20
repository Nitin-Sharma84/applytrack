/** Single source of truth for pipeline statuses. */
export const STATUS = Object.freeze({
  WISHLIST: 'Wishlist',
  APPLIED: 'Applied',
  ONLINE_TEST: 'Online Test',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
})

/** Pipeline order. The Kanban columns and status dropdowns use this order. */
export const STATUSES = Object.values(STATUS)

/** Applications that are still "in progress" (used by the Active stat card). */
export const ACTIVE_STATUSES = [STATUS.APPLIED, STATUS.ONLINE_TEST, STATUS.INTERVIEW]

/** Only these statuses can need a follow-up. Kept separate so the rule can change alone. */
export const FOLLOW_UP_STATUSES = ACTIVE_STATUSES

/** CSS-friendly slug per status. Matches the --status-<slug>-* variables in tokens.css. */
const STATUS_SLUGS = Object.freeze({
  [STATUS.WISHLIST]: 'wishlist',
  [STATUS.APPLIED]: 'applied',
  [STATUS.ONLINE_TEST]: 'online-test',
  [STATUS.INTERVIEW]: 'interview',
  [STATUS.OFFER]: 'offer',
  [STATUS.REJECTED]: 'rejected',
})

/**
 * @param {string} status
 * @returns {string} slug such as "online-test" (falls back to "wishlist")
 */
export function getStatusSlug(status) {
  return STATUS_SLUGS[status] ?? STATUS_SLUGS[STATUS.WISHLIST]
}