
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useDispatch } from 'react-redux';
import { setUser } from '@/lib/features/auth/authSlice';
import { fetchCart } from "@/lib/features/cart/cartSlice";
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch(); // ✅ ADD

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError('Please fill in all fields.');
    toast.error("Please fill in all fields"); // ✅ ADD
    return;
  }

  try {
    setLoading(true);
    setError('');

    const res = await api.post('/auth/login', {
      email,
      password,
    });

    // ✅ Set user instantly
    dispatch(setUser(res.data.user));

    // 🔥 Load cart
    await dispatch(fetchCart());

    // ✅ SUCCESS TOAST
    toast.success(`Welcome ${res.data.user.name} 👋`);

    // redirect
    router.push('/');
  } catch (err) {
    const message =
      err.response?.data?.message || 'Login failed. Try again.';

    setError(message);

    // ❌ ERROR TOAST
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

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
              className="w-full px-4 py-3 border rounded-full"
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
              className="w-full px-4 py-3 border rounded-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Don’t have an account?{' '}
          <Link href="/register" className="text-green-600">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;