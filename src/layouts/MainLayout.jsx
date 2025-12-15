import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/main/Header'
import NavBar from '@/components/main/NavBar'
import Footer from '@/components/main/Footer'
import { Outlet } from 'react-router-dom'

import HeroSlide from '../components/movie/Top5Movies'
import MovieList from '../components/movie/MovieList'
import LoadingSkeleton from '../components/movie/LoadingSkeleton'
import { fetchTopRevenueMovies, fetchPopularMovies, fetchTopRatedMovies } from '../services/api/endpoints/movie'

export default function MainLayout({ children }) {
  const [top5Movies, setTop5Movies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') return

    let mounted = true
    async function loadMovies() {
      try {
        setLoading(true)
        const [top5Data, popularData, topRatedData] = await Promise.all([
          fetchTopRevenueMovies(),
          fetchPopularMovies(),
          fetchTopRatedMovies()
        ])
        if (!mounted) return
        setTop5Movies(top5Data)
        setPopularMovies(popularData)
        setTopRatedMovies(topRatedData)
        setError(null)
      } catch (err) {
        console.error('Error loading movies:', err)
        if (!mounted) return
        setError(err.message)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadMovies()
    return () => { mounted = false }
  }, [location.pathname])

  return (
    <div className="border border-black/50 min-h-screen flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Header />
      <NavBar />
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        {children ? (
          children
        ) : (
          <>
            {loading && (
              <div className="space-y-12">
                {/* Top5 skeleton */}
                <section>
                  <h2 className="mb-8 text-center text-4xl font-bold text-white">Top 5 Movies</h2>
                  <div className="flex items-center justify-center">
                    <LoadingSkeleton variant="large" />
                  </div>
                </section>

                {/* Popular skeletons */}
                <section>
                  <h2 className="mb-8 text-center text-4xl font-bold text-white">Popular Movies</h2>
                  <div className="flex items-start justify-center gap-6">
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                  </div>
                </section>

                {/* Top Rated skeletons */}
                <section>
                  <h2 className="mb-8 text-center text-4xl font-bold text-white">Top Rated Movies</h2>
                  <div className="flex items-start justify-center gap-6">
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                  </div>
                </section>
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
                  <h2 className="m-4 text-left text-4xl font-bold text-black/60 dark:text-white/60">Top 5 Movies</h2>
                  <HeroSlide movies={top5Movies} />
                </section>

                {/* Popular Movies Section */}
                <section>
                  <h2 className="m-4 text-left text-4xl font-bold text-black/60 dark:text-white/60">Popular Movies</h2>
                  <MovieList movies={popularMovies} />
                </section>

                {/* Top Rated Movies Section */}
                <section>
                  <h2 className="m-4 text-left text-4xl font-bold text-black/60 dark:text-white/60">Top Rated Movies</h2>
                  <MovieList movies={topRatedMovies} />
                </section>
              </>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
