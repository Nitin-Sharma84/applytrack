import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap.js'
import { Button } from './Button.jsx'
import { IconClose } from './Icons.jsx'
import './Drawer.css'

/**
 * Side panel (full width on phones). Mounting it means "open", unmounting it
 * means "closed", so the parent renders it only when there is something to show.
 * Same accessibility rules as Modal: portal, focus trap, Esc closes, focus
 * returns to the element that opened it, page scroll is locked.
 *
 * @param {{ title: string, subtitle?: string, onClose: () => void, children: import('react').ReactNode }} props
 */
export function Drawer({ title, subtitle, onClose, children }) {
  const drawerRef = useRef(null)
  const titleId = useId()

  useFocusTrap(drawerRef, { onEscape: onClose })

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // mousedown (not click): dragging a text selection out of the drawer must not close it.
  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div className="drawer__backdrop" onMouseDown={handleBackdropMouseDown}>
      <aside
        ref={drawerRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="drawer__header">
          <div className="drawer__heading">
            <h2 id={titleId} className="drawer__title">
              {title}
            </h2>
            {subtitle && <p className="drawer__subtitle">{subtitle}</p>}
          </div>
          <Button variant="ghost" size="sm" iconOnly aria-label="Close details" onClick={onClose}>
            <IconClose size={18} />
          </Button>
        </header>
        <div className="drawer__body">{children}</div>
      </aside>
    </div>,
    document.body,
  )
}