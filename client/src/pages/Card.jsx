import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Card({ d, extra }) {
  const [bad, setBad] = useState(false)
  return (
    <Link to={'/drama/' + d._id} className="block bg-white/5 rounded-lg overflow-hidden hover:scale-105 transition">
      {d.poster && !bad
        ? <img src={d.poster} alt={d.title} loading="lazy" onError={() => setBad(true)}
            className="w-full aspect-[2/3] object-cover" />
        : <div className="aspect-[2/3] flex items-center justify-center text-gray-400 p-2 text-center bg-white/10">{d.title}</div>}
      <div className="p-2">
        <div className="text-sm font-semibold truncate">{d.title}</div>
        <div className="text-xs text-gray-400">
          {d.type === 'movie' ? 'Movie' : 'Drama'} · {d.country} · {d.releaseYear || '-'} · ⭐{d.avgRating}
        </div>
        {extra}
      </div>
    </Link>
  )
}