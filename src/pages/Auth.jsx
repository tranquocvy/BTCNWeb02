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
    setTab('login')
  }

  return (
    <MainLayout>
      <div className="max-w-[900px] mx-auto px-4 py-8">
        <div className="bg-transparent max-w-2xl mx-auto">
          <div className="bg-transparent border border-black/20 dark:border-white/20 rounded-lg shadow-lg overflow-hidden">
            <div className="flex">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-3 text-center cursor-pointer font-semibold ${tab === 'login' ? 'bg-black/20 dark:bg-white/6' : 'dark:text-gray-300'}`}
              >
                ĐĂNG NHẬP
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-3 text-center cursor-pointer font-semibold ${tab === 'register' ? 'bg-black/20 dark:bg-white/6' : 'dark:text-gray-300'}`}
              >
                ĐĂNG KÝ
              </button>
            </div>

            <div className="p-6 border border-t-black/20 dark:border-t-white/10">
              {tab === 'login' ? (
                <div>
                  <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
                  <LoginForm onSubmit={handleLogin} />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
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
