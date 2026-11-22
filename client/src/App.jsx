import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Login from './pages/Login'
import Watchlist from './pages/Watchlist'

export default function App() {
  const nav = useNavigate()
  const logged = !!localStorage.getItem('token')
  const logout = () => { localStorage.removeItem('token'); nav('/'); location.reload() }
  return (
    <div>
      <nav className="flex items-center justify-between px-5 py-3 bg-black/60 sticky top-0 z-10">
        <Link to="/" className="text-lg font-bold text-rose-500">
          Movie & Drama Recommendation System
        </Link>
        <div className="flex gap-4 text-sm">
          {logged && <Link to="/watchlist">My List</Link>}
          {logged ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drama/:id" element={<Detail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </div>
  )
}