import { useState } from 'react'
import { Badge } from '../components/ui/Badge.jsx'
import { Button } from '../components/ui/Button.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { IconClock, IconPlus } from '../components/ui/Icons.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { Select } from '../components/ui/Select.jsx'
import { Textarea } from '../components/ui/Textarea.jsx'
import { SOURCES } from '../constants/options.js'
import { STATUSES } from '../constants/statuses.js'
import { useConfirm } from '../hooks/useConfirm.js'
import { useToast } from '../hooks/useToast.js'
import './PreviewPage.css'

export function PreviewPage({ pageLabel }) {
  const toast = useToast()
  const confirm = useConfirm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [company, setCompany] = useState('')

  async function handleConfirmDemo() {
    const isConfirmed = await confirm({
      title: 'Delete application?',
      message: 'This removes the application from your list.',
      confirmLabel: 'Delete',
    })
    toast.info(isConfirmed ? 'Confirmed' : 'Cancelled')
  }

  return (
    <div className="preview-page">
      <section className="preview-page__card glass">
        <EmptyState
          title={`${pageLabel} page`}
          description="The real page arrives in a later phase. Below is a playground to test the UI kit."
          actionLabel="Add application"
          onAction={() => toast.info('The form arrives in Phase 4.')}
        />
      </section>

      <section className="preview-page__card glass" aria-labelledby="playground-title">
        <h2 id="playground-title" className="preview-page__title">
          UI kit playground
        </h2>

        <div className="preview-page__row">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button leftIcon={<IconPlus size={16} />} size="sm">
            Small
          </Button>
          <Button disabled>Disabled</Button>
        </div>

        <div className="preview-page__row">
          {STATUSES.map((status) => (
            <Badge key={status} status={status} />
          ))}
        </div>

        <div className="preview-page__row">
          <Badge>Neutral</Badge>
          <Badge tone="primary">Primary</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning" icon={<IconClock size={14} />}>
            3 days left
          </Badge>
          <Badge tone="danger">Overdue by 2 days</Badge>
          <Badge tone="info">Info</Badge>
        </div>

        <div className="preview-page__grid">
          <Input
            label="Company"
            required
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            error={company.trim() === '' ? 'Company is required.' : undefined}
          />
          <Input label="Location" hint="Optional. Example: Bengaluru" />
          <Select label="Source" options={SOURCES} defaultValue={SOURCES[0]} />
        </div>
        <Textarea label="Notes" placeholder="Anything worth remembering..." />

        <div className="preview-page__row">
          <Button variant="secondary" onClick={() => toast.success('Application saved')}>
            Success toast
          </Button>
          <Button variant="secondary" onClick={() => toast.error('Something failed')}>
            Error toast
          </Button>
          <Button variant="secondary" onClick={() => toast.info('Just so you know')}>
            Info toast
          </Button>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            Open modal
          </Button>
          <Button variant="secondary" onClick={handleConfirmDemo}>
            Open confirm
          </Button>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        title="Modal demo"
        description="Press Tab to check the focus trap and Esc to close."
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Save</Button>
          </>
        }
      >
        <Input label="Role" data-autofocus />
      </Modal>
    </div>
  )
}