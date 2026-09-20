import { toDate } from '../utils/dateHelpers.js'
import { sanitizeApplications } from './storage.js'

const toTime = (value) => toDate(value)?.getTime() ?? 0

/**
 * Reads the text of a backup file and returns safe applications.
 * Nothing in the file is trusted: every record is validated and repaired by
 * sanitizeApplications(), so a hand-edited or malicious file cannot crash the
 * app or sneak in a javascript: link.
 *
 * @param {string} text
 * @returns {{ ok: true, applications: object[], skipped: number } | { ok: false, error: string }}
 */
export function parseBackup(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'This file is not valid JSON.' }
  }

  // Accepts our backup format ({ applications: [...] }) and a plain array.
  const list = Array.isArray(data) ? data : data?.applications
  if (!Array.isArray(list)) return { ok: false, error: 'No applications found in this file.' }

  const valid = sanitizeApplications(list)
  // The same id twice would break React keys, so the last copy wins.
  const applications = [...new Map(valid.map((application) => [application.id, application])).values()]
  if (applications.length === 0) return { ok: false, error: 'The file has no valid applications.' }

  return { ok: true, applications, skipped: list.length - applications.length }
}

/**
 * Keeps everything you have and adds the imported applications.
 * If the same id exists in both, the newer version (updatedAt) wins.
 * @returns {object[]}
 */
export function mergeApplications(current, imported) {
  const byId = new Map(current.map((application) => [application.id, application]))
  for (const application of imported) {
    const existing = byId.get(application.id)
    if (!existing || toTime(application.updatedAt) > toTime(existing.updatedAt)) {
      byId.set(application.id, application)
    }
  }
  return [...byId.values()]
}