import React from 'react'
import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#682480] to-[#3864CC] text-white shadow-lg w-full">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
            <div className="flex-0">
              <div className="text-sm font-medium text-white">23120410</div>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="text-lg font-semibold text-white">Moviews info</div>
            </div>

            <div className="flex-0 flex items-center gap-3">
              <button
                type="button"
                aria-label="Dark mode switch (placeholder)"
                className="relative inline-flex items-center w-12 h-6 rounded-full bg-white/20 focus:outline-none"
              >
                <span className="inline-block w-4 h-4 bg-white rounded-full transform translate-x-0" />
              </button>

              <Settings className="text-white" size={18} />
            </div>
          </div>
        </div>
    </header>
  )
}
