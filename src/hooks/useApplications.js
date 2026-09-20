import { useContext } from 'react'
import { ApplicationsContext } from '../context/contexts.js'

/** @returns the applications list and the functions to change it */
export function useApplications() {
  const context = useContext(ApplicationsContext)
  if (!context) {
    throw new Error('useApplications must be used inside <ApplicationsProvider>.')
  }
  return context
}