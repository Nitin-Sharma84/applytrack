import { useState } from 'react'
import {
  ALL_FILTER,
  JOB_TYPES,
  PRIORITIES,
  SORT_OPTIONS,
  SOURCES,
  WORK_MODES,
} from '../../constants/options.js'
import { STATUSES, getStatusSlug } from '../../constants/statuses.js'
import { countMoreFilters, hasActiveFilters } from '../../utils/filterHelpers.js'
import { Button } from '../ui/Button.jsx'
import { IconChevronDown } from '../ui/Icons.jsx'
import { Select } from '../ui/Select.jsx'
import './FilterBar.css'

const withAll = (allLabel, options) => [
  { value: ALL_FILTER, label: allLabel },
  ...options.map((option) => ({ value: option, label: option })),
]

// Built once at module load, not on every render.
const PRIORITY_OPTIONS = withAll('All priorities', PRIORITIES)
const JOB_TYPE_OPTIONS = withAll('All job types', JOB_TYPES)
const WORK_MODE_OPTIONS = withAll('All work modes', WORK_MODES)
const SOURCE_OPTIONS = withAll('All sources', SOURCES)

/**
 * Status tabs (with counts), sort, "More filters", result count, Clear filters.
 * The search text itself lives in the top bar.
 *
 * @param {{ filters: object, statusCounts: Record<string, number>, matchCount: number,
 *           resultCount: number, totalCount: number,
 *           onChange: (changes: object) => void, onClear: () => void }} props
 */
export function FilterBar({ filters, tags, statusCounts, matchCount, resultCount, totalCount, onChange, onClear }) {
  const moreCount = countMoreFilters(filters)
  const [showMore, setShowMore] = useState(moreCount > 0)

  return (
    <div className="filter-bar">
      <div className="filter-bar__tabs" role="group" aria-label="Filter by status">
        <button
          type="button"
          className="filter-bar__tab filter-bar__tab--all"
          aria-pressed={filters.status === ALL_FILTER}
          onClick={() => onChange({ status: ALL_FILTER })}
        >
          All <span className="filter-bar__count">{matchCount}</span>
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={`filter-bar__tab filter-bar__tab--${getStatusSlug(status)}`}
            aria-pressed={filters.status === status}
            onClick={() => onChange({ status })}
          >
            {status} <span className="filter-bar__count">{statusCounts[status]}</span>
          </button>
        ))}
      </div>
      {tags.length > 0 && (
        <div className="filter-bar__tags" role="group" aria-label="Filter by tag">
          <span className="filter-bar__tags-label">Tags</span>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="filter-bar__tag"
              aria-pressed={filters.tag === tag}
              onClick={() => onChange({ tag: filters.tag === tag ? ALL_FILTER : tag })}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
      <div className="filter-bar__controls">
        <Select
          label="Sort by"
          options={SORT_OPTIONS}
          value={filters.sortBy}
          onChange={(event) => onChange({ sortBy: event.target.value })}
        />
        <Button variant="secondary" aria-expanded={showMore} onClick={() => setShowMore((isOpen) => !isOpen)}>
          More filters{moreCount > 0 ? ` (${moreCount})` : ''}
          <IconChevronDown
            size={16}
            className={`filter-bar__chevron${showMore ? ' filter-bar__chevron--open' : ''}`}
          />
        </Button>
        {hasActiveFilters(filters) && (
          <Button variant="ghost" onClick={onClear}>
            Clear filters
          </Button>
        )}
        <p className="filter-bar__result" aria-live="polite">
          Showing {resultCount} of {totalCount}
        </p>
      </div>

      {showMore && (
        <div className="filter-bar__more">
          <Select
            label="Priority"
            options={PRIORITY_OPTIONS}
            value={filters.priority}
            onChange={(event) => onChange({ priority: event.target.value })}
          />
          <Select
            label="Job type"
            options={JOB_TYPE_OPTIONS}
            value={filters.jobType}
            onChange={(event) => onChange({ jobType: event.target.value })}
          />
          <Select
            label="Work mode"
            options={WORK_MODE_OPTIONS}
            value={filters.workMode}
            onChange={(event) => onChange({ workMode: event.target.value })}
          />
          <Select
            label="Source"
            options={SOURCE_OPTIONS}
            value={filters.source}
            onChange={(event) => onChange({ source: event.target.value })}
          />
        </div>
      )}
    </div>
  )
}