import { useMemo } from 'react'
import { ApplicationCard } from '../components/applications/ApplicationCard.jsx'
import { ApplicationTable } from '../components/applications/ApplicationTable.jsx'
import { FilterBar } from '../components/applications/FilterBar.jsx'
import { Button } from '../components/ui/Button.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { useApplicationForm } from '../hooks/useApplicationForm.js'
import { useApplications } from '../hooks/useApplications.js'
import { useDeleteApplication } from '../hooks/useDeleteApplication.js'
import { useFilteredApplications } from '../hooks/useFilteredApplications.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { useSampleData } from '../hooks/useSampleData.js'
import { useSettings } from '../hooks/useSettings.js'
import { useToast } from '../hooks/useToast.js'
import { exportApplicationsCsv } from '../services/exportService.js'
import { getAllTags } from '../utils/tagHelpers.js'
import './ApplicationsPage.css'

/**
 * @param {{ filters: object, onFiltersChange: (changes: object) => void, onClearFilters: () => void }} props
 * Filter state lives in App, because the top bar search box shares it.
 */
export function ApplicationsPage({ filters, onFiltersChange, onClearFilters }) {
  const { applications, changeStatus } = useApplications()
  const { settings } = useSettings()
  const { openNewApplication, openEditApplication } = useApplicationForm()
  const deleteWithUndo = useDeleteApplication()
  const { loadSampleData } = useSampleData()
  const toast = useToast()
  const isWide = useMediaQuery('(min-width: 768px)')
  const { results, statusCounts, matchCount } = useFilteredApplications(applications, filters)
  const tags = useMemo(() => getAllTags(applications), [applications])

  function handleExportCsv() {
    exportApplicationsCsv(results)
    toast.success(`Exported ${results.length} applications`)
  }

  if (applications.length === 0) {
    return (
      <section className="applications-page__panel glass">
        <EmptyState
          title="No applications yet"
          description="Add your first application, or load sample data to explore the app."
          actionLabel="Add application"
          onAction={openNewApplication}
          secondaryLabel="Load sample data"
          onSecondaryAction={loadSampleData}
        />
      </section>
    )
  }

  const listProps = {
    followUpDays: settings.followUpDays,
    onEdit: openEditApplication,
    onDelete: deleteWithUndo,
    onChangeStatus: changeStatus,
  }

  return (
    <div className="applications-page">
      <header className="applications-page__header">
        <div>
          <h1 className="applications-page__title">Applications</h1>
          <p className="text-muted">Change a status right from the list. Click a company to see its details.</p>
        </div>
        {/* Exports exactly what is on screen: the filtered and sorted list. */}
        <Button variant="secondary" disabled={results.length === 0} onClick={handleExportCsv}>
          Export CSV
        </Button>
      </header>

      <FilterBar
        filters={filters}
        tags={tags}
        statusCounts={statusCounts}
        matchCount={matchCount}
        resultCount={results.length}
        totalCount={applications.length}
        onChange={onFiltersChange}
        onClear={onClearFilters}
      />

      {results.length === 0 ? (
        <section className="applications-page__panel glass">
          <EmptyState
            title="No applications match"
            description="Try a different search word, or clear the filters."
            actionLabel="Clear filters"
            onAction={onClearFilters}
          />
        </section>
      ) : isWide ? (
        <ApplicationTable applications={results} {...listProps} />
      ) : (
        <ul className="applications-page__cards">
          {results.map((application) => (
            <li key={application.id}>
              <ApplicationCard application={application} {...listProps} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}