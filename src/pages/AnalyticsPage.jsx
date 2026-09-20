import { useMemo } from 'react'
import { DonutChart } from '../components/analytics/DonutChart.jsx'
import { FunnelChart } from '../components/analytics/FunnelChart.jsx'
import { InsightsList } from '../components/analytics/InsightsList.jsx'
import { OfferComparison } from '../components/analytics/OfferComparison.jsx'
import { SourceTable } from '../components/analytics/SourceTable.jsx'
import { WeeklyBarChart } from '../components/analytics/WeeklyBarChart.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { STATUS } from '../constants/statuses.js'
import { useApplicationForm } from '../hooks/useApplicationForm.js'
import { useApplications } from '../hooks/useApplications.js'
import { useSampleData } from '../hooks/useSampleData.js'
import { useSettings } from '../hooks/useSettings.js'
import {
  getFunnel,
  getInsights,
  getSourceStats,
  getStatusDistribution,
  getWeeklyCounts,
} from '../utils/analyticsHelpers.js'
import './AnalyticsPage.css'

export function AnalyticsPage() {
  const { applications } = useApplications()
  const { settings } = useSettings()
  const { openNewApplication } = useApplicationForm()
  const { loadSampleData } = useSampleData()

  // Everything is derived from the applications in one memo (nothing is stored).
  // "Today" is read inside, so the charts refresh whenever the data changes.
  const analytics = useMemo(() => {
    const today = new Date()
    return {
      funnel: getFunnel(applications),
      weeks: getWeeklyCounts(applications, today),
      distribution: getStatusDistribution(applications),
      sources: getSourceStats(applications),
      insights: getInsights(applications, settings.followUpDays, today),
      offers: applications.filter((application) => application.status === STATUS.OFFER),
    }
  }, [applications, settings.followUpDays])

  if (applications.length === 0) {
    return (
      <section className="analytics-page__panel glass">
        <EmptyState
          title="No data to analyse yet"
          description="Charts appear once you add applications. Load sample data to see how they look."
          actionLabel="Add application"
          onAction={openNewApplication}
          secondaryLabel="Load sample data"
          onSecondaryAction={loadSampleData}
        />
      </section>
    )
  }

  return (
    <div className="analytics-page">
      <header>
        <h1 className="analytics-page__title">Analytics</h1>
        <p className="text-muted">See how your search is going and what to improve.</p>
      </header>

      <InsightsList insights={analytics.insights} />

      <div className="analytics-page__grid">
        <FunnelChart stages={analytics.funnel} />
        <DonutChart items={analytics.distribution} total={applications.length} />
      </div>

      <WeeklyBarChart weeks={analytics.weeks} />
      <SourceTable rows={analytics.sources} />
      <OfferComparison offers={analytics.offers} />
    </div>
  )
}