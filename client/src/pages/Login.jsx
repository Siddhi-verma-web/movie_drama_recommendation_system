import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [signup, setSignup] = useState(false)
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const submit = async e => {
    e.preventDefault()
    try {
      const r = await api.post(signup ? '/auth/signup' : '/auth/login', f)
      localStorage.setItem('token', r.data.token)
      nav('/'); location.reload()
    } catch (e) { setErr(e.response?.data?.error || 'Error') }
  }
  const cls = 'w-full bg-white/10 rounded px-3 py-2 mb-3'
  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-16 p-6 bg-white/5 rounded-lg">
      <h1 className="text-xl mb-4">{signup ? 'Create account' : 'Login'}</h1>
      {signup && <input className={cls} placeholder="Name" onChange={e => setF({ ...f, name: e.target.value })} />}
      <input className={cls} type="email" placeholder="Email" onChange={e => setF({ ...f, email: e.target.value })} />
      <input className={cls} type="password" placeholder="Password" onChange={e => setF({ ...f, password: e.target.value })} />
      {err && <p className="text-red-400 text-sm mb-2">{err}</p>}
      <button className="w-full bg-rose-600 py-2 rounded">{signup ? 'Sign up' : 'Login'}</button>
      <p className="text-sm text-gray-400 mt-3 cursor-pointer" onClick={() => setSignup(!signup)}>
        {signup ? 'Already have an account? Login' : 'New here? Sign up'}</p>
    </form>
  )
}