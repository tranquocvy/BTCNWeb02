import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Star, Trash2 } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import { getFavorites, removeFavorite } from '../services/api/endpoints/auth'
import { useAuth } from '../context/AuthContext'
import LoadingSkeleton from '../components/movie/LoadingSkeleton'
import Pagination from '../components/ui/Pagination'

export default function Favorites() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingIds, setRemovingIds] = useState(new Set())
  const [page, setPage] = useState(1)
  const limit = 9

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    let mounted = true
    async function fetchFavorites() {
      setLoading(true)
      setError(null)
      try {
          const data = await getFavorites()
          if (!mounted) return
          setFavorites(Array.isArray(data) ? data : [])
          setPage(1)
        } catch (err) {
        if (!mounted) return
        setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchFavorites()
    return () => { mounted = false }
  }, [user, navigate])

  const handleRemoveFavorite = async (movieId, event) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (removingIds.has(movieId)) return

    setRemovingIds(prev => new Set(prev).add(movieId))
    try {
      await removeFavorite(movieId)
      setFavorites(prev => {
        const next = prev.filter(movie => movie.id !== movieId)
        // adjust current page if last item on page removed
        const totalPages = Math.max(1, Math.ceil(next.length / limit))
        if (page > totalPages) setPage(totalPages)
        return next
      })
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra')
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(movieId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <LoadingSkeleton key={i} variant="compact" />
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="text-center text-red-500">Lỗi: {error}</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="text-red-500 fill-red-500" size={32} />
            <h1 className="text-4xl font-bold">Phim Yêu Thích</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length > 0 
              ? `Bạn có ${favorites.length} bộ phim yêu thích`
              : 'Chưa có phim yêu thích nào'}
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Chưa có phim yêu thích
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Khám phá và thêm những bộ phim bạn yêu thích vào danh sách này!
            </p>
            <Link
              to="/home"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#682480] to-[#3864CC] text-white rounded-lg hover:opacity-90 transition"
            >
              Khám phá phim
            </Link>
          </div>
        ) : (
          /* Movies Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.slice((page - 1) * limit, page * limit).map((movie) => (
                <FavoriteMovieCard
                  key={movie.id}
                  movie={movie}
                  onRemove={handleRemoveFavorite}
                  isRemoving={removingIds.has(movie.id)}
                />
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={Math.max(1, Math.ceil(favorites.length / limit))}
                totalItems={favorites.length}
                pageSize={limit}
                onChange={(p) => setPage(p)}
              />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}

function FavoriteMovieCard({ movie, onRemove, isRemoving }) {
  return (
    <div className="group relative">
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative w-full h-[500px] overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
          {/* Movie Poster */}
          <div className="relative h-full overflow-hidden">
            <img
              src={movie.image_url || movie.image}
              alt={movie.full_title || movie.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Rating Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-yellow-500/90 px-3 py-1 backdrop-blur-sm z-10">
              <Star className="h-4 w-4 fill-current text-white" />
              <span className="text-sm font-bold text-white">{movie.rate}</span>
            </div>

            {/* Remove Button */}
            <button
              onClick={(e) => onRemove(movie.id, e)}
              disabled={isRemoving}
              className={`absolute top-3 left-3 p-2 rounded-full bg-red-500/90 hover:bg-red-600 text-white backdrop-blur-sm transition-all z-10 ${
                isRemoving ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
              title="Xóa khỏi yêu thích"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Info Overlay - Always Visible */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="font-bold text-white line-clamp-2 text-lg mb-2">
              {movie.full_title || movie.title}
            </h3>
            <p className="text-sm text-gray-200 font-medium mb-2">Year: {movie.release_year || movie.year}</p>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {movie.genres.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-purple-600/80 px-3 py-1 text-xs font-medium text-white"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Plot - Show on hover */}
            {movie.plot && movie.plot !== 'string' && (
              <p className="text-xs text-gray-300 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {movie.plot}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
