import { NavLink, Outlet } from 'react-router-dom'
import './layout.css'

export default function Layout() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Library Manager</h1>
        <nav className="app-nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/members">Members</NavLink>
          <NavLink to="/loans">Loans</NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}