import { useCallback, useEffect, useState } from 'react'
import { AppShell } from './components/layout/AppShell.jsx'
import { NAV_ITEMS } from './components/layout/navItems.js'
import { ShortcutsModal } from './components/ui/ShortcutsModal.jsx'
import { ToastViewport } from './components/ui/ToastViewport.jsx'
import { DEFAULT_FILTERS, PAGE } from './constants/options.js'
import { useApplicationForm } from './hooks/useApplicationForm.js'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut.js'
import { useSettings } from './hooks/useSettings.js'
import { AnalyticsPage } from './pages/AnalyticsPage.jsx'
import { ApplicationsPage } from './pages/ApplicationsPage.jsx'
import { BoardPage } from './pages/BoardPage.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { SettingsPage } from './pages/SettingsPage.jsx'

export function App() {
  const { settings } = useSettings()
  const { openNewApplication } = useApplicationForm()

  // Simple state-based navigation (no router). The saved default view picks the first page.
  const [currentPage, setCurrentPage] = useState(settings.defaultView)
  // Search text and filters are shared by the top bar, the list and the board,
  // so the state lives here (lifted up to the nearest common parent).
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

  const pageLabel = NAV_ITEMS.find((item) => item.page === currentPage)?.label ?? 'Page'

  // Syncs the browser tab title with the page (an effect is right here: it talks to the document).
  useEffect(() => {
    document.title = `${pageLabel} | ApplyTrack`
  }, [pageLabel])

  // Keyboard shortcuts: N = new application, / = search, ? = help. Esc is handled by dialogs themselves.
  useKeyboardShortcut('n', openNewApplication)
  useKeyboardShortcut('/', () => document.getElementById('global-search')?.focus()) // id is set in Topbar
  useKeyboardShortcut('?', () => setIsShortcutsOpen(true))

  const updateFilters = useCallback(
    (changes) => setFilters((previous) => ({ ...previous, ...changes })),
    [],
  )
  // Clearing filters keeps the chosen sort order.
  const clearFilters = useCallback(
    () => setFilters((previous) => ({ ...DEFAULT_FILTERS, sortBy: previous.sortBy })),
    [],
  )

  function handleNavigate(page) {
    setCurrentPage(page)
    // There is no real page load, so we do by hand what the browser normally does:
    // scroll to the top and move keyboard / screen reader focus to the new content.
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.getElementById('main-content')?.focus({ preventScroll: true }) // id is set in AppShell
  }

  function handleSearchChange(value) {
    updateFilters({ search: value })
    // Typing in the top bar jumps to the list, where the results appear.
    if (value && currentPage !== PAGE.APPLICATIONS && currentPage !== PAGE.BOARD) {
      setCurrentPage(PAGE.APPLICATIONS)
    }
  }

  function renderPage() {
    switch (currentPage) {
      case PAGE.APPLICATIONS:
        return (
          <ApplicationsPage
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
          />
        )
      case PAGE.BOARD:
        return <BoardPage filters={filters} onClearFilters={clearFilters} />
      case PAGE.ANALYTICS:
        return <AnalyticsPage />
      case PAGE.SETTINGS:
        return <SettingsPage onShowShortcuts={() => setIsShortcutsOpen(true)} />
      default:
        return <DashboardPage />
    }
  }

  return (
    <>
      <AppShell
        currentPage={currentPage}
        onNavigate={handleNavigate}
        search={filters.search}
        onSearchChange={handleSearchChange}
        onNewApplication={openNewApplication}
      >
        {/* key={currentPage} remounts this wrapper on every page change, which replays the fade-in. */}
        <div key={currentPage} className="anim-slide-up">
          {renderPage()}
        </div>
      </AppShell>
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <ToastViewport />
    </>
  )
}