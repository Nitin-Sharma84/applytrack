import { useState } from 'react'
import { AppShell } from './components/layout/AppShell.jsx'
import { NAV_ITEMS } from './components/layout/navItems.js'
import { ToastViewport } from './components/ui/ToastViewport.jsx'
import { PAGE } from './constants/options.js'
import { useApplicationForm } from './hooks/useApplicationForm.js'
import { useSettings } from './hooks/useSettings.js'
import { PreviewPage } from './pages/PreviewPage.jsx'

export function App() {
  const { settings } = useSettings()
  const { openNewApplication } = useApplicationForm()

  // Simple state-based navigation (no router). The saved default view picks the first page.
  const [currentPage, setCurrentPage] = useState(settings.defaultView)
  const [search, setSearch] = useState('')

  function handleSearchChange(value) {
    setSearch(value)
    // Typing in the global search jumps to the list, where results will appear (Phase 5).
    if (value && currentPage !== PAGE.APPLICATIONS) setCurrentPage(PAGE.APPLICATIONS)
  }

  const pageLabel = NAV_ITEMS.find((item) => item.page === currentPage)?.label ?? 'Page'

  return (
    <>
      <AppShell
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        search={search}
        onSearchChange={handleSearchChange}
        onNewApplication={openNewApplication}
      >
        {/* key={currentPage} remounts this wrapper on every page change, which replays the fade-in. */}
        <div key={currentPage} className="anim-slide-up">
          <PreviewPage pageLabel={pageLabel} />
        </div>
      </AppShell>
      <ToastViewport />
    </>
  )
}