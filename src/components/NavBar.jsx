import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NavBar() {
  return (
    <nav className="w-full bg-gray-300 shadow-sm border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              <Home size={20} className="text-gray-700" />
            </Link>
          </div>

          <div className="flex items-center">
            <form className="flex items-center" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="search" className="sr-only">Search</label>
              <input
                id="search"
                name="q"
                type="search"
                placeholder="Search movies..."
                className="h-10 w-56 sm:w-64 px-3 text-sm bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <button
                type="submit"
                aria-label="Search"
                className="h-10 px-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none"
              >
                <Search size={16} className="text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
