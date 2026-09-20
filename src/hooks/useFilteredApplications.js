import { useMemo } from 'react'
import { ALL_FILTER, SEARCH_DEBOUNCE_MS } from '../constants/options.js'
import { filterApplications, sortApplications } from '../utils/filterHelpers.js'
import { getStatusCounts } from '../utils/statsHelpers.js'
import { useDebounce } from './useDebounce.js'

/**
 * Search + filters + sort as ONE derived value (no useEffect, no extra state).
 * Search text is debounced, so typing does not re-filter on every keystroke.
 *
 * @param {object[]} applications
 * @param {object} filters see DEFAULT_FILTERS in constants/options.js
 * @returns {{ results: object[], statusCounts: Record<string, number>, matchCount: number }}
 *   matchCount and statusCounts ignore the status tab, so the tabs can show
 *   "how many would I get if I picked this tab".
 */
export function useFilteredApplications(applications, filters) {
  const { search, status, priority, jobType, workMode, source, tag, sortBy } = filters
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS)

  // Kept separate from the status filter so tab counts do not need a second full pass.
  const matchingWithoutStatus = useMemo(
    () =>
      filterApplications(applications, {
        search: debouncedSearch,
        status: ALL_FILTER,
        priority,
        jobType,
        workMode,
        source,
        tag,
      }),
    [applications, debouncedSearch, priority, jobType, workMode, source, tag],
  )

  const statusCounts = useMemo(() => getStatusCounts(matchingWithoutStatus), [matchingWithoutStatus])

  const results = useMemo(() => {
    const byStatus =
      status === ALL_FILTER
        ? matchingWithoutStatus
        : matchingWithoutStatus.filter((application) => application.status === status)
    return sortApplications(byStatus, sortBy)
  }, [matchingWithoutStatus, status, sortBy])

  return { results, statusCounts, matchCount: matchingWithoutStatus.length }
}