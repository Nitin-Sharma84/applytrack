import { STATUSES, getStatusSlug } from '../../constants/statuses.js'
import { IconChevronDown } from '../ui/Icons.jsx'
import './StatusSelect.css'

/**
 * Status dropdown styled as a colored pill. It is a real <select>, so it works
 * with keyboard, screen readers and the native picker on phones. Every change
 * goes through changeStatus(), which records statusHistory automatically.
 */
export function StatusSelect({ id, company, value, onChange }) {
  return (
    <span className={`status-select status-select--${getStatusSlug(value)}`}>
      <select
        className="status-select__control"
        aria-label={`Status of ${company}`}
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <IconChevronDown className="status-select__icon" size={14} />
    </span>
  )
}