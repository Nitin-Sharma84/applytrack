import { useState } from 'react'
import './styles/preview.css'
import { THEMES, UNDO_TIMEOUT_MS } from './constants/options.js'
import { STATUSES, getStatusSlug } from './constants/statuses.js'
import { useApplications } from './hooks/useApplications.js'
import { useSettings } from './hooks/useSettings.js'
import { useToast, useToastList } from './hooks/useToast.js'
import { createEmptyFormValues } from './utils/applicationHelpers.js'

export function App() {
  const { applications, addApplication, changeStatus, deleteApplication, restoreApplication } =
    useApplications()
  const { settings, updateSettings } = useSettings()
  const toast = useToast()
  const toasts = useToastList()
  const [shouldCrash, setShouldCrash] = useState(false)

  // TEMPORARY: proves the ErrorBoundary catches render errors.
  if (shouldCrash) throw new Error('Test crash from the Phase 2 demo')

  function handleAdd() {
    addApplication({
      ...createEmptyFormValues(),
      company: `Company ${applications.length + 1}`,
      role: 'Frontend Intern',
    })
    toast.success('Application added')
  }

  function handleDelete(application) {
    deleteApplication(application.id)
    toast.info(`${application.company} deleted`, {
      duration: UNDO_TIMEOUT_MS,
      action: { label: 'Undo', onClick: () => restoreApplication(application) },
    })
  }

  function handleToastAction(item) {
    item.action.onClick()
    toast.dismissToast(item.id)
  }

  return (
    <main className="preview container">
      <header className="preview__header">
        <div>
          <h1 className="preview__title">ApplyTrack</h1>
          <p className="preview__subtitle">Phase 2 check: reducer, contexts and error boundary.</p>
        </div>
        <div>
          <label className="preview__text" htmlFor="phase2-theme">
            Theme:{' '}
          </label>
          <select
            id="phase2-theme"
            value={settings.theme}
            onChange={(event) => updateSettings({ theme: event.target.value })}
          >
            {THEMES.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="preview__card glass" aria-labelledby="phase2-apps-title">
        <h2 id="phase2-apps-title" className="preview__card-title">
          Applications ({applications.length})
        </h2>
        <div className="preview__chips">
          <button type="button" className="preview__btn" onClick={handleAdd}>
            Add test application
          </button>
          <button type="button" className="preview__btn" onClick={() => setShouldCrash(true)}>
            Crash test
          </button>
        </div>
        <ul className="preview__chips">
          {applications.map((application) => (
            <li
              key={application.id}
              className={`preview__chip preview__chip--${getStatusSlug(application.status)}`}
            >
              {application.company}
              <select
                aria-label={`Status of ${application.company}`}
                value={application.status}
                onChange={(event) => changeStatus(application.id, event.target.value)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => handleDelete(application)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="preview__card glass" aria-labelledby="phase2-toast-title">
        <h2 id="phase2-toast-title" className="preview__card-title">
          Toasts (temporary list, real UI in Phase 3)
        </h2>
        <ul className="preview__chips">
          {toasts.map((item) => (
            <li key={item.id} className="preview__chip preview__chip--applied">
              {item.type}: {item.message}
              {item.action && (
                <button type="button" onClick={() => handleToastAction(item)}>
                  {item.action.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}