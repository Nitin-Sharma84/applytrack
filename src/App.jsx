import './styles/preview.css'

// TEMPORARY: statuses will come from constants/statuses.js in Phase 1.
const PREVIEW_STATUSES = [
  { key: 'wishlist', label: 'Wishlist' },
  { key: 'applied', label: 'Applied' },
  { key: 'online-test', label: 'Online Test' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'rejected', label: 'Rejected' },
]

export function App() {
  // TEMPORARY: touches the DOM directly just to test dark mode.
  // Phase 3 replaces this with SettingsContext state + storage service.
  function handleToggleTheme() {
    const root = document.documentElement
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const current = root.dataset.theme ?? (systemPrefersDark ? 'dark' : 'light')
    root.dataset.theme = current === 'dark' ? 'light' : 'dark'
  }

  return (
    <main className="preview container">
      <header className="preview__header">
        <div>
          <h1 className="preview__title">ApplyTrack</h1>
          <p className="preview__subtitle">
            Phase 0 style check: tokens, fonts, background and theme.
          </p>
        </div>
        <button type="button" className="preview__btn" onClick={handleToggleTheme}>
          Toggle theme
        </button>
      </header>

      <section className="preview__card glass" aria-labelledby="preview-status-title">
        <h2 id="preview-status-title" className="preview__card-title">
          Status colors
        </h2>
        <ul className="preview__chips">
          {PREVIEW_STATUSES.map((status) => (
            <li key={status.key} className={`preview__chip preview__chip--${status.key}`}>
              {status.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="preview__card glass" aria-labelledby="preview-type-title">
        <h2 id="preview-type-title" className="preview__card-title">
          Typography and numbers
        </h2>
        <p className="preview__stat">1,234 / 87 / 12</p>
        <p className="preview__text">
          Heading font is Plus Jakarta Sans and body font is Inter. Numbers use
          tabular figures so columns line up in tables and stat cards.
        </p>
      </section>
    </main>
  )
}