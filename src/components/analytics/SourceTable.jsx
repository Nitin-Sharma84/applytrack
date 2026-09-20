import { useId } from 'react'
import './Analytics.css'

/** @param {{ rows: { source: string, applied: number, interviews: number, offers: number, interviewRate: number }[] }} props */
export function SourceTable({ rows }) {
  const titleId = useId()

  return (
    <section className="analytics-card glass" aria-labelledby={titleId}>
      <h2 id={titleId} className="analytics-card__title">
        Which sources work best
      </h2>
      {rows.length === 0 ? (
        <p className="analytics-card__note">Applications you have sent will be grouped by source here.</p>
      ) : (
        <div className="source-table__wrap">
          <table className="source-table">
            <thead>
              <tr>
                <th scope="col">Source</th>
                <th scope="col">Applied</th>
                <th scope="col">Interviews</th>
                <th scope="col">Offers</th>
                <th scope="col">Interview rate</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.source}>
                  <th scope="row">{row.source}</th>
                  <td>{row.applied}</td>
                  <td>{row.interviews}</td>
                  <td>{row.offers}</td>
                  <td>{row.interviewRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}