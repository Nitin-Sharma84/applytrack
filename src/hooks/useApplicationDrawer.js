import { useContext } from 'react'
import { ApplicationDrawerContext } from '../context/contexts.js'

/** @returns {{ openApplicationDetails: (application: object) => void }} */
export function useApplicationDrawer() {
  const context = useContext(ApplicationDrawerContext)
  if (!context) {
    throw new Error('useApplicationDrawer must be used inside <ApplicationDrawerProvider>.')
  }
  return context
}