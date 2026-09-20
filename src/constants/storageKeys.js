/**
 * All localStorage key names live here (no magic strings elsewhere).
 * The shared prefix lets clearAllData() remove only our own keys and
 * never touch other apps running on the same origin (for example localhost).
 */
export const STORAGE_PREFIX = 'applytrack:'

export const STORAGE_KEYS = Object.freeze({
  APPLICATIONS: `${STORAGE_PREFIX}applications`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  SCHEMA_VERSION: `${STORAGE_PREFIX}schemaVersion`,
})

/** Bump this when the shape of stored data changes, and add a migration. */
export const CURRENT_SCHEMA_VERSION = 1

/** Corrupted data is copied to "<key>:corrupted-backup" before it can be overwritten. */
export const BACKUP_SUFFIX = ':corrupted-backup'