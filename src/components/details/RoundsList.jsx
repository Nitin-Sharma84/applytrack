import { useState } from 'react'
import { ROUND_RESULT } from '../../constants/options.js'
import { sortRounds } from '../../utils/detailHelpers.js'
import { formatDate } from '../../utils/formatters.js'
import { Badge } from '../ui/Badge.jsx'
import { Button } from '../ui/Button.jsx'
import { IconEdit, IconPlus, IconTrash } from '../ui/Icons.jsx'
import { RoundForm } from './RoundForm.jsx'
import './ApplicationDrawer.css'

const NEW_ROUND = 'new'

const RESULT_TONE = {
  [ROUND_RESULT.PENDING]: 'neutral',
  [ROUND_RESULT.CLEARED]: 'success',
  [ROUND_RESULT.NOT_CLEARED]: 'danger',
}

/**
 * @param {{ rounds: object[], onAdd: (values: object) => void,
 *           onUpdate: (roundId: string, values: object) => void,
 *           onDelete: (roundId: string) => void }} props
 */
export function RoundsList({ rounds, onAdd, onUpdate, onDelete }) {
  // null = nothing open, NEW_ROUND = the add form is open, otherwise the id of the round being edited
  const [editingId, setEditingId] = useState(null)

  function handleSave(values) {
    if (editingId === NEW_ROUND) onAdd(values)
    else onUpdate(editingId, values)
    setEditingId(null)
  }

  return (
    <div className="rounds">
      {rounds.length === 0 && editingId !== NEW_ROUND && (
        <p className="details__empty">No rounds yet. Add one when a test or interview is scheduled.</p>
      )}

      <ul className="rounds__list">
        {sortRounds(rounds).map((round) => (
          <li key={round.id} className="rounds__item">
            {editingId === round.id ? (
              <RoundForm
                initialValues={round}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="rounds__info">
                  <strong>{round.type}</strong>
                  <span className="text-muted">
                    {[round.date ? formatDate(round.date) : 'No date', round.mode].join(' · ')}
                  </span>
                  {round.notes && <span className="rounds__notes">{round.notes}</span>}
                </div>
                <Badge tone={RESULT_TONE[round.result]}>{round.result}</Badge>
                <div className="rounds__actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    aria-label={`Edit ${round.type} round`}
                    onClick={() => setEditingId(round.id)}
                  >
                    <IconEdit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    aria-label={`Delete ${round.type} round`}
                    onClick={() => onDelete(round.id)}
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {editingId === NEW_ROUND ? (
        <RoundForm onSave={handleSave} onCancel={() => setEditingId(null)} />
      ) : (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<IconPlus size={16} />}
          onClick={() => setEditingId(NEW_ROUND)}
        >
          Add round
        </Button>
      )}
    </div>
  )
}