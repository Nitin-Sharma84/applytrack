import { MobileNav } from './MobileNav.jsx'
import { Sidebar } from './Sidebar.jsx'
import { Topbar } from './Topbar.jsx'
import './AppShell.css'

/** Page frame: sidebar (desktop), top bar, main content, bottom nav (mobile). */
export function AppShell({
  currentPage,
  onNavigate,
  search,
  onSearchChange,
  onNewApplication,
  children,
}) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="app-shell__body">
        <Topbar
          search={search}
          onSearchChange={onSearchChange}
          onNewApplication={onNewApplication}
        />
        <main id="main-content" className="app-shell__main container" tabIndex={-1}>
          {children}
        </main>
      </div>
      <MobileNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  )
}