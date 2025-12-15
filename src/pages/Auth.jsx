import React, { useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import LoginForm from '../components/auth/Login'
import RegisterForm from '../components/auth/Register'

export default function AuthPage() {
  const [tab, setTab] = useState('login')

  const handleLogin = (data) => {
    console.log('Logging in', data)
  }
  const handleRegister = (data) => {
    console.log('Registering', data)
  }

  return (
    <MainLayout>
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="bg-transparent max-w-2xl mx-auto">
          <div className="bg-transparent rounded-lg shadow-lg overflow-hidden">
            <div className="flex">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-3 text-center font-semibold ${tab === 'login' ? 'bg-white/6 text-white' : 'text-gray-300'}`}
              >
                ĐĂNG NHẬP
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-3 text-center font-semibold ${tab === 'register' ? 'bg-white/6 text-white' : 'text-gray-300'}`}
              >
                ĐĂNG KÝ
              </button>
            </div>

            <div className="p-6">
              {tab === 'login' ? (
                <div>
                  <h1 className="text-2xl font-bold text-white mb-4">Đăng nhập</h1>
                  <LoginForm onSubmit={handleLogin} />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-white mb-4">Đăng ký</h1>
                  <RegisterForm onSubmit={handleRegister} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
