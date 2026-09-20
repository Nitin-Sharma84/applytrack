import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Order matters: tokens define the variables that every later file uses.
import './styles/tokens.css'
import './styles/base.css'
import './styles/animations.css'
import './styles/utilities.css'

import { App } from './App.jsx'
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx'
import { ApplicationFormProvider } from './context/ApplicationFormProvider.jsx'
import { ApplicationsProvider } from './context/ApplicationsContext.jsx'
import { ConfirmProvider } from './context/ConfirmProvider.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

// Provider order: ErrorBoundary is outermost so it also catches errors thrown
// by the providers. ApplicationFormProvider is innermost because it uses the
// applications, toast and confirm contexts.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <ToastProvider>
          <ConfirmProvider>
            <ApplicationsProvider>
              <ApplicationFormProvider>
                <App />
              </ApplicationFormProvider>
            </ApplicationsProvider>
          </ConfirmProvider>
        </ToastProvider>
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>,
)