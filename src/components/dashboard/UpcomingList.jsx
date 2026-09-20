import { useId } from 'react'
import './UpcomingList.css'

/**
 * A titled list of clickable items (used for Reminders, Upcoming deadlines and Upcoming interviews).
 * @param {{ title: string, icon?: import('react').ReactNode, emptyText: string,
 *   items: { id: string, title: string, subtitle: string, badge: import('react').ReactNode, onSelect: () => void }[] }} props
 */
export function UpcomingList({ title, icon = null, emptyText, items }) {
  const headingId = useId()

  return (
    <section className="upcoming-list glass" aria-labelledby={headingId}>
      <h2 id={headingId} className="upcoming-list__title">
        {icon}
        {title}
        {items.length > 0 && <span className="upcoming-list__count">{items.length}</span>}
      </h2>

      {items.length === 0 ? (
        <p className="upcoming-list__empty">{emptyText}</p>
      ) : (
        <ul className="upcoming-list__items">
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" className="upcoming-list__item" onClick={item.onSelect}>
                <span className="upcoming-list__text">
                  <span className="upcoming-list__primary truncate">{item.title}</span>
                  <span className="upcoming-list__secondary truncate">{item.subtitle}</span>
                </span>
                {item.badge}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}