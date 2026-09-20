import { useState } from 'react'
import { getChecklistProgress } from '../../utils/detailHelpers.js'
import { Button } from '../ui/Button.jsx'
import { IconTrash } from '../ui/Icons.jsx'
import { Input } from '../ui/Input.jsx'
import { ProgressBar } from '../ui/ProgressBar.jsx'
import './ApplicationDrawer.css'

/**
 * @param {{ items: object[], onAdd: (text: string) => void,
 *           onToggle: (itemId: string) => void, onDelete: (itemId: string) => void }} props
 */
export function PrepChecklist({ items, onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('')
  const progress = getChecklistProgress(items)

  function handleSubmit(event) {
    event.preventDefault()
    if (text.trim() === '') return
    onAdd(text)
    setText('')
  }

  return (
    <div className="checklist">
      {items.length > 0 && (
        <div>
          <ProgressBar value={progress.percent} label="Preparation progress" />
          <p className="checklist__summary">
            {progress.done} of {progress.total} done
          </p>
        </div>
      )}

      <ul className="checklist__list">
        {items.map((item) => (
          <li key={item.id} className="checklist__item">
            <label className="checklist__label">
              <input type="checkbox" checked={item.done} onChange={() => onToggle(item.id)} />
              <span className={`checklist__text${item.done ? ' checklist__text--done' : ''}`}>
                {item.text}
              </span>
            </label>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              aria-label={`Delete ${item.text}`}
              onClick={() => onDelete(item.id)}
            >
              <IconTrash size={16} />
            </Button>
          </li>
        ))}
      </ul>

      <form className="checklist__form" onSubmit={handleSubmit}>
        <Input
          label="New checklist item"
          hideLabel
          placeholder="e.g. Revise DBMS basics"
          autoComplete="off"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button type="submit" variant="secondary">
          Add
        </Button>
      </form>
    </div>
  )
}