import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Keeps keyboard focus inside a container (modal, drawer) while it is active.
 *  - moves focus inside on open ([data-autofocus] element, else first focusable)
 *  - Tab and Shift+Tab loop within the container
 *  - Escape calls onEscape
 *  - on close, focus returns to the element that had it before opening
 *
 * The listener is attached to the container itself, NOT to document. So a
 * confirm dialog opened on top of a modal is not affected by the modal's trap.
 *
 * @param {import('react').RefObject<HTMLElement|null>} containerRef
 * @param {{ isActive?: boolean, onEscape?: () => void }} [options]
 */
export function useFocusTrap(containerRef, { isActive = true, onEscape } = {}) {
  // Latest onEscape without re-subscribing the listener on every render.
  const onEscapeRef = useRef(onEscape)
  useEffect(() => {
    onEscapeRef.current = onEscape
  })

  useEffect(() => {
    const container = containerRef.current
    if (!isActive || !container) return undefined

    const previouslyFocused = document.activeElement

    const getFocusable = () =>
      Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (element) => element.getClientRects().length > 0,
      )

    const preferred = container.querySelector('[data-autofocus]')
    if (preferred) {
      preferred.focus()
    } else if (!container.contains(document.activeElement)) {
      // If a child already used autoFocus, leave it alone.
      ;(getFocusable()[0] ?? container).focus()
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onEscapeRef.current?.()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      const isOutside = !container.contains(active)

      if (event.shiftKey && (active === first || isOutside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || isOutside)) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [containerRef, isActive])
}