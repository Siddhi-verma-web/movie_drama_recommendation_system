import { useEffect, useState } from 'react'
import api from '../api'
import Card from './Card'

const COUNTRIES = ['India', 'Korea', 'China', 'Turkey', 'Philippines', 'Pakistan']
const MOODS = ['Romantic', 'Emotional', 'Slow Burn', 'Healing', 'Revenge', 'Suspense', 'Light-hearted', 'Epic', 'Intense', 'Thrilling']

export default function Home() {
  const [list, setList] = useState([])
  const [f, setF] = useState({ q: '', type: '', country: '', mood: '', sort: '' })
  useEffect(() => {
    const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v))
    api.get('/dramas', { params }).then(r => setList(r.data))
  }, [f])
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const cls = 'bg-white/10 rounded px-3 py-2 text-sm'
  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-xl mb-3">Discover movies & dramas from 6 countries</h1>
      <div className="flex flex-wrap gap-2 mb-5">
        <input className={cls} placeholder="Search title..." value={f.q} onChange={set('q')} />
        <select className={cls} value={f.type} onChange={set('type')}>
          <option value="">Movies + Dramas</option>
          <option value="movie">Movies only</option>
          <option value="drama">Dramas only</option>
        </select>
        <select className={cls} value={f.country} onChange={set('country')}>
          <option value="">All countries</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className={cls} value={f.mood} onChange={set('mood')}>
          <option value="">Any mood</option>{MOODS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className={cls} value={f.sort} onChange={set('sort')}>
          <option value="">Newest</option><option value="rating">Top rated</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {list.map(d => <Card key={d._id} d={d} />)}
      </div>
      {list.length === 0 && <p className="text-gray-400">No titles found.</p>}
    </div>
  )
}