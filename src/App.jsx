import { useState } from 'react'
import './styles/preview.css'
import { DEFAULT_SETTINGS, SEARCH_DEBOUNCE_MS } from './constants/options.js'
import { STORAGE_KEYS } from './constants/storageKeys.js'
import { STATUSES, getStatusSlug } from './constants/statuses.js'
import { useDebounce } from './hooks/useDebounce.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { sanitizeSettings } from './services/storage.js'

export function App() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS)

  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS, {
    sanitize: sanitizeSettings,
  })

  // TEMPORARY: touches the DOM directly just to test dark mode.
  // Phase 3 replaces this with SettingsContext state.
  function handleToggleTheme() {
    const root = document.documentElement
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const current = root.dataset.theme ?? (systemPrefersDark ? 'dark' : 'light')
    root.dataset.theme = current === 'dark' ? 'light' : 'dark'
  }

  function handleIncreaseGoal() {
    setSettings((previous) => ({ ...previous, weeklyGoal: previous.weeklyGoal + 1 }))
  }

  function handleResetSettings() {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <main className="preview container">
      <header className="preview__header">
        <div>
          <h1 className="preview__title">ApplyTrack</h1>
          <p className="preview__subtitle">Phase 1 check: constants, debounce and localStorage hook.</p>
        </div>
        <button type="button" className="preview__btn" onClick={handleToggleTheme}>
          Toggle theme
        </button>
      </header>

      <section className="preview__card glass" aria-labelledby="preview-status-title">
        <h2 id="preview-status-title" className="preview__card-title">
          Statuses (from constants)
        </h2>
        <ul className="preview__chips">
          {STATUSES.map((status) => (
            <li key={status} className={`preview__chip preview__chip--${getStatusSlug(status)}`}>
              {status}
            </li>
          ))}
        </ul>
      </section>

      <section className="preview__card glass" aria-labelledby="preview-debounce-title">
        <h2 id="preview-debounce-title" className="preview__card-title">
          useDebounce
        </h2>
        <label className="preview__text" htmlFor="phase1-search">
          Type quickly in this box:
        </label>
        <input
          id="phase1-search"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <p className="preview__text">Live value: {search}</p>
        <p className="preview__text">
          Debounced value ({SEARCH_DEBOUNCE_MS} ms): {debouncedSearch}
        </p>
      </section>

      <section className="preview__card glass" aria-labelledby="preview-storage-title">
        <h2 id="preview-storage-title" className="preview__card-title">
          useLocalStorage
        </h2>
        <p className="preview__stat">Weekly goal: {settings.weeklyGoal}</p>
        <div className="preview__chips">
          <button type="button" className="preview__btn" onClick={handleIncreaseGoal}>
            Increase goal
          </button>
          <button type="button" className="preview__btn" onClick={handleResetSettings}>
            Reset settings
          </button>
        </div>
        <p className="preview__text">
          Increase the goal, then refresh the page. The number must stay.
        </p>
      </section>
    </main>
  )
}