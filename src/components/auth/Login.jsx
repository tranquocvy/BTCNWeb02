import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../lib/authSchema'

export default function Login({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const submitHandler = onSubmit ? handleSubmit(onSubmit) : handleSubmit((data) => {
    console.log('Login data', data)
  })

  return (
    <form
      onSubmit={submitHandler}
      className="text-left max-w-md mx-auto bg-white/5 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-md transition"
    >
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 rounded bg-transparent border border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-3 py-2 rounded bg-transparent border border-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
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
      </div>
    </form>
  )
}
