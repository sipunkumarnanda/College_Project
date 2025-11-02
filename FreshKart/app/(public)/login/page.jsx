

'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const LoginPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    // Temporary login simulation (replace with actual auth logic)
    if (email === 'user@freshkart.com' && password === '123456') {
      setError('')
      router.push('/')
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-green-100">
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">
          Welcome Back to FreshKart 🥬
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <p className="text-red-500 text-center text-sm bg-red-50 py-2 rounded-md">
              {error}
            </p>
          )}

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
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-slate-300 rounded-full outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-medium transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-6">
          Don’t have an account?{' '}
          <Link href="/register" className="text-green-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
