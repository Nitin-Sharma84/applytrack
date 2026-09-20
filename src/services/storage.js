/**
 * storage.js: the ONLY file in the app that touches localStorage.
 * Components and contexts call these functions and never see the browser API,
 * so switching to a real backend later means rewriting just this file.
 *
 * Safety rules implemented here:
 * 1. Every read and write is inside try/catch (private mode, blocked storage, quota full).
 * 2. Corrupted JSON falls back to empty data, and the raw text is copied to a backup key.
 * 3. A schema version key allows future migrations.
 * 4. Stored records are validated and repaired before the app sees them.
 */

import { BACKUP_SUFFIX, CURRENT_SCHEMA_VERSION, STORAGE_KEYS, STORAGE_PREFIX } from '../constants/storageKeys.js'
import { DEFAULT_SETTINGS, DEFAULT_VIEWS, SETTINGS_LIMITS, THEMES } from '../constants/options.js'
import { normalizeApplication } from '../utils/applicationHelpers.js'
import { isApplicationRecord, isPlainObject } from '../utils/validators.js'

/* ==========================================================================
   Low level helpers
   ========================================================================== */

/** window.localStorage itself can throw (for example when cookies are blocked). */
function getStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function backupCorrupted(storage, key, raw) {
  try {
    storage.setItem(`${key}${BACKUP_SUFFIX}`, raw)
  } catch {
    // Storage is full or blocked, so there is nothing more we can do here.
  }
}

/**
 * Reads and parses JSON. Never throws.
 * @param {string} key
 * @param {*} [fallback] returned when the key is missing, unreadable or corrupted
 * @returns {*}
 */
export function readJSON(key, fallback = null) {
  const storage = getStorage()
  if (!storage) return fallback

  let raw
  try {
    raw = storage.getItem(key)
  } catch {
    return fallback
  }
  if (raw === null) return fallback

  try {
    return JSON.parse(raw)
  } catch {
    console.warn(`[ApplyTrack] Stored data for "${key}" is corrupted. Using empty data instead.`)
    backupCorrupted(storage, key, raw)
    return fallback
  }
}

/**
 * Serializes and saves a value. Never throws.
 * @param {string} key
 * @param {*} value
 * @returns {boolean} false if saving failed (quota exceeded, storage blocked...)
 */
export function writeJSON(key, value) {
  const storage = getStorage()
  if (!storage) return false

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`[ApplyTrack] Could not save "${key}".`, error)
    return false
  }
}

/* ==========================================================================
   Schema version and migrations
   ========================================================================== */

// Add one function per version bump. Example for the future:
//   2: () => { /* convert version 1 data to version 2 here */ },
const MIGRATIONS = {}

/** Call once at app start. Runs pending migrations and records the current version. */
export function initStorage() {
  const storedVersion = readJSON(STORAGE_KEYS.SCHEMA_VERSION, 0)

  if (typeof storedVersion === 'number' && storedVersion > CURRENT_SCHEMA_VERSION) {
    // Data was written by a newer build. Do not downgrade the version marker.
    console.warn('[ApplyTrack] Stored data is from a newer version of the app.')
    return
  }
  if (storedVersion === CURRENT_SCHEMA_VERSION) return

  const fromVersion = Number.isInteger(storedVersion) ? storedVersion : 0
  for (let version = fromVersion + 1; version <= CURRENT_SCHEMA_VERSION; version += 1) {
    MIGRATIONS[version]?.()
  }
  writeJSON(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION)
}

/* ==========================================================================
   Applications
   ========================================================================== */

/**
 * Keeps only valid records and repairs missing fields. Reused by the import feature later.
 * @param {unknown} raw
 * @returns {object[]}
 */
export function sanitizeApplications(raw) {
  if (!Array.isArray(raw)) return []
  return raw.filter(isApplicationRecord).map(normalizeApplication)
}

/** @returns {object[]} stored applications (empty array if nothing valid is stored) */
export function loadApplications() {
  const stored = readJSON(STORAGE_KEYS.APPLICATIONS, [])
  const applications = sanitizeApplications(stored)

  const droppedSomething = !Array.isArray(stored) || applications.length !== stored.length
  if (droppedSomething) {
    console.warn('[ApplyTrack] Some stored applications were invalid and were skipped.')
    const storage = getStorage()
    if (storage) backupCorrupted(storage, STORAGE_KEYS.APPLICATIONS, JSON.stringify(stored))
  }
  return applications
}

/** @param {object[]} applications @returns {boolean} true if saved */
export function saveApplications(applications) {
  return writeJSON(STORAGE_KEYS.APPLICATIONS, applications)
}

/* ==========================================================================
   Settings
   ========================================================================== */

function integerInRange(value, { min, max }, fallback) {
  return Number.isInteger(value) && value >= min && value <= max ? value : fallback
}

/**
 * Turns anything into a complete, valid settings object.
 * @param {unknown} raw
 * @returns {{ theme: string, followUpDays: number, weeklyGoal: number, defaultView: string }}
 */
export function sanitizeSettings(raw) {
  const source = isPlainObject(raw) ? raw : {}

  return {
    theme: THEMES.includes(source.theme) ? source.theme : DEFAULT_SETTINGS.theme,
    followUpDays: integerInRange(
      source.followUpDays,
      SETTINGS_LIMITS.followUpDays,
      DEFAULT_SETTINGS.followUpDays,
    ),
    weeklyGoal: integerInRange(
      source.weeklyGoal,
      SETTINGS_LIMITS.weeklyGoal,
      DEFAULT_SETTINGS.weeklyGoal,
    ),
    defaultView: DEFAULT_VIEWS.includes(source.defaultView)
      ? source.defaultView
      : DEFAULT_SETTINGS.defaultView,
  }
}

/* ==========================================================================
   Reset
   ========================================================================== */

/**
 * Removes every ApplyTrack key (data, settings, version, backups).
 * Other apps' keys on the same origin are left alone.
 * @returns {boolean}
 */
export function clearAllData() {
  const storage = getStorage()
  if (!storage) return false

  try {
    // Collect keys first: removing while looping would shift the indexes.
    const ownKeys = []
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index)
      if (key && key.startsWith(STORAGE_PREFIX)) ownKeys.push(key)
    }
    ownKeys.forEach((key) => storage.removeItem(key))
    return true
  } catch {
    return false
  }
}