import { EmptyState } from '../components/ui/EmptyState.jsx'

export function PlaceholderPage({ title }) {
  return (
    <EmptyState
      title={`${title} is coming soon`}
      description="This page is built in a later phase of the project."
    />
  )
}