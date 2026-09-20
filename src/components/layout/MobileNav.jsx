import { NAV_ITEMS } from './navItems.js'
import './MobileNav.css'

/** Bottom tab bar for screens below 1024px. */
export function MobileNav({ currentPage, onNavigate }) {
  return (
    <nav className="mobile-nav glass glass--blur" aria-label="Main">
      <ul className="mobile-nav__list">
        {NAV_ITEMS.map(({ page, label, Icon }) => {
          const isActive = page === currentPage
          return (
            <li key={page}>
              <button
                type="button"
                className={`mobile-nav__link${isActive ? ' mobile-nav__link--active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate(page)}
              >
                <Icon size={22} />
                <span className="mobile-nav__label">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}