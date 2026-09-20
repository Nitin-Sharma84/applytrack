import { useCallback, useSyncExternalStore } from 'react'

/**
 * True while the media query matches, and it updates when the window resizes.
 * Used to render EITHER the table OR the cards (not both), which keeps the DOM small.
 * @param {string} query for example '(min-width: 768px)'
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', onChange)
      return () => mediaQuery.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}