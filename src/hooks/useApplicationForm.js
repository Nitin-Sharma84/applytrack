import { useContext } from 'react'
import { ApplicationFormContext } from '../context/contexts.js'

/** @returns {{ openNewApplication: () => void, openEditApplication: (application: object) => void }} */
export function useApplicationForm() {
  const context = useContext(ApplicationFormContext)
  if (!context) {
    throw new Error('useApplicationForm must be used inside <ApplicationFormProvider>.')
  }
  return context
}