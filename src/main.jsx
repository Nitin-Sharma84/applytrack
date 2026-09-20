import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Order matters: tokens define the variables that every later file uses.
import './styles/tokens.css'
import './styles/base.css'
import './styles/animations.css'
import './styles/utilities.css'

import { App } from './App.jsx'
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx'
import { ApplicationsProvider } from './context/ApplicationsContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

// Provider order: ErrorBoundary is outermost so it also catches errors thrown
// by the providers. ApplicationsProvider sits inside ToastProvider because it
// shows a toast when saving fails.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <ToastProvider>
          <ApplicationsProvider>
            <App />
          </ApplicationsProvider>
        </ToastProvider>
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>,
)