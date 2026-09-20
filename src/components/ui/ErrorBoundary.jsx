import { Component } from 'react'
import { clearAllData } from '../../services/storage.js'
import './ErrorBoundary.css'

/**
 * Catches errors thrown while rendering any child component and shows a
 * fallback screen instead of a blank page.
 *
 * It must be a class component: React has no hook equivalent of
 * getDerivedStateFromError / componentDidCatch.
 *
 * It does NOT catch errors in event handlers, async code (setTimeout,
 * fetch) or the boundary itself. Those need normal try/catch.
 */
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ApplyTrack] Unhandled UI error:', error, info.componentStack)
  }

  handleTryAgain = () => {
    this.setState({ error: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  // Escape hatch: if bad stored data keeps crashing the app, the user is not stuck.
  handleClearData = () => {
    const isConfirmed = window.confirm(
      'This deletes all applications and settings stored in this browser. Continue?',
    )
    if (isConfirmed) {
      clearAllData()
      window.location.reload()
    }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="error-boundary" role="alert">
        <div className="error-boundary__card">
          <h1 className="error-boundary__title">Something went wrong</h1>
          <p className="error-boundary__text">
            ApplyTrack hit an unexpected error. Your saved data is still in this browser.
          </p>
          <p className="error-boundary__detail">{error.message}</p>
          <div className="error-boundary__actions">
            <button
              type="button"
              className="error-boundary__button error-boundary__button--primary"
              onClick={this.handleTryAgain}
            >
              Try again
            </button>
            <button type="button" className="error-boundary__button" onClick={this.handleReload}>
              Reload page
            </button>
            <button
              type="button"
              className="error-boundary__button error-boundary__button--danger"
              onClick={this.handleClearData}
            >
              Clear data and reload
            </button>
          </div>
        </div>
      </div>
    )
  }
}