import { useCallback, useMemo, useState } from 'react'
import { ApplicationDrawer } from '../components/details/ApplicationDrawer.jsx'
import { ApplicationDrawerContext } from './contexts.js'

export function ApplicationDrawerProvider({ children }) {
  // Only the id is stored. The drawer reads the LIVE application from context,
  // so it never shows stale data after a round or checklist change.
  const [selectedId, setSelectedId] = useState(null)

  const openApplicationDetails = useCallback((application) => setSelectedId(application.id), [])
  const closeApplicationDetails = useCallback(() => setSelectedId(null), [])

  const value = useMemo(() => ({ openApplicationDetails }), [openApplicationDetails])

  return (
    <ApplicationDrawerContext.Provider value={value}>
      {children}
      {selectedId !== null && (
        <ApplicationDrawer applicationId={selectedId} onClose={closeApplicationDetails} />
      )}
    </ApplicationDrawerContext.Provider>
  )
}