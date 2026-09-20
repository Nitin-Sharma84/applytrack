import { useCallback } from 'react'
import { KanbanBoard } from '../components/board/KanbanBoard.jsx'
import { Button } from '../components/ui/Button.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { ALL_FILTER } from '../constants/options.js'
import { useApplicationForm } from '../hooks/useApplicationForm.js'
import { useApplications } from '../hooks/useApplications.js'
import { useFilteredApplications } from '../hooks/useFilteredApplications.js'
import { useSampleData } from '../hooks/useSampleData.js'
import { useSettings } from '../hooks/useSettings.js'
import { useToast } from '../hooks/useToast.js'
import './BoardPage.css'

export function BoardPage({ filters, onClearFilters }) {
  const { applications, changeStatus } = useApplications()
  const { settings } = useSettings()
  const { openNewApplication, openEditApplication } = useApplicationForm()
  const { loadSampleData } = useSampleData()
  const toast = useToast()

  // The board shows every status as a column, so the status tab of the list page is ignored here.
  const { results, matchCount } = useFilteredApplications(applications, {
    ...filters,
    status: ALL_FILTER,
  })

  // One move function for both ways: drag and drop, and the status menu on the card.
  // The toast also tells screen reader users what happened.
  const moveApplication = useCallback(
    (application, status) => {
      if (application.status === status) return
      changeStatus(application.id, status)
      toast.success(`${application.company} moved to ${status}`)
    },
    [changeStatus, toast],
  )

  if (applications.length === 0) {
    return (
      <section className="board-page__panel glass">
        <EmptyState
          title="Your board is empty"
          description="Add an application and it will appear in the right column."
          actionLabel="Add application"
          onAction={openNewApplication}
          secondaryLabel="Load sample data"
          onSecondaryAction={loadSampleData}
        />
      </section>
    )
  }

  return (
    <div className="board-page">
      <header>
        <h1 className="board-page__title">Board</h1>
        <p className="text-muted">
          Drag a card to another column to change its status. You can also use the menu on each card.
        </p>
      </header>

      {matchCount !== applications.length && (
        <p className="board-page__filtered">
          Showing {matchCount} of {applications.length} applications.
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        </p>
      )}

      <KanbanBoard
        applications={results}
        followUpDays={settings.followUpDays}
        onEdit={openEditApplication}
        onMove={moveApplication}
      />
    </div>
  )
}