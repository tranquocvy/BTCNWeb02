import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tag, Clock, Calendar, Globe, Languages, NotebookPen  } from 'lucide-react'
import LoadingSkeleton from '../components/movie/LoadingSkeleton'
import { getMovie } from '../services/api/endpoints/movie'

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #1f2937;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
`

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [plotExpanded, setPlotExpanded] = useState(false)

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
    <>
      <style>{scrollbarStyles}</style>
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
            <h1 className="text-5xl font-extrabold text-white uppercase tracking-wide">{movie.full_title}</h1>
          )}

          {/* Meta info */}
          <div className="space-y-3 text-gray-200">
            {Array.isArray(movie.genres) && movie.genres.length > 0 && (
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-yellow-400" />
                <span className="text-lg">{movie.genres.join(', ')}</span>
              </div>
            )}

            {movie.runtime && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-lg">{movie.runtime}</span>
              </div>
            )}

            {movie.year && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <span className="text-lg">{movie.year}</span>
              </div>
            )}

            {Array.isArray(movie.countries) && movie.countries.length > 0 && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-yellow-400" />
                <span className="text-lg">{movie.countries.join(', ')}</span>
              </div>
            )}

            {Array.isArray(movie.languages) && movie.languages.length > 0 && (
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-yellow-400" />
                <span className="text-lg">{movie.languages.join(', ')}</span>
              </div>
            )}

            {Array.isArray(movie.directors) && movie.directors.length > 0 && (
              <div className="flex items-center gap-3">
                <NotebookPen  className="w-5 h-5 text-yellow-400" />
                <span className="text-lg">{movie.directors.map(d => d.name).join(', ')}</span>
              </div>
            )}

            {movie.rating_age && (
              <div className="flex items-center gap-3">
                <span className="bg-yellow-400 text-black px-3 py-1 rounded font-bold text-base">{movie.rating_age}</span>
              </div>
            )}
          </div>

          {/* Plot */}
          {movie.plot_full && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 items-left">NỘI DUNG PHIM</h3>
              <div
                className={`text-base text-gray-300 leading-relaxed transition-all ${plotExpanded ? '' : 'max-h-36 overflow-hidden'}`}
                dangerouslySetInnerHTML={{ __html: movie.plot_full }}
              />
              <button
                onClick={() => setPlotExpanded(p => !p)}
                className="mt-2 text-sm text-yellow-400 font-semibold cursor-pointer hover:underline"
                aria-expanded={plotExpanded}
              >
                {plotExpanded ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>
          )}

          {/* Cast Images - Horizontal Scroll */}
          {Array.isArray(movie.actors) && movie.actors.length > 0 && movie.actors.some(a => a.image) && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 uppercase">DIỄN VIÊN</h3>
              <div className="flex gap-4 overflow-x-auto pb-3 custom-scrollbar">
                {movie.actors.filter(a => a.image).map((a) => (
                  <div key={a.id || a.name} className="flex flex-col items-center gap-2 bg-gray-800 p-3 rounded min-w-[120px]">
                    <img src={a.image} alt={a.name} className="w-20 h-20 rounded-full object-cover" />
                    <span className="text-sm text-gray-200 text-center">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Awards */}
          {movie.awards && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 uppercase">GIẢI THƯỞNG</h3>
              <p className="text-base text-gray-300">{movie.awards}</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  )
}