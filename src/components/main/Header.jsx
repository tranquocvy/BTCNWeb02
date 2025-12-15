import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Settings, CircleUser } from 'lucide-react'

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

              <Link to="/login" className="flex items-center gap-2 text-white hover:underline">
                <CircleUser size={34} />
                <span className="text-sm">Đăng nhập</span>
              </Link>

              <Settings className="text-white" size={18} />
            </div>
          </div>
        </div>
    </header>
  )
}
