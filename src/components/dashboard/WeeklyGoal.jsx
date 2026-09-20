import { useId, useMemo } from 'react'
import { useSettings } from '../../hooks/useSettings.js'
import { useToast } from '../../hooks/useToast.js'
import { getWeeklyCounts } from '../../utils/analyticsHelpers.js'
import { buildWeeklyReport, getWeekSummary } from '../../utils/reportHelpers.js'
import { toPercent } from '../../utils/statsHelpers.js'
import { Button } from '../ui/Button.jsx'
import { ProgressRing } from '../ui/ProgressRing.jsx'
import './WeeklyGoal.css'

function compareWithLastWeek(thisWeek, lastWeek) {
  const difference = thisWeek - lastWeek
  if (difference === 0) return `Same as last week (${lastWeek}).`
  return `${Math.abs(difference)} ${difference > 0 ? 'more' : 'fewer'} than last week (${lastWeek}).`
}

/** Applications sent this week (Monday to Sunday) against the goal from Settings. */
export function WeeklyGoal({ applications }) {
  const { settings } = useSettings()
  const toast = useToast()
  const titleId = useId()
  const goal = settings.weeklyGoal

  const { thisWeek, lastWeek, summary } = useMemo(() => {
    const today = new Date()
    const [previous, current] = getWeeklyCounts(applications, today, 2)
    return {
      thisWeek: current.count,
      lastWeek: previous.count,
      summary: getWeekSummary(applications, settings.followUpDays, today),
    }
  }, [applications, settings.followUpDays])

  async function handleCopyReport() {
    try {
      await navigator.clipboard.writeText(buildWeeklyReport(summary))
      toast.success('Weekly report copied')
    } catch {
      // Clipboard access needs https or localhost, and can be blocked by the browser.
      toast.error('Could not copy. Your browser blocked clipboard access.')
    }
  }

  const isGoalReached = thisWeek >= goal

  return (
    <section className="weekly-goal glass" aria-labelledby={titleId}>
      <ProgressRing percent={toPercent(thisWeek, goal)} label="Weekly goal progress">
        <span className="weekly-goal__count tabular-nums">
          {thisWeek}
          <span className="weekly-goal__goal"> / {goal}</span>
        </span>
        <span className="weekly-goal__caption">this week</span>
      </ProgressRing>

      <div className="weekly-goal__text">
        <h2 id={titleId} className="weekly-goal__title">
          Weekly goal
        </h2>
        <p>
          {isGoalReached
            ? 'Goal reached. Great work!'
            : `${goal - thisWeek} more to reach your goal of ${goal} applications.`}
        </p>
        <p className="text-muted">{compareWithLastWeek(thisWeek, lastWeek)}</p>
        <div>
          <Button variant="secondary" size="sm" onClick={handleCopyReport}>
            Copy weekly report
          </Button>
        </div>
      </div>
    </section>
  )
}