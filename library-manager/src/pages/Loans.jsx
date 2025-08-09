import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useLibrary } from '../state/LibraryContext'

export default function Loans() {
  const { books, members, activeLoans, loanBook, returnLoan } = useLibrary()

  const availableBooks = useMemo(() => books.filter((b) => b.copiesAvailable > 0), [books])

  const [form, setForm] = useState({ bookId: '', memberId: '', dueInDays: 14 })
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.bookId || !form.memberId) { setError('Select book and member'); return }
    setError('')
    const res = loanBook(form)
    if (!res.ok) { setError(res.error || 'Unable to loan'); return }
    setForm({ bookId: '', memberId: '', dueInDays: 14 })
  }

  return (
    <div className="card">
      <h2>Loans</h2>

      <form onSubmit={onSubmit} className="row">
        <select value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })}>
          <option value="">Select Book</option>
          {availableBooks.map((b) => (
            <option key={b.id} value={b.id}>{b.title} ({b.copiesAvailable} available)</option>
          ))}
        </select>
        <select value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input type="number" min="1" max="60" value={form.dueInDays} onChange={(e) => setForm({ ...form, dueInDays: Number(e.target.value) })} />
        <button type="submit">Create Loan</button>
      </form>
      {error && <div className="muted" style={{ marginTop: '0.5rem' }}>{error}</div>}

      <table className="table" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Book</th>
            <th>Member</th>
            <th>Loaned</th>
            <th>Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeLoans.map((l) => {
            const book = books.find((b) => b.id === l.bookId)
            const member = members.find((m) => m.id === l.memberId)
            return (
              <tr key={l.id}>
                <td>{book ? book.title : '—'}</td>
                <td>{member ? member.name : '—'}</td>
                <td>{format(new Date(l.loanedAt), 'yyyy-MM-dd')}</td>
                <td>{format(new Date(l.dueAt), 'yyyy-MM-dd')}</td>
                <td>
                  <button type="button" onClick={() => returnLoan(l.id)}>Mark Returned</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}