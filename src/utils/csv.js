// Excel and Google Sheets run a cell that starts with these characters as a formula.
const FORMULA_START = /^[=+\-@\t\r]/

/**
 * Makes one value safe for a CSV file.
 * - Cells that start with = + - @ get a leading ' so they stay plain text
 *   (CSV injection protection). Trade-off: a note starting with "-" shows a ' too.
 * - Cells with a comma, quote or line break are wrapped in quotes, and inner quotes are doubled.
 */
export function escapeCsvCell(value) {
  let text = value === null || value === undefined ? '' : String(value)
  if (FORMULA_START.test(text)) text = `'${text}`
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

/**
 * @param {string[]} headers
 * @param {unknown[][]} rows
 * @returns {string} CSV text. The BOM at the start makes Excel read UTF-8 (for example the rupee sign).
 */
export function toCsv(headers, rows) {
  const lines = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(','))
  return `\uFEFF${lines.join('\r\n')}`
}