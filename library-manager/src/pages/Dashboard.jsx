import { useLibrary } from '../state/LibraryContext'

export default function Dashboard() {
  const { books, members, activeLoans } = useLibrary()

  const totalCopies = books.reduce((sum, b) => sum + b.copiesTotal, 0)
  const availableCopies = books.reduce((sum, b) => sum + b.copiesAvailable, 0)

  return (
    <div className="card">
      <h2>Overview</h2>
      <div className="row">
        <div><strong>Books:</strong> {books.length}</div>
        <div><strong>Members:</strong> {members.length}</div>
        <div><strong>Active Loans:</strong> {activeLoans.length}</div>
      </div>
      <div className="row" style={{ marginTop: '0.5rem' }}>
        <div><strong>Total Copies:</strong> {totalCopies}</div>
        <div><strong>Available Copies:</strong> {availableCopies}</div>
      </div>
    </div>
  )
}