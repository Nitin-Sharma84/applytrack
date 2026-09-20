import { createContext } from 'react'

/**
 * All context objects live here, away from the Provider components.
 * The react-refresh lint rule (Vite default) wants component files to export
 * only components, so contexts and hooks are kept in separate files.
 */
export const ApplicationsContext = createContext(null)
export const SettingsContext = createContext(null)

// Toasts use two contexts on purpose:
// ToastContext (stable actions) never changes, so components that only SHOW
// toasts do not re-render when a toast appears or disappears.
// ToastListContext (the array) changes, and only the toast viewport reads it.
export const ToastContext = createContext(null)
export const ToastListContext = createContext([])