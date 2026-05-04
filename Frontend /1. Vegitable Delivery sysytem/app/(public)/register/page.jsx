
'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const RegisterPage = () => {
const router = useRouter()

const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')
const [error, setError] = useState('')
const [passwordError, setPasswordError] = useState('')
const [loading, setLoading] = useState(false)

const handleRegister = async (e) => {
e.preventDefault()

setError('')
setPasswordError('')

if (!name || !email || !password || !confirmPassword) {
  setError('Please fill in all fields.')
  toast.error('Please fill all fields')
  return
}

if (password !== confirmPassword) {
  setPasswordError('Passwords do not match')
  toast.error('Passwords do not match')
  return
}

try {
  setLoading(true)

  const res = await api.post('/auth/register', {
    name,
    email,
    password
  })

  if (res.data) {
    toast.success('Registration successful 🎉')

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }

} catch (err) {
  const msg =
    err.response?.data?.message || 'Registration failed'

  setError(msg)
  toast.error(msg)
} finally {
  setLoading(false)
}

}

return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4"> <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-green-100">

    <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">
      Create Your FreshKart Account 🥗
    </h1>

    <form onSubmit={handleRegister} className="space-y-4">

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-md">
          {error}
        </p>
      )}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className="w-full px-4 py-3 border rounded-full"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-3 border rounded-full"
      />

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-full"
        />
      </div>

      <div>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full px-4 py-3 border rounded-full"
        />

        {passwordError && (
          <p className="text-red-500 text-xs mt-1 px-2">
            {passwordError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-500 text-white py-3 rounded-full"
      >
        {loading ? "Registering..." : "Register"}
      </button>

    </form>

    <p className="text-sm text-center mt-6">
      Already have an account?{' '}
      <Link href="/login" className="text-green-600">
        Login
      </Link>
    </p>

  </div>
</div>

)
}

export default RegisterPage
