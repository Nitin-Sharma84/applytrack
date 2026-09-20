import { ApplicationCard } from '../components/applications/ApplicationCard.jsx'
import { ApplicationTable } from '../components/applications/ApplicationTable.jsx'
import { FilterBar } from '../components/applications/FilterBar.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { useApplicationForm } from '../hooks/useApplicationForm.js'
import { useApplications } from '../hooks/useApplications.js'
import { useDeleteApplication } from '../hooks/useDeleteApplication.js'
import { useFilteredApplications } from '../hooks/useFilteredApplications.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { useSampleData } from '../hooks/useSampleData.js'
import { useSettings } from '../hooks/useSettings.js'
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
  const isWide = useMediaQuery('(min-width: 768px)')
  const { results, statusCounts, matchCount } = useFilteredApplications(applications, filters)

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
      <header>
        <h1 className="applications-page__title">Applications</h1>
        <p className="text-muted">Change a status right from the list. Click a company to edit it.</p>
      </header>

      <FilterBar
        filters={filters}
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