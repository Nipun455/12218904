import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { nanoid } from 'nanoid'
import { addDays } from 'date-fns'

const STORAGE_KEY = 'library_manager_state_v1'

const initialSeedData = {
  books: [
    { id: nanoid(), title: 'The Pragmatic Programmer', author: 'Andrew Hunt, David Thomas', isbn: '978-0201616224', copiesTotal: 3, copiesAvailable: 3 },
    { id: nanoid(), title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', copiesTotal: 2, copiesAvailable: 2 },
  ],
  members: [
    { id: nanoid(), name: 'Alice Johnson', email: 'alice@example.com' },
    { id: nanoid(), name: 'Bob Smith', email: 'bob@example.com' },
  ],
  loans: [],
}

const LibraryContext = createContext(null)

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialSeedData
    const parsed = JSON.parse(raw)
    // basic validation
    if (!parsed || typeof parsed !== 'object') return initialSeedData
    return parsed
  } catch (_) {
    return initialSeedData
  }
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() => loadState().books)
  const [members, setMembers] = useState(() => loadState().members)
  const [loans, setLoans] = useState(() => loadState().loans)

  // persist
  useEffect(() => {
    const state = { books, members, loans }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (_) {
      // ignore quota errors
    }
  }, [books, members, loans])

  // Books operations
  const addBook = (book) => {
    const id = nanoid()
    const newBook = {
      id,
      title: book.title.trim(),
      author: book.author.trim(),
      isbn: book.isbn.trim(),
      copiesTotal: Number(book.copiesTotal) || 0,
      copiesAvailable: Number(book.copiesTotal) || 0,
    }
    setBooks((prev) => [newBook, ...prev])
  }

  const updateBook = (id, updates) => {
    setBooks((prev) => prev.map((b) => {
      if (b.id !== id) return b
      const nextTotal = updates.copiesTotal != null ? Number(updates.copiesTotal) : b.copiesTotal
      let nextAvailable = b.copiesAvailable
      if (updates.copiesTotal != null) {
        nextAvailable = Math.min(nextAvailable, nextTotal)
        if (nextAvailable < 0) nextAvailable = 0
      }
      return {
        ...b,
        ...updates,
        copiesTotal: nextTotal,
        copiesAvailable: nextAvailable,
      }
    }))
  }

  const deleteBook = (id) => {
    // prevent deletion if active loan exists
    const hasActiveLoan = loans.some((l) => l.bookId === id && !l.returnedAt)
    if (hasActiveLoan) return false
    setBooks((prev) => prev.filter((b) => b.id !== id))
    // also remove historical loans for cleanliness (optional)
    setLoans((prev) => prev.filter((l) => l.bookId !== id))
    return true
  }

  // Members operations
  const addMember = (member) => {
    const id = nanoid()
    const newMember = { id, name: member.name.trim(), email: member.email.trim() }
    setMembers((prev) => [newMember, ...prev])
  }

  const updateMember = (id, updates) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const deleteMember = (id) => {
    const hasActiveLoan = loans.some((l) => l.memberId === id && !l.returnedAt)
    if (hasActiveLoan) return false
    setMembers((prev) => prev.filter((m) => m.id !== id))
    setLoans((prev) => prev.filter((l) => l.memberId !== id))
    return true
  }

  // Loans operations
  const loanBook = ({ bookId, memberId, dueInDays = 14 }) => {
    const book = books.find((b) => b.id === bookId)
    if (!book || book.copiesAvailable <= 0) return { ok: false, error: 'No copies available' }
    const member = members.find((m) => m.id === memberId)
    if (!member) return { ok: false, error: 'Member not found' }

    const now = new Date().toISOString()
    const dueDate = addDays(new Date(), dueInDays).toISOString()
    const newLoan = { id: nanoid(), bookId, memberId, loanedAt: now, dueAt: dueDate, returnedAt: null }

    setLoans((prev) => [newLoan, ...prev])
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, copiesAvailable: b.copiesAvailable - 1 } : b)))
    return { ok: true }
  }

  const returnLoan = (loanId) => {
    const loan = loans.find((l) => l.id === loanId)
    if (!loan || loan.returnedAt) return false
    const bookId = loan.bookId

    setLoans((prev) => prev.map((l) => (l.id === loanId ? { ...l, returnedAt: new Date().toISOString() } : l)))
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, copiesAvailable: b.copiesAvailable + 1 } : b)))
    return true
  }

  const activeLoans = useMemo(() => loans.filter((l) => !l.returnedAt), [loans])

  const value = {
    books,
    members,
    loans,
    activeLoans,
    addBook,
    updateBook,
    deleteBook,
    addMember,
    updateMember,
    deleteMember,
    loanBook,
    returnLoan,
  }

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}