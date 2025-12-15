import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../lib/authSchema'

export default function Register({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const submitHandler = onSubmit ? handleSubmit(onSubmit) : handleSubmit((data) => {
    console.log('Register data', data)
  })

  return (
    <form onSubmit={submitHandler} className="text-left max-w-md mx-auto bg-transparent backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-md transition">

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
        <input
          type="text"
          {...register('username')}
          className="w-full px-3 py-2 rounded bg-transparent border border-white/10 text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
        <input
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 rounded bg-transparent border border-white/10 text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">Phone</label>
        <input
          type="tel"
          {...register('phone')}
          className="w-full px-3 py-2 rounded bg-transparent border border-white/10 text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">Date of birth</label>
        <input
          type="date"
          {...register('dob')}
          className="w-full px-3 py-2 rounded bg-transparent border border-white/10 text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
        />
        {errors.dob && (
          <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-3 py-2 rounded bg-transparent border border-white/10 text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-200 mb-1">Confirm password</label>
        <input
          type="password"
          {...register('confirmPassword')}
          className="w-full px-3 py-2 rounded bg-transparent border border-white/10 text-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-60 border border-yellow-600 shadow-sm transition"
        >
          {isSubmitting ? 'Submitting...' : 'Đăng ký'}
        </button>
      </div>
    </form>
  )
}
