import { useEffect, useState } from 'react'
import api from '../api'
import Card from './Card'

export default function Watchlist() {
  const [u, setU] = useState(null)
  const load = () => api.get('/user/me').then(r => setU(r.data)).catch(() => {})
  useEffect(() => { load() }, [])
  if (!u) return <p className="p-5">Login required...</p>
  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-xl mb-3">Plan to Watch ({u.watchlist.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-8">
        {u.watchlist.map(d => <Card key={d._id} d={d} />)}
      </div>
      <h1 className="text-xl mb-3">Watched ({u.watched.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {u.watched.filter(w => w.drama).map(w => <Card key={w._id} d={w.drama}
          extra={<div className="text-xs text-yellow-400">Your rating: {w.userRating}</div>} />)}
      </div>
    </div>
  )
}
