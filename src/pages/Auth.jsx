import React from 'react'
import MainLayout from '../layouts/MainLayout'
import LoginForm from '../components/auth/Login'

export default function LoginPage() {
  const handleLogin = (data) => {
    // TODO: integrate real auth
    console.log('Logging in', data)
  }

  return (
    <MainLayout>
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Đăng nhập</h1>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </MainLayout>
  )
}
