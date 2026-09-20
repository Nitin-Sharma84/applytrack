import { SHORTCUTS } from '../../constants/shortcuts.js'
import { Button } from './Button.jsx'
import { Modal } from './Modal.jsx'
import './ShortcutsModal.css'

export function ShortcutsModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      title="Keyboard shortcuts"
      size="sm"
      onClose={onClose}
      footer={
        <Button onClick={onClose} data-autofocus>
          Got it
        </Button>
      }
    >
      <dl className="shortcuts">
        {SHORTCUTS.map(({ keys, description }) => (
          <div key={description} className="shortcuts__row">
            <dt>{description}</dt>
            <dd>
              {keys.map((key) => (
                <kbd key={key} className="shortcuts__key">
                  {key}
                </kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Modal>
  )
}