import { useState, useEffect } from 'react'
import HeroSlide from './components/movie/Top5Movies'
import { fetchTopRevenueMovies } from './services/api/endpoints/movie'
import './App.css'

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true)
        const data = await fetchTopRevenueMovies()
        setMovies(data)
      } catch (err) {
        console.error('Error loading movies:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Top 5 Movies
        </h1>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-white"></div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-lg bg-red-900/20 p-6 text-center">
            <p className="text-red-400">Lỗi: {error}</p>
          </div>
        )}

        {!loading && !error && <HeroSlide movies={movies} />}
      </div>
    </div>
  )
}

export default App
