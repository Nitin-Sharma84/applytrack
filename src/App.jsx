import { useCallback, useState } from 'react'
import { AppShell } from './components/layout/AppShell.jsx'
import { NAV_ITEMS } from './components/layout/navItems.js'
import { ToastViewport } from './components/ui/ToastViewport.jsx'
import { DEFAULT_FILTERS, PAGE } from './constants/options.js'
import { useApplicationForm } from './hooks/useApplicationForm.js'
import { useSettings } from './hooks/useSettings.js'
import { ApplicationsPage } from './pages/ApplicationsPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { PlaceholderPage } from './pages/PlaceholderPage.jsx'

export function App() {
  const { settings } = useSettings()
  const { openNewApplication } = useApplicationForm()

  // Simple state-based navigation (no router). The saved default view picks the first page.
  const [currentPage, setCurrentPage] = useState(settings.defaultView)
  // Search text and filters are shared by the top bar and the Applications page,
  // so the state lives here (lifted up to the nearest common parent).
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const updateFilters = useCallback(
    (changes) => setFilters((previous) => ({ ...previous, ...changes })),
    [],
  )
  // Clearing filters keeps the chosen sort order.
  const clearFilters = useCallback(
    () => setFilters((previous) => ({ ...DEFAULT_FILTERS, sortBy: previous.sortBy })),
    [],
  )

  function handleSearchChange(value) {
    updateFilters({ search: value })
    // Typing in the top bar jumps to the list, where the results appear.
    if (value && currentPage !== PAGE.APPLICATIONS) setCurrentPage(PAGE.APPLICATIONS)
  }

  const pageLabel = NAV_ITEMS.find((item) => item.page === currentPage)?.label ?? 'Page'

  function renderPage() {
    switch (currentPage) {
      case PAGE.DASHBOARD:
        return <DashboardPage />
      case PAGE.APPLICATIONS:
        return (
          <ApplicationsPage
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
          />
        )
      default:
        return <PlaceholderPage title={pageLabel} />
    }
  }

  return (
    <>
      <AppShell
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        search={filters.search}
        onSearchChange={handleSearchChange}
        onNewApplication={openNewApplication}
      >
        {/* key={currentPage} remounts this wrapper on every page change, which replays the fade-in. */}
        <div key={currentPage} className="anim-slide-up">
          {renderPage()}
        </div>
      </AppShell>
      <ToastViewport />
    </>
  )
}