import { useCallback, useMemo, useState } from 'react'
import { STATUSES } from '../../constants/statuses.js'
import { groupByStatus } from '../../utils/boardHelpers.js'
import { KanbanColumn } from './KanbanColumn.jsx'
import './KanbanBoard.css'

/**
 * Six status columns with native HTML5 drag and drop.
 * @param {{ applications: object[], followUpDays: number,
 *           onEdit: (application: object) => void,
 *           onMove: (application: object, status: string) => void }} props
 */
export function KanbanBoard({ applications, followUpDays, onEdit, onMove }) {
  const [draggingId, setDraggingId] = useState(null)
  const [overStatus, setOverStatus] = useState(null)

  const columns = useMemo(() => groupByStatus(applications), [applications])

  const handleCardDragStart = useCallback((event, id) => {
    // The id travels inside the drag event, so the drop target knows which card arrived.
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'move'
    // Styling the dragged card is delayed by one tick. Changing it inside
    // dragstart can cancel the drag in some browsers.
    setTimeout(() => setDraggingId(id), 0)
  }, [])

  const clearDragState = useCallback(() => {
    setDraggingId(null)
    setOverStatus(null)
  }, [])

  function handleDrop(event, status) {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    const application = applications.find((item) => item.id === id)
    if (application) onMove(application, status)
    // Cleared here too: after a successful drop the card is re-created in its
    // new column, so its own dragend event may never reach us.
    clearDragState()
  }

  return (
    <div className="kanban">
      {STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          applications={columns[status]}
          isOver={overStatus === status}
          draggingId={draggingId}
          followUpDays={followUpDays}
          onDragOver={setOverStatus}
          onDragLeave={() => setOverStatus(null)}
          onDrop={handleDrop}
          onCardDragStart={handleCardDragStart}
          onCardDragEnd={clearDragState}
          onEdit={onEdit}
          onMove={onMove}
        />
      ))}
    </div>
  )
}