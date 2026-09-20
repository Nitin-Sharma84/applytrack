import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap.js'
import { Button } from './Button.jsx'
import { IconClose } from './Icons.jsx'
import './Modal.css'

/**
 * Accessible modal dialog.
 *  - Portal: rendered into document.body, so no parent's overflow, transform
 *    or z-index can clip or hide it.
 *  - role="dialog" + aria-modal + aria-labelledby for screen readers.
 *  - Focus trap, Esc to close, focus returns to the opener (useFocusTrap).
 *  - Page scroll is locked while open.
 * Mark the element that should get focus first with the data-autofocus attribute.
 *
 * @param {{ isOpen: boolean, title: string, description?: string, onClose: () => void,
 *           footer?: import('react').ReactNode, size?: 'sm'|'md'|'lg',
 *           closeOnBackdrop?: boolean, children?: import('react').ReactNode }} props
 */
export function Modal({
  isOpen,
  title,
  description,
  onClose,
  footer = null,
  size = 'md',
  closeOnBackdrop = true,
  children,
}) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  useFocusTrap(dialogRef, { isActive: isOpen, onEscape: onClose })

  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  // mousedown (not click): dragging a text selection out of the dialog must not close it.
  function handleBackdropMouseDown(event) {
    if (closeOnBackdrop && event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div className="modal__backdrop" onMouseDown={handleBackdropMouseDown}>
      <div
        ref={dialogRef}
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <header className="modal__header">
          <div>
            <h2 id={titleId} className="modal__title">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="modal__description">
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" iconOnly aria-label="Close dialog" onClick={onClose}>
            <IconClose size={18} />
          </Button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}