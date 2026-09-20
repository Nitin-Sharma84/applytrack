import { useCallback } from 'react'
import { createSampleApplications, SAMPLE_TAG } from '../constants/sampleData.js'
import { useApplications } from './useApplications.js'
import { useConfirm } from './useConfirm.js'
import { useToast } from './useToast.js'

/** @returns {{ loadSampleData: () => void, clearAllApplications: () => Promise<void> }} */
export function useSampleData() {
  const { applications, replaceAllApplications, clearApplications } = useApplications()
  const confirm = useConfirm()
  const toast = useToast()

  const loadSampleData = useCallback(() => {
    if (applications.some((application) => application.tags.includes(SAMPLE_TAG))) {
      toast.info('Sample data is already loaded.')
      return
    }
    const samples = createSampleApplications()
    // Added in front. Your own applications stay untouched.
    replaceAllApplications([...samples, ...applications])
    toast.success(`Loaded ${samples.length} sample applications. Remove them with "Clear all data".`)
  }, [applications, replaceAllApplications, toast])

  const clearAllApplications = useCallback(async () => {
    if (applications.length === 0) {
      toast.info('There is nothing to clear.')
      return
    }
    const isConfirmed = await confirm({
      title: 'Clear all data?',
      message: `All ${applications.length} applications will be deleted from this browser. This cannot be undone.`,
      confirmLabel: 'Clear all data',
    })
    if (!isConfirmed) return
    clearApplications()
    toast.success('All data cleared')
  }, [applications, clearApplications, confirm, toast])

  return { loadSampleData, clearAllApplications }
}