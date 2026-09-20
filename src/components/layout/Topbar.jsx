import { THEME } from '../../constants/options.js'
import { useTheme } from '../../hooks/useTheme.js'
import { Button } from '../ui/Button.jsx'
import { IconMoon, IconPlus, IconSearch, IconSun } from '../ui/Icons.jsx'
import { Logo } from './Logo.jsx'
import './Topbar.css'

/**
 * Global search, "New Application" button and theme toggle.
 * The search text is controlled by the parent, so the Applications page can
 * read the same value (wired in Phase 5).
 */
export function Topbar({ search, onSearchChange, onNewApplication }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === THEME.DARK
  const themeLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <header className="topbar glass">
      <div className="topbar__brand">
        <Logo collapsible />
      </div>

      <div className="topbar__search">
        <IconSearch className="topbar__search-icon" size={18} />
        <input
          id="global-search"
          type="search"
          className="topbar__search-input"
          placeholder="Search company, role, tags..."
          aria-label="Search applications"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="topbar__actions">
        <Button leftIcon={<IconPlus size={18} />} onClick={onNewApplication}>
          <span className="topbar__new-label">New Application</span>
        </Button>
        <Button variant="ghost" iconOnly aria-label={themeLabel} title={themeLabel} onClick={toggleTheme}>
          {isDark ? <IconSun /> : <IconMoon />}
        </Button>
      </div>
    </header>
  )
}