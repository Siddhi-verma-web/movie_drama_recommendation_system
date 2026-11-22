import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import api from '../api'
import Card from './Card'

export default function Detail() {
  const { id } = useParams()
  const [d, setD] = useState(null)
  const [similar, setSimilar] = useState([])
  const [msg, setMsg] = useState('')
  const logged = !!localStorage.getItem('token')

  useEffect(() => {
    api.get('/dramas/' + id).then(r => setD(r.data))
    api.get(`/dramas/${id}/similar`).then(r => setSimilar(r.data))
    window.scrollTo(0, 0)
  }, [id])

  const act = async (fn, text) => { try { await fn(); setMsg(text) } catch { setMsg('Failed') } }
  if (!d) return <p className="p-5">Loading...</p>
  const link = d.platforms?.[0]?.url

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {d.poster && <img src={d.poster} className="w-64 rounded-lg self-start" />}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{d.title}</h1>
          <p className="text-gray-400 mb-3">{d.country} · {d.releaseYear} · {d.episodeCount} eps · ⭐{d.avgRating}</p>
          <div className="flex flex-wrap gap-2 mb-3 text-xs">
            {[...d.genre, ...d.moodTags, ...d.tropes].map((t, i) =>
              <span key={i} className="bg-rose-500/20 px-2 py-1 rounded">{t}</span>)}
          </div>
          <p className="mb-4">{d.overview}</p>

          {logged ? (
            <div className="flex gap-2 mb-2">
              <button className="bg-rose-600 px-3 py-2 rounded text-sm"
                onClick={() => act(() => api.post('/user/watchlist/' + id), 'Added to My List')}>+ Watchlist</button>
              <button className="bg-white/10 px-3 py-2 rounded text-sm"
                onClick={() => { const r = prompt('Rating 1-10?'); if (r) act(() => api.post('/user/watched/' + id, { rating: Number(r) }), 'Marked as watched') }}>
                Mark watched</button>
            </div>
          ) : <p className="text-sm text-gray-400 mb-2">Login to use watchlist.</p>}
          {msg && <p className="text-green-400 text-sm">{msg}</p>}

          <h2 className="mt-5 mb-2 font-semibold">Where to watch</h2>
          {d.platforms?.length ? (
            <div className="flex gap-5 items-center">
              <div>{d.platforms.map((p, i) =>
                <a key={i} href={p.url} target="_blank" className="block text-rose-400 underline">{p.name}</a>)}</div>
              {link && <div className="bg-white p-2 rounded"><QRCodeSVG value={link} size={110} /></div>}
            </div>
          ) : <p className="text-gray-400 text-sm">Platform info not available.</p>}

          {d.cast?.length > 0 && <>
            <h2 className="mt-5 mb-2 font-semibold">Cast</h2>
            <div className="flex flex-wrap gap-3">{d.cast.map(a =>
              <div key={a._id} className="w-20 text-center text-xs">
                {a.photo && <img src={a.photo} className="rounded-full w-16 h-16 object-cover mx-auto" />}
                <div>{a.name}</div></div>)}</div>
          </>}
        </div>
      </div>

      {similar.length > 0 && <>
        <h2 className="mt-8 mb-3 text-xl">You might also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {similar.map(s => <Card key={s.drama._id} d={s.drama}
            extra={<div className="text-xs text-rose-400">Match score: {s.score}</div>} />)}
        </div>
      </>}
    </div>
  )
}