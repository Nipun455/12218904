import { useState } from 'react'
import { useLibrary } from '../state/LibraryContext'

export default function Books() {
  const { books, addBook, updateBook, deleteBook } = useLibrary()

  const [form, setForm] = useState({ title: '', author: '', isbn: '', copiesTotal: 1 })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', author: '', isbn: '', copiesTotal: 1 })
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.author) { setError('Title and author are required'); return }
    setError('')
    addBook(form)
    setForm({ title: '', author: '', isbn: '', copiesTotal: 1 })
  }

  const startEdit = (book) => {
    setEditingId(book.id)
    setEditForm({ title: book.title, author: book.author, isbn: book.isbn, copiesTotal: book.copiesTotal })
  }

  const saveEdit = (id) => {
    if (!editForm.title || !editForm.author) { setError('Title and author are required'); return }
    setError('')
    updateBook(id, editForm)
    setEditingId(null)
  }

  const onDelete = (id) => {
    const ok = deleteBook(id)
    if (!ok) alert('Cannot delete a book with active loans')
  }

  return (
    <div className="card">
      <h2>Books</h2>

      <form onSubmit={onSubmit} className="row">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
        <input placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
        <input type="number" min="0" placeholder="Copies" value={form.copiesTotal} onChange={(e) => setForm({ ...form, copiesTotal: Number(e.target.value) })} />
        <button type="submit">Add Book</button>
      </form>
      {error && <div className="muted" style={{ marginTop: '0.5rem' }}>{error}</div>}

      <table className="table" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Total</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>
                {editingId === b.id ? (
                  <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                ) : b.title}
              </td>
              <td>
                {editingId === b.id ? (
                  <input value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} />
                ) : b.author}
              </td>
              <td>
                {editingId === b.id ? (
                  <input value={editForm.isbn} onChange={(e) => setEditForm({ ...editForm, isbn: e.target.value })} />
                ) : (b.isbn || <span className="muted">—</span>)}
              </td>
              <td>
                {editingId === b.id ? (
                  <input type="number" min="0" value={editForm.copiesTotal} onChange={(e) => setEditForm({ ...editForm, copiesTotal: Number(e.target.value) })} />
                ) : b.copiesTotal}
              </td>
              <td>{b.copiesAvailable}</td>
              <td>
                {editingId === b.id ? (
                  <div className="button-row">
                    <button onClick={() => saveEdit(b.id)}>Save</button>
                    <button type="button" className="secondary" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="button-row">
                    <button type="button" onClick={() => startEdit(b)}>Edit</button>
                    <button type="button" className="danger" onClick={() => onDelete(b.id)}>Delete</button>
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