import { useState } from 'react'
import { ROUND_MODES, ROUND_RESULTS, ROUND_TYPES } from '../../constants/options.js'
import { createEmptyRoundValues } from '../../utils/detailHelpers.js'
import { Button } from '../ui/Button.jsx'
import { Input } from '../ui/Input.jsx'
import { Select } from '../ui/Select.jsx'
import './ApplicationDrawer.css'

/** Small form used for both "Add round" and "Edit round". Nothing is required. */
export function RoundForm({ initialValues, onSave, onCancel }) {
  const [values, setValues] = useState(() => initialValues ?? createEmptyRoundValues())

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave(values)
  }

  return (
    <form className="round-form" onSubmit={handleSubmit}>
      <div className="round-form__grid">
        <Select
          label="Round"
          name="type"
          options={ROUND_TYPES}
          value={values.type}
          onChange={handleChange}
          autoFocus
        />
        <Input label="Date" name="date" type="date" value={values.date} onChange={handleChange} />
        <Select label="Mode" name="mode" options={ROUND_MODES} value={values.mode} onChange={handleChange} />
        <Select
          label="Result"
          name="result"
          options={ROUND_RESULTS}
          value={values.result}
          onChange={handleChange}
        />
      </div>
      <Input
        label="Notes"
        name="notes"
        placeholder="e.g. Bring resume, 45 minutes"
        autoComplete="off"
        value={values.notes}
        onChange={handleChange}
      />
      <div className="round-form__actions">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm">
          Save round
        </Button>
      </div>
    </form>
  )
}