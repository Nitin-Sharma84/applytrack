import { Field } from './Field.jsx'

export function Textarea({ label, hideLabel, error, hint, required, id, rows = 4, ...rest }) {
  return (
    <Field id={id} label={label} hideLabel={hideLabel} error={error} hint={hint} required={required}>
      {(controlProps) => <textarea rows={rows} {...rest} {...controlProps} />}
    </Field>
  )
}