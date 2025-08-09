import { useState } from 'react'
import { useLibrary } from '../state/LibraryContext'

export default function Members() {
  const { members, addMember, updateMember, deleteMember } = useLibrary()

  const [form, setForm] = useState({ name: '', email: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.name) { setError('Name is required'); return }
    setError('')
    addMember(form)
    setForm({ name: '', email: '' })
  }

  const startEdit = (m) => {
    setEditingId(m.id)
    setEditForm({ name: m.name, email: m.email })
  }

  const saveEdit = (id) => {
    if (!editForm.name) { setError('Name is required'); return }
    setError('')
    updateMember(id, editForm)
    setEditingId(null)
  }

  const onDelete = (id) => {
    const ok = deleteMember(id)
    if (!ok) alert('Cannot delete a member with active loans')
  }

  return (
    <div className="card">
      <h2>Members</h2>

      <form onSubmit={onSubmit} className="row">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button type="submit">Add Member</button>
      </form>
      {error && <div className="muted" style={{ marginTop: '0.5rem' }}>{error}</div>}

      <table className="table" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>
                {editingId === m.id ? (
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                ) : m.name}
              </td>
              <td>
                {editingId === m.id ? (
                  <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                ) : (m.email || <span className="muted">—</span>)}
              </td>
              <td>
                {editingId === m.id ? (
                  <div className="button-row">
                    <button onClick={() => saveEdit(m.id)}>Save</button>
                    <button type="button" className="secondary" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="button-row">
                    <button type="button" onClick={() => startEdit(m)}>Edit</button>
                    <button type="button" className="danger" onClick={() => onDelete(m.id)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}