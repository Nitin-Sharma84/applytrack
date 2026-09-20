import { useContext } from 'react'
import { SettingsContext } from '../context/contexts.js'

/** @returns {{ settings: object, updateSettings: Function, resetSettings: Function }} */
export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used inside <SettingsProvider>.')
  }
  return context
}