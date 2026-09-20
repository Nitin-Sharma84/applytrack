/* ---------- Option groups: an object (for code) + an array (for dropdowns) ---------- */

export const JOB_TYPE = Object.freeze({ FULL_TIME: 'Full-time', INTERNSHIP: 'Internship' })
export const JOB_TYPES = Object.values(JOB_TYPE)

export const WORK_MODE = Object.freeze({ ON_SITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid' })
export const WORK_MODES = Object.values(WORK_MODE)

export const SOURCE = Object.freeze({
  CAMPUS: 'Campus Placement',
  LINKEDIN: 'LinkedIn',
  NAUKRI: 'Naukri',
  INTERNSHALA: 'Internshala',
  REFERRAL: 'Referral',
  COMPANY_WEBSITE: 'Company Website',
  OTHER: 'Other',
})
export const SOURCES = Object.values(SOURCE)

export const PRIORITY = Object.freeze({ LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' })
export const PRIORITIES = Object.values(PRIORITY)

export const ROUND_TYPE = Object.freeze({
  APTITUDE: 'Aptitude',
  CODING: 'Coding',
  TECHNICAL: 'Technical',
  MANAGERIAL: 'Managerial',
  HR: 'HR',
})
export const ROUND_TYPES = Object.values(ROUND_TYPE)

export const ROUND_MODE = Object.freeze({ ONLINE: 'Online', OFFLINE: 'Offline' })
export const ROUND_MODES = Object.values(ROUND_MODE)

export const ROUND_RESULT = Object.freeze({
  PENDING: 'Pending',
  CLEARED: 'Cleared',
  NOT_CLEARED: 'Not Cleared',
})
export const ROUND_RESULTS = Object.values(ROUND_RESULT)

/* ---------- Sorting and filtering ---------- */

export const SORT_BY = Object.freeze({
  DEADLINE: 'deadline',
  UPDATED: 'updated',
  APPLIED: 'applied',
  COMPANY: 'company',
  CTC: 'ctc',
})

export const SORT_OPTIONS = [
  { value: SORT_BY.DEADLINE, label: 'Nearest deadline' },
  { value: SORT_BY.UPDATED, label: 'Recently updated' },
  { value: SORT_BY.APPLIED, label: 'Recently applied' },
  { value: SORT_BY.COMPANY, label: 'Company A to Z' },
  { value: SORT_BY.CTC, label: 'Highest CTC' },
]

/** Sentinel value meaning "no filter" for a dropdown filter. */
export const ALL_FILTER = 'all'

export const DEFAULT_FILTERS = Object.freeze({
  search: '',
  status: ALL_FILTER,
  priority: ALL_FILTER,
  jobType: ALL_FILTER,
  workMode: ALL_FILTER,
  source: ALL_FILTER,
  sortBy: SORT_BY.DEADLINE,
})

/* ---------- Pages and theme ---------- */

export const PAGE = Object.freeze({
  DASHBOARD: 'dashboard',
  APPLICATIONS: 'applications',
  BOARD: 'board',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
})
export const PAGES = Object.values(PAGE)

/** Pages the user may pick as the "default view" in Settings. */
export const DEFAULT_VIEWS = [PAGE.DASHBOARD, PAGE.APPLICATIONS, PAGE.BOARD]

/** "system" means: no data-theme attribute, so the OS preference decides (see tokens.css). */
export const THEME = Object.freeze({ SYSTEM: 'system', LIGHT: 'light', DARK: 'dark' })
export const THEMES = Object.values(THEME)

/* ---------- Business rules and timings ---------- */

export const URGENT_DEADLINE_DAYS = 3
export const UPCOMING_WINDOW_DAYS = 7
export const TAG_MAX_LENGTH = 30
export const UNDO_TIMEOUT_MS = 5000
export const SEARCH_DEBOUNCE_MS = 300

export const SETTINGS_LIMITS = Object.freeze({
  followUpDays: { min: 1, max: 60 },
  weeklyGoal: { min: 1, max: 100 },
})

export const DEFAULT_SETTINGS = Object.freeze({
  theme: THEME.SYSTEM,
  followUpDays: 7,
  weeklyGoal: 10,
  defaultView: PAGE.DASHBOARD,
})