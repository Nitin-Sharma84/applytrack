import { useCallback, useLayoutEffect, useMemo } from 'react'
import { DEFAULT_SETTINGS, THEME } from '../constants/options.js'
import { STORAGE_KEYS } from '../constants/storageKeys.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { sanitizeSettings } from '../services/storage.js'
import { SettingsContext } from './contexts.js'

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS, {
    sanitize: sanitizeSettings,
  })

  // Applies the theme to <html>. "system" removes the attribute so the OS
  // preference (prefers-color-scheme in tokens.css) decides.
  // useLayoutEffect runs before the browser paints, so a saved dark theme
  // does not flash light for one frame.
  useLayoutEffect(() => {
    const root = document.documentElement
    if (settings.theme === THEME.SYSTEM) {
      delete root.dataset.theme
    } else {
      root.dataset.theme = settings.theme
    }
  }, [settings.theme])

  const updateSettings = useCallback(
    // Sanitizing here means a bad value (weeklyGoal: -5) can never enter state.
    (changes) => setSettings((previous) => sanitizeSettings({ ...previous, ...changes })),
    [setSettings],
  )

  const resetSettings = useCallback(() => setSettings({ ...DEFAULT_SETTINGS }), [setSettings])

  // Memoized so consumers re-render only when settings actually change,
  // not every time this provider re-renders.
  const value = useMemo(
    () => ({ settings, updateSettings, resetSettings }),
    [settings, updateSettings, resetSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}