import { useId } from 'react'
import { IconAlertCircle } from './Icons.jsx'
import './Field.css'

/**
 * Shared wrapper for Input, Select and Textarea: label, hint and error message.
 * `children` is a render function that receives the props the control must
 * spread (id, aria-invalid, aria-describedby...). So the label and the error
 * text are always wired to the control correctly, in one place.
 *
 * Errors use an icon plus text, never color alone.
 */
export function Field({ id, label, hideLabel = false, error, hint, required = false, children }) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const errorId = `${controlId}-error`
  const hintId = `${controlId}-hint`
  const showHint = Boolean(hint) && !error

  const controlProps = {
    id: controlId,
    className: `field__control${error ? ' field__control--invalid' : ''}`,
    'aria-invalid': error ? true : undefined,
    'aria-required': required ? true : undefined,
    'aria-describedby': error ? errorId : showHint ? hintId : undefined,
  }

  return (
    <div className="field">
      {label && (
        <label className={hideLabel ? 'sr-only' : 'field__label'} htmlFor={controlId}>
          {label}
          {required && (
            <span className="field__required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {children(controlProps)}
      {showHint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          <IconAlertCircle size={16} />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}