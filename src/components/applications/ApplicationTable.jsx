import { ApplicationRow } from './ApplicationRow.jsx'
import './ApplicationList.css'

/** Desktop and tablet view of the list. */
export function ApplicationTable({ applications, followUpDays, onEdit, onDelete, onChangeStatus }) {
  return (
    <div className="application-table__wrap">
      <table className="application-table">
        <caption className="sr-only">{applications.length} applications</caption>
        <thead>
          <tr>
            <th scope="col">Company</th>
            <th scope="col">Status</th>
            <th scope="col">Deadline</th>
            <th scope="col">Package</th>
            <th scope="col">Priority</th>
            <th scope="col">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
              followUpDays={followUpDays}
              onEdit={onEdit}
              onDelete={onDelete}
              onChangeStatus={onChangeStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}