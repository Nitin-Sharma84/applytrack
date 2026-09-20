import { useEffect, useState } from 'react'

/**
 * Returns `value` only after it has stopped changing for `delay` ms.
 * Used for search, so filtering does not run on every single keystroke.
 * @template T
 * @param {T} value
 * @param {number} [delay]
 * @returns {T}
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay)

    // Cleanup: when `value` changes again, the old timer is cancelled.
    // This cancel step is exactly what makes it a debounce.
    return () => clearTimeout(timerId)
  }, [value, delay])

  return debouncedValue
}