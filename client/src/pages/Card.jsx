import { Link } from 'react-router-dom'
export default function Card({ d, extra }) {
  return (
    <Link to={'/drama/' + d._id} className="block bg-white/5 rounded-lg overflow-hidden hover:scale-105 transition">
      {d.poster ? <img src={d.poster} alt={d.title} className="w-full aspect-[2/3] object-cover" />
        : <div className="aspect-[2/3] flex items-center justify-center text-gray-500 p-2 text-center">{d.title}</div>}
      <div className="p-2">
        <div className="text-sm font-semibold truncate">{d.title}</div>
        <div className="text-xs text-gray-400">{d.country} · {d.releaseYear || '-'} · ⭐{d.avgRating}</div>
        {extra}
      </div>
    </Link>
  )
}