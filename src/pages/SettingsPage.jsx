import { useRef, useState } from 'react'
import { NAV_ITEMS } from '../components/layout/navItems.js'
import { ImportDialog } from '../components/settings/ImportDialog.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Select } from '../components/ui/Select.jsx'
import { DEFAULT_VIEWS, THEME } from '../constants/options.js'
import { useApplications } from '../hooks/useApplications.js'
import { useSampleData } from '../hooks/useSampleData.js'
import { useSettings } from '../hooks/useSettings.js'
import { useToast } from '../hooks/useToast.js'
import { exportBackupJson } from '../services/exportService.js'
import { mergeApplications, parseBackup } from '../services/importService.js'
import './SettingsPage.css'

const MAX_IMPORT_BYTES = 5 * 1024 * 1024

const THEME_OPTIONS = [
  { value: THEME.SYSTEM, label: 'Match my device' },
  { value: THEME.LIGHT, label: 'Light' },
  { value: THEME.DARK, label: 'Dark' },
]

const VIEW_OPTIONS = DEFAULT_VIEWS.map((page) => ({
  value: page,
  label: NAV_ITEMS.find((item) => item.page === page).label,
}))

const FOLLOW_UP_CHOICES = [3, 5, 7, 10, 14, 21, 30]
const GOAL_CHOICES = [3, 5, 7, 10, 15, 20, 25, 30]

/** Preset list, plus the saved value if it is not a preset, so the dropdown never shows a wrong value. */
const toChoices = (presets, current, unit) =>
  [...new Set([...presets, current])]
    .sort((a, b) => a - b)
    .map((value) => ({ value: String(value), label: `${value} ${unit}` }))

export function SettingsPage({ onShowShortcuts }) {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { applications, replaceAllApplications } = useApplications()
  const { loadSampleData, clearAllApplications } = useSampleData()
  const toast = useToast()
  const fileInputRef = useRef(null)
  const [pendingImport, setPendingImport] = useState(null)

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = '' // lets the user pick the same file again later
    if (!file) return

    if (file.size > MAX_IMPORT_BYTES) {
      toast.error('This file is too large. The limit is 5 MB.')
      return
    }
    const result = parseBackup(await file.text())
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    setPendingImport(result)
  }

  function handleMerge() {
    replaceAllApplications(mergeApplications(applications, pendingImport.applications))
    toast.success(`Merged ${pendingImport.applications.length} applications`)
    setPendingImport(null)
  }

  function handleReplace() {
    replaceAllApplications(pendingImport.applications)
    toast.success(`Replaced your data with ${pendingImport.applications.length} applications`)
    setPendingImport(null)
  }

  return (
    <div className="settings-page">
      <header>
        <h1 className="settings-page__title">Settings</h1>
        <p className="text-muted">Everything is saved automatically in this browser.</p>
      </header>

      <section className="settings-card glass" aria-labelledby="settings-look">
        <h2 id="settings-look" className="settings-card__title">
          Look and behaviour
        </h2>
        <div className="settings-card__grid">
          <Select
            label="Theme"
            options={THEME_OPTIONS}
            value={settings.theme}
            onChange={(event) => updateSettings({ theme: event.target.value })}
          />
          <Select
            label="Open the app on"
            options={VIEW_OPTIONS}
            value={settings.defaultView}
            onChange={(event) => updateSettings({ defaultView: event.target.value })}
          />
          <Select
            label="Remind me to follow up after"
            hint="Applied, test or interview with no update"
            options={toChoices(FOLLOW_UP_CHOICES, settings.followUpDays, 'days')}
            value={String(settings.followUpDays)}
            onChange={(event) => updateSettings({ followUpDays: Number(event.target.value) })}
          />
          <Select
            label="Weekly goal"
            hint="Applications to send each week"
            options={toChoices(GOAL_CHOICES, settings.weeklyGoal, 'applications')}
            value={String(settings.weeklyGoal)}
            onChange={(event) => updateSettings({ weeklyGoal: Number(event.target.value) })}
          />
        </div>
        <div className="settings-card__actions">
          <Button variant="ghost" onClick={resetSettings}>
            Reset settings
          </Button>
          <Button variant="ghost" onClick={onShowShortcuts}>
            Keyboard shortcuts
          </Button>
        </div>
      </section>

      <section className="settings-card glass" aria-labelledby="settings-data">
        <h2 id="settings-data" className="settings-card__title">
          Your data
        </h2>
        <p className="text-muted">
          {applications.length} {applications.length === 1 ? 'application is' : 'applications are'} saved
          in this browser. Download a backup now and then, especially before clearing browser data.
        </p>
        <div className="settings-card__actions">
          <Button variant="secondary" onClick={() => exportBackupJson(applications)}>
            Download backup (JSON)
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Import backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={handleFileChange}
          />
          <Button variant="ghost" onClick={loadSampleData}>
            Load sample data
          </Button>
          <Button variant="danger" onClick={clearAllApplications}>
            Clear all data
          </Button>
        </div>
      </section>

      <ImportDialog
        result={pendingImport}
        currentCount={applications.length}
        onMerge={handleMerge}
        onReplace={handleReplace}
        onCancel={() => setPendingImport(null)}
      />
    </div>
  )
}