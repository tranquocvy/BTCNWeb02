import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../components/movie/MovieCard'
import LoadingSkeleton from '../components/movie/LoadingSkeleton'
import { searchMovies, searchPeople } from '../services/api/endpoints/movie'
import Pagination from '../components/ui/Pagination'

const DEFAULT_LIMIT = 12

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = (searchParams.get('type') || 'Movie')
  const title = (type === 'Person' ? (searchParams.get('person') || '') : (searchParams.get('title') || ''))
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [movies, setMovies] = useState([])
  const [total, setTotal] = useState(null)
  const [totalPagesState, setTotalPagesState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(pageParam)

  useEffect(() => setPage(pageParam), [pageParam])

  useEffect(() => {
    let mounted = true

    async function fetchResults() {
      if (!title || title.trim() === '') {
        setMovies([])
        setTotal(null)
        setTotalPagesState(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const query = title.trim()
        let res
        if (type === 'Person') {
          res = await searchPeople(query, page, DEFAULT_LIMIT)
        } else {
          res = await searchMovies(query, page, DEFAULT_LIMIT)
        }

        const items = res && Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []
        const totalCount = res && typeof res.total === 'number' ? res.total : null
        const serverPage = res && typeof res.current_page === 'number' ? res.current_page : page
        const serverTotalPages = res && typeof res.total_pages === 'number' ? res.total_pages : (totalCount ? Math.max(1, Math.ceil(totalCount / DEFAULT_LIMIT)) : null)

        if (!mounted) return

        setMovies(items)
        setTotal(totalCount)
        setTotalPagesState(serverTotalPages)
        setPage(serverPage)
      } catch (err) {
        if (!mounted) return
        setError(err.message || String(err))
      } finally {
        if (!mounted)
        {setLoading(false)}
      }
    }

    fetchResults()

    return () => {
      mounted = false
    }
  }, [title, page, type])

  function goToPage(p) {
    const params = Object.fromEntries([...searchParams])
    if (p <= 1) delete params.page
    else params.page = String(p)
    setSearchParams(params)
  }

  const totalPages = (totalPagesState && typeof totalPagesState === 'number')
    ? totalPagesState
    : (total && typeof total === 'number' ? Math.max(1, Math.ceil(total / DEFAULT_LIMIT)) : (movies.length ? (movies.length < DEFAULT_LIMIT ? page : null) : 0))

  return (
    <div className="py-8">
      <div className="max-w-[1200px] mx-auto px-4">

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: DEFAULT_LIMIT }).map((_, i) => (
              <LoadingSkeleton key={i} variant="compact" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-6 text-red-400">Error: {error}</div>
        )}

        {!loading && !error && (
          <>
            {(!movies || movies.length === 0) ? (
              <div className="text-center py-12 text-gray-400">Not found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {movies.map((m) => (
                  <MovieCard key={m.id || m._id} movie={m} variant="compact" />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={totalPages || 0}
                totalItems={typeof total === 'number' ? total : null}
                pageSize={DEFAULT_LIMIT}
                onChange={(p) => goToPage(p)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}