import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { loginSchema } from '../../lib/authSchema'
import { loginUser } from '../../services/api/endpoints/auth'
import { useAuth } from '../../context/AuthContext'

export default function Login({ onSubmit }) {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const auth = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const submitHandler = handleSubmit(async (data) => {
    setServerError(null)
    setSuccessMessage(null)
    try {
      const res = await loginUser(data)
      const token = res?.token || res?.access_token || res?.accessToken || (res && res.data && res.data.token)
      const user = res?.user || res?.data?.user || null
      const message = res?.message || res?.msg || 'Đăng nhập thành công'
      if (token) localStorage.setItem('auth_token', token)
      if (user) localStorage.setItem('auth_user', JSON.stringify(user))
      // update global auth state
      auth.login(user, token)
      setSuccessMessage(message)
      if (onSubmit) onSubmit(data, res)
      // Navigate after short delay so user sees success message
      setTimeout(() => navigate('/home'), 1200)
    } catch (err) {
      setServerError(err.message || String(err))
    }
  })

  return (
    <form
      onSubmit={submitHandler}
      className="text-left max-w-md mx-auto bg-trans backdrop-blur-md border border-black/20 dark:border-white/20 p-6 rounded-xl shadow-md transition"
    >
      {successMessage && (
        <div role="status" aria-live="polite" className="mb-4 p-3 rounded-md bg-green-700 bg-opacity-90 text-white text-sm font-medium">
          {successMessage}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Username</label>
        <input
          type="text"
          {...register('username')}
          className="w-full px-3 py-2 rounded bg-trans border border-black/20 dark:border-white/10 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-3 py-2 rounded bg-transparent border border-black/20 dark:border-white/10 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-60 border border-yellow-600 shadow-sm transition"
        >
          {isSubmitting ? 'Submitting...' : 'Login'}
        </button>
        {serverError && <p className="text-red-400 text-sm mt-2">{serverError}</p>}
      </div>
    </form>
  )
}
