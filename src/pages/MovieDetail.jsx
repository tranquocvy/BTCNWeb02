import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Tag, Clock, Calendar, Globe, Languages, NotebookPen, Trophy, Heart } from 'lucide-react'
import LoadingSkeleton from '../components/movie/LoadingSkeleton'
import { getMovie, getMovieReviews } from '../services/api/endpoints/movie'
import { addFavorite, removeFavorite, getFavorites } from '../services/api/endpoints/auth'
import { useAuth } from '../context/AuthContext'
import Pagination from '../components/ui/Pagination'

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
  const navigate = useNavigate()
  const { user } = useAuth()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [plotExpanded, setPlotExpanded] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsMeta, setReviewsMeta] = useState({ total: 0, current_page: 1, total_pages: 1, page_size: 10 })
  const [expandedReviews, setExpandedReviews] = useState(new Set())
  const [reviewsPage, setReviewsPage] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

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
        setReviewsPage(1)
      } catch (err) {
        if (!mounted) return
        setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchMovie()
    return () => {
      mounted = false
    }
  }, [id])

  // Check if movie is in favorites
  useEffect(() => {
    if (!user || !movie) return
    let mounted = true
    async function checkFavorite() {
      try {
        const favorites = await getFavorites()
        if (!mounted) return
        // Check if current movie is in favorites list
        const isFav = Array.isArray(favorites) && favorites.some(fav => fav.id === movie.id || fav.movie_id === movie.id)
        setIsFavorite(isFav)
      } catch (err) {
        console.error('Error checking favorites:', err)
      }
    }
    checkFavorite()
    return () => { mounted = false }
  }, [user, movie])

  const handleFavoriteToggle = async () => {
    // Check if user is logged in
    if (!user) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này!')
      navigate('/login')
      return
    }

    if (!movie || !movie.id) return

    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        await removeFavorite(movie.id)
        setIsFavorite(false)
      } else {
        await addFavorite(movie.id)
        setIsFavorite(true)
      }
    } catch (err) {
      alert(err.message || 'Có lỗi xảy ra')
    } finally {
      setFavoriteLoading(false)
    }
  }

  useEffect(() => {
    if (!movie || !movie.id) return
    let mounted = true
    async function fetchReviews() {
      setReviewsLoading(true)
      try {
        const limit = reviewsMeta.page_size || 10
        const res = await getMovieReviews(movie.id, reviewsPage, limit)
        if (!mounted) return
        setReviews(Array.isArray(res.data) ? res.data : [])
        setReviewsMeta({ total: res.total || 0, current_page: res.current_page || reviewsPage, total_pages: res.total_pages || 1, page_size: res.page_size || limit })
      } catch (err) {
        if (!mounted) return
        console.error(err)
      } finally {
        if (mounted) {
          setReviewsLoading(false)
        }
      }
    }
    fetchReviews()
    return () => { mounted = false }
  }, [movie && movie.id, reviewsPage])

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
        <div className="md:w-3/5 space-y-5 text-white dark:text-gray-300">
          {/* Title and Favorite Button */}
          {movie.full_title && (
            <div className="flex items-start gap-4">
              <h1 className="text-5xl font-extrabold text-black/80 dark:text-gray-200 uppercase tracking-wide flex-1">{movie.full_title}</h1>
              <button
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                className={`flex-shrink-0 p-3 rounded-full transition-all ${
                  favoriteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
                } ${isFavorite ? 'bg-red-500/20' : ' dark:bg-white/10 bg-black/20'}`}
                title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              >
                <Heart
                  size={32}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}
                />
              </button>
            </div>
          )}

          {/* Meta info */}
          <div className="space-y-3 text-black/80 dark:text-gray-200">
            {Array.isArray(movie.genres) && movie.genres.length > 0 && (
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-lg">{movie.genres.join(', ')}</span>
              </div>
            )}

            {movie.runtime && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-lg">{movie.runtime}</span>
              </div>
            )}

            {movie.year && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-lg">{movie.year}</span>
              </div>
            )}

            {Array.isArray(movie.countries) && movie.countries.length > 0 && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-lg">{movie.countries.join(', ')}</span>
              </div>
            )}

            {Array.isArray(movie.languages) && movie.languages.length > 0 && (
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-lg">{movie.languages.join(', ')}</span>
              </div>
            )}

            {Array.isArray(movie.directors) && movie.directors.length > 0 && (
              <div className="flex items-center gap-3">
                <NotebookPen  className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div className="text-lg flex flex-wrap gap-1">
                  {movie.directors.map((d, i) => (
                    <span key={d.id || d.name}>
                      {i > 0 && <span className="text-gray-400">, </span>}
                      <Link to={`/person/${d.id || d.name}`} className="hover:underline text-lg ">{d.name}</Link>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Awards */}
          {movie.awards && (
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <p className="text-left text-base text-yellow-600 dark:text-yellow-400 font-semibold">{movie.awards}</p>
              </div>
            </div>
          )}

          {/* Cast Images - Horizontal Scroll */}
          {Array.isArray(movie.actors) && movie.actors.length > 0 && movie.actors.some(a => a.image) && (
            <div>
              <h3 className="text-left text-2xl font-bold text-black/80 dark:text-gray-200 mb-3 uppercase">DIỄN VIÊN</h3>
              <div className="flex gap-4 overflow-x-auto pb-3 custom-scrollbar">
                {movie.actors.filter(a => a.image).map((a) => (
                  <Link key={a.id || a.name} to={`/person/${a.id || a.name}`} className="flex flex-col items-start gap-2 bg-gray-800 p-3 rounded min-w-[120px] hover:brightness-110">
                    <img src={a.image} alt={a.name} className="w-20 h-20 rounded-full object-cover" />
                    <span className="text-sm text-gray-200 text-left w-full hover:underline">{a.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plot */}
      {movie.plot_full && (
        <div className="text-left w-full mt-8">
          <h3 className="text-2xl font-bold text-black/80 dark:text-gray-200 mb-3">NỘI DUNG PHIM</h3>
          <div
            className={`text-left text-base text-black/80 dark:text-gray-300 leading-relaxed transition-all ${plotExpanded ? '' : 'max-h-36 overflow-hidden'}`}
            dangerouslySetInnerHTML={{ __html: movie.plot_full }}
          />
          <button
            onClick={() => setPlotExpanded(p => !p)}
            className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-semibold cursor-pointer hover:underline"
            aria-expanded={plotExpanded}
          >
            {plotExpanded ? 'Thu gọn' : 'Xem thêm'}
          </button>
        </div>
      )}

      {/* Reviews */}
      <div className="w-full mt-8">
        <h2 className="flex text-2xl font-bold text-black/80 dark:text-gray-200 mb-4">REVIEWS ({reviewsMeta.total})</h2>
        {reviewsLoading ? (
          <div className="text-gray-500">Đang tải reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-500">Chưa có review cho phim này.</div>
        ) : (
          <div className="flex text-left flex-col gap-4">
            {reviews.map((r, idx) => {
              const idKey = r.id || r.username || `rev-${idx}`
              const expanded = expandedReviews.has(idKey)
              return (
                <div
                  key={idKey}
                  onClick={() => setExpandedReviews(prev => {
                    const s = new Set(prev)
                    if (s.has(idKey)) s.delete(idKey)
                    else s.add(idKey)
                    return s
                  })}
                  className="w-full border border-white/10 rounded bg-gray-900 p-4 cursor-pointer hover:bg-gray-800 transition"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                        {r.username ? r.username.charAt(0).toUpperCase() : '?'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-gray-200">{r.username || 'Người dùng'}</div>
                          {r.title && <div className="text-sm text-white font-semibold mt-1">{r.title}</div>}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          {r.rate ? <span>Rating: {r.rate}</span> : null}
                          {r.warning_spoilers ? <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">Spoiler</span> : null}
                          <span>{r.date ? new Date(r.date).toLocaleDateString() : ''}</span>
                        </div>
                      </div>
                      <div
                        className={`mt-2 text-gray-300 text-sm transition-all ${expanded ? '' : 'filter blur-sm'}`}
                        style={expanded ? {} : { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {r.content}
                      </div>
                      <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 font-semibold">{expanded ? 'Thu gọn' : 'Bấm để đọc'}</div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="mt-4">
              <Pagination page={reviewsMeta.current_page || reviewsPage} totalPages={reviewsMeta.total_pages || 1} onChange={(p) => setReviewsPage(p)} />
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  )
}