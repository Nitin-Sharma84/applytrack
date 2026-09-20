import { CURRENT_SCHEMA_VERSION } from '../constants/storageKeys.js'
import { toCsv } from '../utils/csv.js'
import { toDateInputValue } from '../utils/dateHelpers.js'

/** Starts a browser download for text content. */
function downloadFile(filename, content, mimeType) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  // Revoked a moment later: revoking at once can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Full backup of all applications as a JSON file. */
export function exportBackupJson(applications) {
  const backup = {
    app: 'ApplyTrack',
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    applications,
  }
  downloadFile(
    `applytrack-backup-${toDateInputValue()}.json`,
    JSON.stringify(backup, null, 2),
    'application/json',
  )
}

// [column title, how to read the value from an application]
const CSV_COLUMNS = [
  ['Company', (a) => a.company],
  ['Role', (a) => a.role],
  ['Status', (a) => a.status],
  ['Priority', (a) => a.priority],
  ['Job type', (a) => a.jobType],
  ['Work mode', (a) => a.workMode],
  ['Location', (a) => a.location],
  ['Source', (a) => a.source],
  ['Applied date', (a) => a.appliedDate],
  ['Deadline', (a) => a.deadline],
  ['Package (LPA)', (a) => a.ctcLpa],
  ['Job link', (a) => a.jobLink],
  ['Contact name', (a) => a.contactName],
  ['Contact email', (a) => a.contactEmail],
  ['Resume version', (a) => a.resumeVersion],
  ['Tags', (a) => a.tags.join('; ')],
  ['Notes', (a) => a.notes],
]

/** CSV of the given list (the Applications page passes the currently filtered list). */
export function exportApplicationsCsv(applications) {
  const headers = CSV_COLUMNS.map(([title]) => title)
  const rows = applications.map((application) => CSV_COLUMNS.map(([, read]) => read(application)))
  downloadFile(
    `applytrack-applications-${toDateInputValue()}.csv`,
    toCsv(headers, rows),
    'text/csv;charset=utf-8',
  )
}