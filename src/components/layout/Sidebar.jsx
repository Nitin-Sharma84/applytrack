import { Logo } from './Logo.jsx'
import { NAV_ITEMS } from './navItems.js'
import './Sidebar.css'

/** Desktop navigation (hidden below 1024px, where MobileNav takes over). */
export function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="sidebar glass">
      <div className="sidebar__brand">
        <Logo />
      </div>
      <nav className="sidebar__nav" aria-label="Main">
        <ul className="sidebar__list">
          {NAV_ITEMS.map(({ page, label, Icon }) => {
            const isActive = page === currentPage
            return (
              <li key={page}>
                <button
                  type="button"
                  className={`sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onNavigate(page)}
                >
                  <Icon size={20} />
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <p className="sidebar__footer">Your data stays in this browser. Press ? for shortcuts.</p>
    </aside>
  )
}