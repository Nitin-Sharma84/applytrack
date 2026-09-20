import { Field } from './Field.jsx'
import { IconChevronDown } from './Icons.jsx'

const toOption = (option) =>
  typeof option === 'string' ? { value: option, label: option } : option

/**
 * @param {{ options: (string | { value: string, label: string })[], placeholder?: string }} props
 * Other props (value, onChange, ...) go to the <select>.
 */
export function Select({
  label,
  hideLabel,
  error,
  hint,
  required,
  id,
  options,
  placeholder,
  ...rest
}) {
  return (
    <Field id={id} label={label} hideLabel={hideLabel} error={error} hint={hint} required={required}>
      {(controlProps) => (
        <div className="field__select-wrap">
          <select {...rest} {...controlProps}>
            {placeholder !== undefined && <option value="">{placeholder}</option>}
            {options.map((option) => {
              const { value, label: optionLabel } = toOption(option)
              return (
                <option key={value} value={value}>
                  {optionLabel}
                </option>
              )
            })}
          </select>
          <IconChevronDown className="field__select-icon" size={18} />
        </div>
      )}
    </Field>
  )
}