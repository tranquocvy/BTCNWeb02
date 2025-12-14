import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoadingSkeleton from '../components/movie/LoadingSkeleton'
import { getMovie } from '../services/api/endpoints/movie'

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function fetchMovie() {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const data = await getMovie(id)
        if (!mounted) return
        setMovie(data)
      } catch (err) {
        if (!mounted) return
        setError(err.message || String(err))
      } finally {
        if (!mounted) setLoading(false)
      }
    }

    fetchMovie()
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <div className="max-w-[1200px] mx-auto px-4 py-8"><LoadingSkeleton variant="large" /></div>
  if (error) return <div className="max-w-[1200px] mx-auto px-4 py-8 text-red-400">Error: {error}</div>
  if (!movie) return <div className="max-w-[1200px] mx-auto px-4 py-8 text-gray-400">No movie found</div>

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="md:w-2/5 self-start">
          {movie.image && (
            <img
              src={movie.image}
              alt={movie.full_title || 'Movie poster'}
              className="w-full rounded-lg max-h-[700px] object-cover border border-white/60"
            />
          )}
        </div>

        {/* Info */}
        <div className="md:w-3/5 space-y-6">
          {/* Title */}
          {movie.full_title && (
            <h1 className="text-4xl font-bold text-white">{movie.full_title}</h1>
          )}

          {/* Meta info */}
          <div className="space-y-2 text-gray-300">
            {movie.year && (
              <div><span className="font-semibold">Year:</span> {movie.year}</div>
            )}

            {movie.runtime && (
              <div><span className="font-semibold">Runtime:</span> {movie.runtime}</div>
            )}

            {Array.isArray(movie.genres) && movie.genres.length > 0 && (
              <div><span className="font-semibold">Genres:</span> {movie.genres.join(', ')}</div>
            )}

            {Array.isArray(movie.countries) && movie.countries.length > 0 && (
              <div><span className="font-semibold">Countries:</span> {movie.countries.join(', ')}</div>
            )}

            {Array.isArray(movie.languages) && movie.languages.length > 0 && (
              <div><span className="font-semibold">Languages:</span> {movie.languages.join(', ')}</div>
            )}
          </div>

          {/* Directors */}
          {Array.isArray(movie.directors) && movie.directors.length > 0 && (
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Directors</h3>
              <div className="flex flex-wrap gap-2">
                {movie.directors.map((d) => (
                  <div key={d.id || d.name} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                    {d.image && (
                      <img src={d.image} alt={d.name} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <span className="text-sm text-gray-200">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actors */}
          {Array.isArray(movie.actors) && movie.actors.length > 0 && (
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Actors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {movie.actors.map((a) => (
                  <div key={a.id || a.name} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                    {a.image && (
                      <img src={a.image} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <span className="text-sm text-gray-200">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {movie.awards && (
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Awards</h3>
              <p className="text-sm text-gray-300">{movie.awards}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}