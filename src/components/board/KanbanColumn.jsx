import { useId } from 'react'
import { getStatusSlug } from '../../constants/statuses.js'
import { KanbanCard } from './KanbanCard.jsx'
import './KanbanBoard.css'

export function KanbanColumn({
  status,
  applications,
  isOver,
  draggingId,
  followUpDays,
  onDragOver,
  onDragLeave,
  onDrop,
  onCardDragStart,
  onCardDragEnd,
  onEdit,
  onMove,
}) {
  const titleId = useId()

  function handleDragOver(event) {
    // Without preventDefault() the browser refuses the drop. This is the key line of HTML5 drag and drop.
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    onDragOver(status)
  }

  function handleDragLeave(event) {
    // dragleave also fires when the pointer moves onto a child card. Ignore that case.
    if (!event.currentTarget.contains(event.relatedTarget)) onDragLeave()
  }

  return (
    <section
      className={`kanban-column kanban-column--${getStatusSlug(status)}${isOver ? ' kanban-column--over' : ''}`}
      aria-labelledby={titleId}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(event) => onDrop(event, status)}
    >
      <h2 id={titleId} className="kanban-column__title">
        <span className="kanban-column__dot" aria-hidden="true" />
        {status}
        <span className="kanban-column__count">{applications.length}</span>
      </h2>

      {applications.length === 0 ? (
        <p className="kanban-column__empty">{isOver ? 'Drop here' : 'No applications'}</p>
      ) : (
        <ul className="kanban-column__list">
          {applications.map((application) => (
            <li key={application.id}>
              <KanbanCard
                application={application}
                followUpDays={followUpDays}
                isDragging={draggingId === application.id}
                onDragStart={onCardDragStart}
                onDragEnd={onCardDragEnd}
                onEdit={onEdit}
                onMove={onMove}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}