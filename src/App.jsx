import { useState, useEffect } from 'react'
import HeroSlide from './components/movie/Top5Movies'
import MovieList from './components/movie/MovieList'
import { fetchTopRevenueMovies, fetchPopularMovies } from './services/api/endpoints/movie'
import './App.css'

function App() {
  const [top5Movies, setTop5Movies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true)
        const [top5Data, popularData] = await Promise.all([
          fetchTopRevenueMovies(),
          fetchPopularMovies()
        ])
        setTop5Movies(top5Data)
        setPopularMovies(popularData)
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
      <div className="container mx-auto space-y-16 px-4">
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

        {!loading && !error && (
          <>
            {/* Top 5 Movies Section */}
            <section>
              <h2 className="mb-8 text-center text-4xl font-bold text-white">
                Top 5 Movies
              </h2>
              <HeroSlide movies={top5Movies} />
            </section>

            {/* Popular Movies Section */}
            <section>
              <h2 className="mb-8 text-center text-4xl font-bold text-white">
                Popular Movies
              </h2>
              <MovieList movies={popularMovies} />
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default App
