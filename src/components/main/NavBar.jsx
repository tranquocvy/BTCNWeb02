import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NavBar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTitle = searchParams.get('title') || ''
  const [query, setQuery] = useState(initialTitle)

  useEffect(() => {
    setQuery(initialTitle)
  }, [initialTitle])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed === '') {
      navigate('/search')
    } else {
      navigate(`/search?title=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <nav className="w-full bg-gray-300 dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" aria-label="Home" className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white cursor-pointer">
              <Home size={20} className="text-gray-700 dark:text-gray-200 cursor-pointer" />
            </Link>
          </div>

          <div className="flex items-center">
            <form className="flex items-center" onSubmit={handleSubmit}>
              <label htmlFor="search" className="sr-only">Search</label>
              <input
                id="search"
                name="title"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies..."
                className="h-10 w-56 sm:w-64 px-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-400"
              />
              <button
                type="submit"
                aria-label="Search"
                className="h-10 px-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-r-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none"
              >
                <Search size={16} className="text-white cursor-pointer" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
