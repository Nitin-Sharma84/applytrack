import { useEffect, useState } from 'react'
import { readJSON, writeJSON } from '../services/storage.js'

/**
 * useState that is saved to localStorage and restored on the next visit.
 * It goes through the storage service, so localStorage is still accessed in one place only.
 *
 * @template T
 * @param {string} key
 * @param {T} initialValue used when nothing valid is stored
 * @param {{ sanitize?: (stored: unknown) => T }} [options] validates or repairs the stored value
 * @returns {[T, import('react').Dispatch<import('react').SetStateAction<T>>]}
 */
export function useLocalStorage(key, initialValue, { sanitize } = {}) {
  // Lazy initializer: localStorage is read once on mount, not on every render.
  const [value, setValue] = useState(() => {
    const stored = readJSON(key, null)
    if (stored === null) return initialValue
    return sanitize ? sanitize(stored) : stored
  })

  // Runs after render whenever the value changes. Saving is a side effect,
  // so it belongs in useEffect (not in the render body).
  useEffect(() => {
    writeJSON(key, value)
  }, [key, value])

  return [value, setValue]
}