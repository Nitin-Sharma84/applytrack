import { Field } from './Field.jsx'

/**
 * Labeled text input. Pass `label` (or aria-label with hideLabel), and `error`
 * as a string to show an inline error. Any other prop goes to the <input>.
 */
export function Input({ label, hideLabel, error, hint, required, id, type = 'text', ...rest }) {
  return (
    <Field id={id} label={label} hideLabel={hideLabel} error={error} hint={hint} required={required}>
      {(controlProps) => <input type={type} {...rest} {...controlProps} />}
    </Field>
  )
}