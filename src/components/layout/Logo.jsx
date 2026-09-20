import { IconCheck } from '../ui/Icons.jsx'
import './Logo.css'

/** Logomark (gradient square with a check) + wordmark. `collapsible` hides the text on tiny screens. */
export function Logo({ collapsible = false }) {
  return (
    <span className={`logo${collapsible ? ' logo--collapsible' : ''}`}>
      <span className="logo__mark">
        <IconCheck size={18} strokeWidth={3} />
      </span>
      <span className="logo__text">ApplyTrack</span>
    </span>
  )
}