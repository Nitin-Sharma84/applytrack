import { useEffect, useId, useRef, useState } from 'react'
import { JOB_TYPES, PRIORITIES, SOURCES, WORK_MODES } from '../../constants/options.js'
import { STATUSES } from '../../constants/statuses.js'
import { applicationToFormValues, createEmptyFormValues } from '../../utils/applicationHelpers.js'
import { hasErrors, validateApplicationForm } from '../../utils/validators.js'
import { IconChevronDown } from '../ui/Icons.jsx'
import { Input } from '../ui/Input.jsx'
import { Select } from '../ui/Select.jsx'
import { Textarea } from '../ui/Textarea.jsx'
import './ApplicationForm.css'

// Errors on these fields live inside "More details", so it must open to show them.
const DETAILS_ERROR_FIELDS = ['ctcLpa', 'jobLink', 'contactEmail']
// If an edited application already has any of these, start with the details open.
const DETAILS_DATA_FIELDS = [
  'location',
  'ctcLpa',
  'jobLink',
  'contactName',
  'contactEmail',
  'resumeVersion',
  'tags',
  'notes',
]

/**
 * Controlled form for adding or editing an application.
 * Validation runs on submit (not on every keystroke, which feels naggy), and
 * an error disappears as soon as the user edits that field.
 *
 * @param {{ id: string, application: object|null, onSubmit: (values: Record<string, string>) => void }} props
 * The submit button lives in the Modal footer and points at this form via the `form` attribute.
 */
export function ApplicationForm({ id, application, onSubmit }) {
  const [values, setValues] = useState(() =>
    application ? applicationToFormValues(application) : createEmptyFormValues(),
  )
  const [errors, setErrors] = useState({})
  const [showDetails, setShowDetails] = useState(() =>
    DETAILS_DATA_FIELDS.some((field) => values[field] !== ''),
  )
  const [submitAttempts, setSubmitAttempts] = useState(0)

  const formRef = useRef(null)
  const detailsId = useId()

  // After a failed submit, move focus to the first invalid field.
  // It is an effect (not inside the handler) because the invalid field may
  // only exist after React re-renders with the details section opened.
  useEffect(() => {
    if (submitAttempts === 0) return
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
  }, [submitAttempts])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))

    // Deadline is checked against Applied date, so editing either clears the deadline error.
    const cleared = name === 'appliedDate' ? { deadline: undefined } : {}
    setErrors((previous) => ({ ...previous, ...cleared, [name]: undefined }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateApplicationForm(values)

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors)
      if (DETAILS_ERROR_FIELDS.some((field) => field in validationErrors)) setShowDetails(true)
      setSubmitAttempts((count) => count + 1)
      return
    }
    onSubmit(values)
  }

  // Shared props for every field: name, current value, change handler.
  const bind = (name) => ({ name, value: values[name], onChange: handleChange, error: errors[name] })

  return (
    <form id={id} ref={formRef} className="application-form" noValidate onSubmit={handleSubmit}>
      <div className="application-form__grid">
        <Input
          label="Company"
          required
          placeholder="e.g. TCS, Infosys, Wipro"
          autoComplete="off"
          data-autofocus
          {...bind('company')}
        />
        <Input
          label="Role"
          required
          placeholder="e.g. Frontend Developer"
          autoComplete="off"
          {...bind('role')}
        />
        <Select label="Status" options={STATUSES} {...bind('status')} />
        <Input label="Deadline" type="date" hint="Last date to apply" {...bind('deadline')} />
      </div>

      <button
        type="button"
        className="application-form__toggle"
        aria-expanded={showDetails}
        aria-controls={showDetails ? detailsId : undefined}
        onClick={() => setShowDetails((isOpen) => !isOpen)}
      >
        <IconChevronDown
          size={18}
          className={`application-form__toggle-icon${showDetails ? ' application-form__toggle-icon--open' : ''}`}
        />
        {showDetails ? 'Hide extra details' : 'Add more details (optional)'}
      </button>

      {showDetails && (
        <div id={detailsId} className="application-form__details">
          <div className="application-form__grid">
            <Select label="Job type" options={JOB_TYPES} {...bind('jobType')} />
            <Select label="Work mode" options={WORK_MODES} {...bind('workMode')} />
            <Select label="Source" options={SOURCES} {...bind('source')} />
            <Select label="Priority" options={PRIORITIES} {...bind('priority')} />
            <Input label="Applied on" type="date" {...bind('appliedDate')} />
            <Input
              label="Package (LPA)"
              inputMode="decimal"
              placeholder="e.g. 6.5"
              autoComplete="off"
              {...bind('ctcLpa')}
            />
            <Input label="Location" placeholder="e.g. Mumbai" {...bind('location')} />
            <Input
              label="Resume version"
              placeholder="e.g. v3 Web Dev"
              autoComplete="off"
              {...bind('resumeVersion')}
            />
            <Input label="Contact name" autoComplete="off" {...bind('contactName')} />
            <Input
              label="Contact email"
              type="email"
              autoComplete="off"
              {...bind('contactEmail')}
            />
          </div>
          <Input
            label="Job link"
            type="url"
            placeholder="https://..."
            autoComplete="off"
            {...bind('jobLink')}
          />
          <Input
            label="Tags"
            hint="Separate with commas, e.g. react, remote"
            autoComplete="off"
            {...bind('tags')}
          />
          <Textarea label="Notes" placeholder="Anything worth remembering..." {...bind('notes')} />
        </div>
      )}
    </form>
  )
}