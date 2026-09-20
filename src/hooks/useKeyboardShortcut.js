import { useEffect, useRef } from 'react'

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/**
 * Runs `handler` when a single key is pressed anywhere on the page.
 * It stays quiet when the user is typing in a field, when Ctrl/Cmd/Alt is held,
 * or when a dialog/drawer is open (a shortcut must not act behind it).
 * Esc is not handled here: Modal and Drawer close themselves (useFocusTrap).
 *
 * @param {string} key for example 'n', '/' or '?'
 * @param {() => void} handler
 */
export function useKeyboardShortcut(key, handler) {
  // Latest handler without re-subscribing the listener on every render.
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key.toLowerCase() !== key.toLowerCase()) return
      if (event.ctrlKey || event.metaKey || event.altKey) return // Shift is allowed: "?" needs it

      const { target } = event
      const isTyping =
        target instanceof HTMLElement && (TYPING_TAGS.has(target.tagName) || target.isContentEditable)
      if (isTyping) return
      if (document.querySelector('[aria-modal="true"]')) return

      event.preventDefault() // so "/" is not typed into the search box it just focused
      handlerRef.current()
    }

    window.addEventListener('keydown', handleKeyDown)
    // Cleanup: the listener is removed when the component unmounts or the key changes.
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key])
}