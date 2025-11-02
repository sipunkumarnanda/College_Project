

'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const RegisterPage = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRegister = (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Temporary registration simulation (replace with backend logic)
    setSuccess(true)
    setError('')

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-green-100">
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">
          Create Your FreshKart Account 🥗
        </h1>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <p className="text-red-500 text-center text-sm bg-red-50 py-2 rounded-md">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-center text-sm bg-green-50 py-2 rounded-md">
              Registration successful! Redirecting to login...
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-slate-300 rounded-full outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-full outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-slate-300 rounded-full outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 border border-slate-300 rounded-full outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
