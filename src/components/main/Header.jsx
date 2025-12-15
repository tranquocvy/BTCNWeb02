import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings, CircleUser } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') return false
    const stored = window.localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark')
        window.localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        window.localStorage.setItem('theme', 'light')
      }
    } catch {
      // ignore
    }
  }, [isDark])

  const toggleTheme = () => setIsDark((v) => !v)

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#682480] to-[#3864CC] dark:from-[#3b1464] dark:to-[#123066] text-white shadow-lg w-full">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
            <div className="flex-0">
              <div className="text-sm font-medium">23120410</div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="text-lg font-semibold">Moviews info</div>
            </div>

            <div className="flex-0 flex items-center gap-3">
              <button
                type="button"
                aria-label="Toggle dark mode"
                aria-pressed={isDark}
                onClick={toggleTheme}
                className={`relative inline-flex items-center w-12 h-6 rounded-full focus:outline-none transition-colors z-50 pointer-events-auto ${isDark ? 'bg-white/30' : 'bg-white/20'} dark:bg-white/10`}
              >
                <span
                  className="inline-block w-4 h-4 bg-white rounded-full"
                  style={{ transform: isDark ? 'translateX(24px)' : 'translateX(0)', transition: 'transform 150ms ease' }}
                />
              </button>

              {/* Auth area */}
              <AuthArea />

              <Settings className="text-white" size={18} />
            </div>
          </div>
        </div>
    </header>
  )
}

function AuthArea() {
  const { user, logout } = useAuth()
  const [showLogout, setShowLogout] = useState(false)

  if (!user) {
    return (
      <Link to="/login" className="flex items-center gap-2 text-white hover:underline">
        <CircleUser size={28} />
        <span className="text-sm">Đăng nhập</span>
      </Link>
    )
  }

  // Generate avatar from username
  const username = user.username || user.name || 'User'
  const initials = username.slice(0, 2).toUpperCase()
  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e']
  const colorIndex = username.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div className="relative">
      <button
        onClick={() => setShowLogout(!showLogout)}
        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm transition hover:opacity-80"
        style={{ backgroundColor: bgColor }}
        aria-label="User menu"
      >
        {initials}
      </button>
      {showLogout && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 min-w-[160px]">
          <Link
            to="/profile"
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowLogout(false)}
          >
            Profile
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
