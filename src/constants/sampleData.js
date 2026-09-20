import { addDays, toDateInputValue } from '../utils/dateHelpers.js'
import { generateId } from '../utils/applicationHelpers.js'
import { JOB_TYPE, PRIORITY, ROUND_MODE, ROUND_RESULT, ROUND_TYPE, SOURCE, WORK_MODE } from './options.js'
import { STATUS } from './statuses.js'

/** Every sample application carries this tag, so sample data is always easy to spot. */
export const SAMPLE_TAG = 'sample'

/**
 * 12 realistic applications. All dates are RELATIVE to today, so upcoming
 * deadlines, interview rounds and follow-up reminders show up whenever the
 * data is loaded. Company names are real, but every detail is made up.
 * @param {Date} [today]
 * @returns {object[]}
 */
export function createSampleApplications(today = new Date()) {
  const dateOffset = (days) => toDateInputValue(addDays(today, days))
  const stamp = (daysAgo) => addDays(today, -daysAgo).toISOString()
  const round = (type, days, mode, result, notes = '') => ({
    id: generateId(),
    type,
    date: dateOffset(days),
    mode,
    result,
    notes,
  })
  const checklist = (items) => items.map(([text, done]) => ({ id: generateId(), text, done }))

  // history = [[status, daysAgo], ...] oldest first. The current status and the
  // createdAt / updatedAt timestamps are taken from it, so they always agree.
  const build = ({ history, applied, deadline, tags = [], notes, ...fields }) => {
    const statusHistory = history.map(([status, daysAgo]) => ({ status, date: stamp(daysAgo) }))
    const last = statusHistory[statusHistory.length - 1]
    return {
      id: generateId(),
      jobType: JOB_TYPE.FULL_TIME,
      workMode: WORK_MODE.ON_SITE,
      location: '',
      source: SOURCE.OTHER,
      priority: PRIORITY.MEDIUM,
      ctcLpa: null,
      jobLink: '',
      contactName: '',
      contactEmail: '',
      resumeVersion: '',
      rounds: [],
      prepChecklist: [],
      ...fields,
      appliedDate: applied === undefined ? '' : dateOffset(-applied),
      deadline: deadline === undefined ? '' : dateOffset(deadline),
      tags: [SAMPLE_TAG, ...tags],
      notes: `Sample data: ${notes}`,
      status: last.status,
      statusHistory,
      createdAt: statusHistory[0].date,
      updatedAt: last.date,
    }
  }

  return [
    build({
      company: 'TCS',
      role: 'Software Engineer (Digital)',
      source: SOURCE.CAMPUS,
      priority: PRIORITY.HIGH,
      location: 'Mumbai',
      ctcLpa: 7,
      resumeVersion: 'v3 Web Dev',
      contactName: 'Placement Cell',
      contactEmail: 'placements@example.com',
      history: [[STATUS.APPLIED, 24], [STATUS.ONLINE_TEST, 16], [STATUS.INTERVIEW, 3]],
      applied: 24,
      deadline: -20,
      tags: ['campus'],
      notes: 'Technical interview is next. Revise OOP, SQL and project details.',
      rounds: [
        round(ROUND_TYPE.APTITUDE, -14, ROUND_MODE.ONLINE, ROUND_RESULT.CLEARED),
        round(ROUND_TYPE.CODING, -10, ROUND_MODE.ONLINE, ROUND_RESULT.CLEARED),
        round(ROUND_TYPE.TECHNICAL, 2, ROUND_MODE.OFFLINE, ROUND_RESULT.PENDING, 'Carry resume and project report.'),
      ],
      prepChecklist: checklist([
        ['Revise DBMS and OS basics', true],
        ['Practice 20 coding problems', true],
        ['Prepare project walkthrough', false],
      ]),
    }),
    build({
      company: 'Infosys',
      role: 'Systems Engineer',
      source: SOURCE.CAMPUS,
      priority: PRIORITY.HIGH,
      location: 'Pune',
      ctcLpa: 3.6,
      history: [[STATUS.APPLIED, 12], [STATUS.ONLINE_TEST, 4]],
      applied: 12,
      deadline: 3,
      tags: ['campus'],
      notes: 'Online assessment coming up. Practice aptitude and pseudocode.',
      rounds: [round(ROUND_TYPE.APTITUDE, 4, ROUND_MODE.ONLINE, ROUND_RESULT.PENDING)],
    }),
    build({
      company: 'Wipro',
      role: 'Project Engineer',
      source: SOURCE.CAMPUS,
      location: 'Bengaluru',
      ctcLpa: 3.5,
      history: [[STATUS.APPLIED, 10]],
      applied: 10,
      deadline: 10,
      tags: ['campus'],
      notes: 'No reply yet. Ask the placement cell for an update.',
    }),
    build({
      company: 'HCLTech',
      role: 'Graduate Engineer Trainee',
      source: SOURCE.NAUKRI,
      location: 'Noida',
      ctcLpa: 4,
      history: [[STATUS.WISHLIST, 6]],
      deadline: -2,
      notes: 'Deadline passed. Check whether the portal still accepts applications.',
    }),
    build({
      company: 'Tech Mahindra',
      role: 'Software Developer',
      source: SOURCE.LINKEDIN,
      priority: PRIORITY.HIGH,
      workMode: WORK_MODE.HYBRID,
      location: 'Pune',
      ctcLpa: 5.5,
      resumeVersion: 'v3 Web Dev',
      history: [[STATUS.WISHLIST, 7], [STATUS.APPLIED, 2]],
      applied: 2,
      deadline: 5,
      tags: ['web'],
      notes: 'Applied through LinkedIn Easy Apply.',
    }),
    build({
      company: 'Cognizant',
      role: 'Programmer Analyst Trainee',
      source: SOURCE.CAMPUS,
      priority: PRIORITY.HIGH,
      location: 'Chennai',
      ctcLpa: 4,
      history: [[STATUS.APPLIED, 40], [STATUS.ONLINE_TEST, 33], [STATUS.INTERVIEW, 22], [STATUS.OFFER, 6]],
      applied: 40,
      deadline: 5,
      tags: ['campus'],
      notes: 'Offer received. Reply before the deadline.',
      rounds: [
        round(ROUND_TYPE.APTITUDE, -33, ROUND_MODE.ONLINE, ROUND_RESULT.CLEARED),
        round(ROUND_TYPE.TECHNICAL, -22, ROUND_MODE.OFFLINE, ROUND_RESULT.CLEARED),
        round(ROUND_TYPE.HR, -15, ROUND_MODE.OFFLINE, ROUND_RESULT.CLEARED),
      ],
    }),
    build({
      company: 'Capgemini',
      role: 'Analyst',
      source: SOURCE.REFERRAL,
      priority: PRIORITY.HIGH,
      workMode: WORK_MODE.HYBRID,
      location: 'Mumbai',
      ctcLpa: 4.25,
      contactName: 'Amit Verma',
      contactEmail: 'amit.verma@example.com',
      history: [[STATUS.APPLIED, 30], [STATUS.ONLINE_TEST, 21], [STATUS.INTERVIEW, 5]],
      applied: 30,
      deadline: -10,
      notes: 'HR round is the last step. Referred by a senior.',
      rounds: [
        round(ROUND_TYPE.APTITUDE, -21, ROUND_MODE.ONLINE, ROUND_RESULT.CLEARED),
        round(ROUND_TYPE.CODING, -14, ROUND_MODE.ONLINE, ROUND_RESULT.CLEARED),
        round(ROUND_TYPE.TECHNICAL, -5, ROUND_MODE.ONLINE, ROUND_RESULT.CLEARED),
        round(ROUND_TYPE.HR, 6, ROUND_MODE.ONLINE, ROUND_RESULT.PENDING),
      ],
    }),
    build({
      company: 'Accenture',
      role: 'Associate Software Engineer',
      source: SOURCE.COMPANY_WEBSITE,
      location: 'Bengaluru',
      ctcLpa: 4.6,
      history: [[STATUS.APPLIED, 45], [STATUS.ONLINE_TEST, 38], [STATUS.REJECTED, 30]],
      applied: 45,
      deadline: -35,
      notes: 'Not cleared in the coding round. Practice arrays and strings.',
      rounds: [
        round(ROUND_TYPE.APTITUDE, -38, ROUND_MODE.ONLINE, ROUND_RESULT.CLEARED),
        round(ROUND_TYPE.CODING, -32, ROUND_MODE.ONLINE, ROUND_RESULT.NOT_CLEARED),
      ],
    }),
    build({
      company: 'LTIMindtree',
      role: 'Software Engineer Intern',
      jobType: JOB_TYPE.INTERNSHIP,
      source: SOURCE.INTERNSHALA,
      priority: PRIORITY.HIGH,
      workMode: WORK_MODE.HYBRID,
      location: 'Mumbai',
      history: [[STATUS.APPLIED, 8]],
      applied: 8,
      deadline: 2,
      tags: ['internship'],
      notes: 'No update for a week. Send a polite follow-up.',
    }),
    build({
      company: 'Zoho',
      role: 'Member Technical Staff',
      source: SOURCE.COMPANY_WEBSITE,
      priority: PRIORITY.HIGH,
      location: 'Chennai',
      ctcLpa: 8,
      history: [[STATUS.APPLIED, 20], [STATUS.INTERVIEW, 7]],
      applied: 20,
      deadline: -5,
      notes: 'Programming rounds cleared. Technical interview is next.',
      rounds: [
        round(ROUND_TYPE.CODING, -7, ROUND_MODE.OFFLINE, ROUND_RESULT.CLEARED),
        round(ROUND_TYPE.TECHNICAL, 3, ROUND_MODE.OFFLINE, ROUND_RESULT.PENDING),
      ],
      prepChecklist: checklist([
        ['Revise data structures', true],
        ['Practice programming rounds', false],
      ]),
    }),
    build({
      company: 'Persistent Systems',
      role: 'Trainee Software Engineer',
      source: SOURCE.LINKEDIN,
      priority: PRIORITY.LOW,
      workMode: WORK_MODE.HYBRID,
      location: 'Pune',
      ctcLpa: 4.5,
      history: [[STATUS.WISHLIST, 1]],
      deadline: 12,
      tags: ['web'],
      notes: 'Want to apply after updating the resume.',
    }),
    build({
      company: 'Mphasis',
      role: 'Frontend Developer Intern',
      jobType: JOB_TYPE.INTERNSHIP,
      source: SOURCE.INTERNSHALA,
      workMode: WORK_MODE.REMOTE,
      location: 'India (Remote)',
      jobLink: 'https://example.com/jobs/frontend-intern',
      resumeVersion: 'v3 Web Dev',
      history: [[STATUS.APPLIED, 3]],
      applied: 3,
      deadline: 9,
      tags: ['internship', 'web'],
      notes: 'React internship. Portfolio link added in the application.',
    }),
  ]
}