import { useMemo } from 'react'
import { StatCard } from '../components/dashboard/StatCard.jsx'
import { UpcomingList } from '../components/dashboard/UpcomingList.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { IconAlertCircle, IconCalendar, IconClock } from '../components/ui/Icons.jsx'
import { useApplicationForm } from '../hooks/useApplicationForm.js'
import { useApplications } from '../hooks/useApplications.js'
import { useSampleData } from '../hooks/useSampleData.js'
import { useSettings } from '../hooks/useSettings.js'
import { getDaysSinceUpdate, getDaysToDeadline } from '../utils/applicationHelpers.js'
import { formatDeadlineCountdown, pluralize } from '../utils/formatters.js'
import {
  getOverviewStats,
  getReminders,
  getUpcomingDeadlines,
  getUpcomingRounds,
} from '../utils/statsHelpers.js'
import './DashboardPage.css'
import { useApplicationDrawer } from '../hooks/useApplicationDrawer.js'
import { WeeklyGoal } from '../components/dashboard/WeeklyGoal.jsx'

function formatDaysAway(days) {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

export function DashboardPage() {
  const { applications } = useApplications()
  const { settings } = useSettings()
  const { openNewApplication } = useApplicationForm()
  const { openApplicationDetails } = useApplicationDrawer()
  const { loadSampleData, clearAllApplications } = useSampleData()

  const stats = useMemo(() => getOverviewStats(applications), [applications])

  // "Today" is read inside the memo: the dashboard recalculates only when the data or settings change.
  const { deadlines, rounds, reminders } = useMemo(() => {
    const today = new Date()
    return {
      deadlines: getUpcomingDeadlines(applications, today),
      rounds: getUpcomingRounds(applications, today),
      reminders: getReminders(applications, settings.followUpDays, today),
    }
  }, [applications, settings.followUpDays])

  if (applications.length === 0) {
    return (
      <section className="dashboard__panel glass">
        <EmptyState
          title="Welcome to ApplyTrack"
          description="Add your first application to see deadlines, interviews and reminders here."
          actionLabel="Add application"
          onAction={openNewApplication}
          secondaryLabel="Load sample data"
          onSecondaryAction={loadSampleData}
        />
      </section>
    )
  }

  const reminderItems = [
    ...reminders.urgent.map((application) => ({
      id: `urgent-${application.id}`,
      title: application.company,
      subtitle: application.role,
      badge: (
        <Badge tone="warning" icon={<IconAlertCircle size={14} />}>
          Urgent · {formatDeadlineCountdown(getDaysToDeadline(application))}
        </Badge>
      ),
      onSelect: () => openApplicationDetails(application),
    })),
    ...reminders.followUps.map((application) => {
      const quietDays = getDaysSinceUpdate(application)
      return {
        id: `follow-${application.id}`,
        title: application.company,
        subtitle: `${application.role} · no update for ${quietDays} ${pluralize(quietDays, 'day')}`,
        badge: (
          <Badge tone="info" icon={<IconClock size={14} />}>
            Follow-up due
          </Badge>
        ),
        onSelect: () => openApplicationDetails(application),
      }
    }),
  ]

  const deadlineItems = deadlines.map((application) => {
    const days = getDaysToDeadline(application)
    return {
      id: application.id,
      title: application.company,
      subtitle: `${application.role} · ${application.status}`,
      badge: (
        <Badge tone={days <= 3 ? 'warning' : 'neutral'} icon={<IconCalendar size={14} />}>
          {formatDeadlineCountdown(days)}
        </Badge>
      ),
      onSelect: () => openApplicationDetails(application),
    }
  })

  const roundItems = rounds.map(({ application, round, daysAway }) => ({
    id: `${application.id}-${round.id}`,
    title: application.company,
    subtitle: `${round.type} round · ${round.mode}`,
    badge: (
      <Badge tone="primary" icon={<IconCalendar size={14} />}>
        {formatDaysAway(daysAway)}
      </Badge>
    ),
    onSelect: () => openApplicationDetails(application),
  }))

  return (
    <div className="dashboard">
      <header>
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="text-muted">Your placement search at a glance.</p>
      </header>

      <dl className="dashboard__stats">
        <StatCard label="Total" value={stats.total} tone="primary" />
        <StatCard label="Active" value={stats.active} tone="applied" hint="Applied, test or interview" />
        <StatCard label="Interviews" value={stats.interviews} tone="interview" />
        <StatCard label="Offers" value={stats.offers} tone="offer" />
        <StatCard label="Rejected" value={stats.rejected} tone="rejected" />
      </dl>

      <dl className="dashboard__rates">
        <StatCard
          label="Response rate"
          value={`${stats.responseRate}%`}
          hint={`Got any reply, out of ${stats.appliedCount} applied`}
          tone="neutral"
        />
        <StatCard
          label="Offer rate"
          value={`${stats.offerRate}%`}
          hint={`Offers, out of ${stats.appliedCount} applied`}
          tone="neutral"
        />
      </dl>
      <WeeklyGoal applications={applications} />
      <UpcomingList
        title="Reminders"
        icon={<IconAlertCircle size={20} />}
        items={reminderItems}
        emptyText="You are all caught up. Nothing needs your attention right now."
      />

      <div className="dashboard__columns">
        <UpcomingList
          title="Deadlines in the next 7 days"
          icon={<IconCalendar size={20} />}
          items={deadlineItems}
          emptyText="No deadlines this week."
        />
        <UpcomingList
          title="Interviews in the next 7 days"
          icon={<IconClock size={20} />}
          items={roundItems}
          emptyText="No interview rounds scheduled this week."
        />
      </div>

      <footer className="dashboard__data">
        <span>Just exploring?</span>
        <Button variant="ghost" size="sm" onClick={loadSampleData}>
          Load sample data
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAllApplications}>
          Clear all data
        </Button>
      </footer>
    </div>
  )
}