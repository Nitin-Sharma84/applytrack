import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_TOAST_DURATION_MS,
  MAX_VISIBLE_TOASTS,
  TOAST_TYPE,
} from '../constants/toast.js'
import { generateId } from '../utils/applicationHelpers.js'
import { ToastContext, ToastListContext } from './contexts.js'

/**
 * Holds toast state and the API to show and hide toasts.
 * The visible UI (portal + animations) is built in Phase 3 and reads the list
 * with useToastList().
 *
 * A toast looks like:
 * { id, type, message, action: { label, onClick } | null }
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  // Timer ids for auto-dismiss. A ref, because changing it must not re-render.
  const timersRef = useRef(new Map())

  const dismissToast = useCallback((id) => {
    const timerId = timersRef.current.get(id)
    if (timerId !== undefined) {
      clearTimeout(timerId)
      timersRef.current.delete(id)
    }
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ message, type = TOAST_TYPE.INFO, duration = DEFAULT_TOAST_DURATION_MS, action = null }) => {
      const id = generateId()
      setToasts((previous) => [...previous, { id, type, message, action }].slice(-MAX_VISIBLE_TOASTS))
      timersRef.current.set(
        id,
        setTimeout(() => dismissToast(id), duration),
      )
      return id
    },
    [dismissToast],
  )

  // Cleanup: no timer should fire after the provider is gone.
  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((timerId) => clearTimeout(timerId))
  }, [])

  // Stable object: created once per showToast/dismissToast identity (which never changes).
  const actions = useMemo(
    () => ({
      showToast,
      dismissToast,
      success: (message, options) => showToast({ ...options, message, type: TOAST_TYPE.SUCCESS }),
      error: (message, options) => showToast({ ...options, message, type: TOAST_TYPE.ERROR }),
      info: (message, options) => showToast({ ...options, message, type: TOAST_TYPE.INFO }),
    }),
    [showToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={actions}>
      <ToastListContext.Provider value={toasts}>{children}</ToastListContext.Provider>
    </ToastContext.Provider>
  )
}