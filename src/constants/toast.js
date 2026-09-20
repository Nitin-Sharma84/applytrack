export const TOAST_TYPE = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
})

export const DEFAULT_TOAST_DURATION_MS = 4000

/** Older toasts are dropped when more than this many are on screen. */
export const MAX_VISIBLE_TOASTS = 3