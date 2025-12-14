import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../components/movie/MovieCard'
import { request } from '../services/api/client'

const DEFAULT_LIMIT = 12

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams()
    const q = searchParams.get('q') || ''
    const pageParam = parseInt(searchParams.get('page') || '1', 10)

    const [movies, setMovies] = useState([])
    const [total, setTotal] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(pageParam)

    useEffect(() => setPage(pageParam), [pageParam])

    useEffect(() => {
        let mounted = true
        async function fetchResults() {
            if (!q || q.trim() === '') {
                setMovies([])
                setTotal(null)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const qs = new URLSearchParams({ q: q.trim(), page: String(page), limit: String(DEFAULT_LIMIT) })
                const res = await request(`/movies?${qs.toString()}`, { method: 'GET' })

                const items = Array.isArray(res) ? res : res && Array.isArray(res.data) ? res.data : []
                const totalCount = res && typeof res.total === 'number' ? res.total : null

                if (!mounted) { return }

                setMovies(items)
                setTotal(totalCount)
            } catch (err) {
                if (!mounted) { return }
                setError(err.message || String(err))
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        fetchResults()

        return () => {
            mounted = false
        }
    }, [q, page])

    function goToPage(p) {
        const params = Object.fromEntries([...searchParams])
        if (p <= 1) delete params.page
        else params.page = String(p)
        setSearchParams(params)
    }

    const totalPages = total ? Math.max(1, Math.ceil(total / DEFAULT_LIMIT)) : (movies.length ? (movies.length < DEFAULT_LIMIT ? page : null) : 0)

    return (
        <div className="py-8">
            <div className="max-w-[1200px] mx-auto px-4">
                <h2 className="text-2xl font-semibold mb-4">Search results for: <span className="font-bold">{q || '(empty)'}</span></h2>

                {loading && (
                    <div className="text-center py-12 text-gray-400">Loading...</div>
                )}

                {error && (
                    <div className="text-center py-6 text-red-400">Error: {error}</div>
                )}

                {!loading && !error && (
                    <>
                        {(!movies || movies.length === 0) ? (
                            <div className="text-center py-12 text-gray-400">No results</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {movies.map((m) => (
                                    <MovieCard key={m.id || m._id} movie={m} variant="compact" />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <button
                                onClick={() => goToPage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {totalPages && typeof totalPages === 'number' && (
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => {
                                        const start = Math.max(1, Math.min(page - 3, Math.max(1, totalPages - 6)))
                                        const p = start + i
                                        if (p > totalPages) return null
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => goToPage(p)}
                                                className={`px-3 py-1 rounded-md ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'}`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}

                            <button
                                onClick={() => goToPage(page + 1)}
                                disabled={movies.length < DEFAULT_LIMIT || (totalPages && page >= totalPages)}
                                className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
