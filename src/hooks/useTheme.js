import { useCallback, useSyncExternalStore } from 'react'
import { THEME } from '../constants/options.js'
import { useSettings } from './useSettings.js'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function subscribeToSystemTheme(onChange) {
  const mediaQuery = window.matchMedia(DARK_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

const getSystemPrefersDark = () => window.matchMedia(DARK_QUERY).matches

/**
 * @returns {{ theme: string, resolvedTheme: 'light'|'dark', toggleTheme: () => void }}
 * theme is the saved choice (may be "system"). resolvedTheme is what is
 * actually shown, so the toggle icon is always correct.
 */
export function useTheme() {
  const { settings, updateSettings } = useSettings()

  // useSyncExternalStore is the right tool for reading browser state that
  // lives outside React (here the OS dark mode). It stays correct if the
  // user changes the OS theme while the app is open.
  const systemPrefersDark = useSyncExternalStore(subscribeToSystemTheme, getSystemPrefersDark)

  const resolvedTheme =
    settings.theme === THEME.SYSTEM
      ? systemPrefersDark
        ? THEME.DARK
        : THEME.LIGHT
      : settings.theme

  const toggleTheme = useCallback(() => {
    updateSettings({ theme: resolvedTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK })
  }, [resolvedTheme, updateSettings])

  return { theme: settings.theme, resolvedTheme, toggleTheme }
}