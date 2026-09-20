import { useId } from 'react'
import { IconInfo } from '../ui/Icons.jsx'
import './Analytics.css'

/** @param {{ insights: string[] }} props */
export function InsightsList({ insights }) {
  const titleId = useId()

  return (
    <section className="analytics-card glass" aria-labelledby={titleId}>
      <h2 id={titleId} className="analytics-card__title">
        Insights
      </h2>
      <ul className="insights">
        {insights.map((text) => (
          <li key={text} className="insights__item">
            <IconInfo size={18} />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}