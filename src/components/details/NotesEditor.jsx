import { useState } from 'react'
import { Button } from '../ui/Button.jsx'
import { Textarea } from '../ui/Textarea.jsx'
import './ApplicationDrawer.css'

/** Notes box. The Save button is enabled only when the text actually changed. */
export function NotesEditor({ notes, onSave }) {
  const [draft, setDraft] = useState(notes)
  const isChanged = draft.trim() !== notes

  return (
    <div className="notes-editor">
      <Textarea
        label="Notes"
        hideLabel
        rows={4}
        placeholder="Interview tips, contacts, questions to ask..."
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Button size="sm" disabled={!isChanged} onClick={() => onSave(draft)}>
        Save notes
      </Button>
    </div>
  )
}