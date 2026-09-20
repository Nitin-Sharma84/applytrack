import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Order matters: tokens define the variables that every later file uses.
import './styles/tokens.css'
import './styles/base.css'
import './styles/animations.css'
import './styles/utilities.css'

import { App } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)