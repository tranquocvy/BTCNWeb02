import { request } from '../client'

/**
 * Fetch top revenue movies (endpoint: /movies/most-popular).
 * Returns an array of 5 movies (top by revenue).
 */
export async function fetchTopRevenueMovies() {
  const qs = new URLSearchParams({ page: '1', limit: '5' })
  const data = await request(`/movies/most-popular?${qs.toString()}`, { method: 'GET' })

  if (Array.isArray(data)) return data.slice(0, 5)
  if (data && Array.isArray(data.data)) return data.data.slice(0, 5)
  return []
}


/**
 * Fetch popular movies (endpoint: /movies/most-popular).
 * call multiple pages until it collects up to ~30 items or no more data.
 */
export async function fetchPopularMovies() {
  const target = 30
  const perRequest = 12
  let page = 1
  const results = []

  while (results.length < target) {
    const qs = new URLSearchParams({ page: String(page), limit: String(perRequest) })
    const data = await request(`/movies/most-popular?${qs.toString()}`, { method: 'GET' })

    const items = Array.isArray(data) ? data : data && Array.isArray(data.data) ? data.data : []
    if (!items || items.length === 0) break

    results.push(...items)

    // If the server returned fewer than requested, probably last page
    if (items.length < perRequest) break

    page += 1
    // safety cap to avoid infinite loops
    if (page > 10) break
  }

  return results.slice(0, target)
}

/**
 * Fetch top rated movies (endpoint: /movies/top-rated).
 * Same multi-page aggregation logic as popular.
 */
export async function fetchTopRatedMovies() {
  const target = 30
  const perRequest = 12
  let page = 1
  const results = []

  while (results.length < target) {
    const qs = new URLSearchParams({ page: String(page), limit: String(perRequest) })
    const data = await request(`/movies/top-rated?${qs.toString()}`, { method: 'GET' })

    const items = Array.isArray(data) ? data : data && Array.isArray(data.data) ? data.data : []
    if (!items || items.length === 0) break

    results.push(...items)

    if (items.length < perRequest) break

    page += 1
    if (page > 10) break
  }

  return results.slice(0, target)
}

/**
 * Search movies by title (endpoint: /movies/search).
 * Returns { data, total, current_page, total_pages }
 */
export async function searchMovies(query, page = 1, limit = 12) {
  const qs = new URLSearchParams({ title: String(query || ''), page: String(page), limit: String(limit) })
  const res = await request(`/movies/search?${qs.toString()}`, {
    method: 'GET',
    headers: { title: String(query || '') }
  })

  const items = Array.isArray(res) ? res : res && Array.isArray(res.data) ? res.data : []
  const total = res && typeof res.pagination.total_items === 'number' ? res.pagination.total_items : null
  const current_page = res && typeof res.pagination.current_page === 'number' ? res.pagination.current_page : 1
  const total_pages = res && typeof res.pagination.total_pages === 'number' ? res.pagination.total_pages : 1;

  return { data: items, total, current_page, total_pages }
}

/**
 * Search people by name (endpoint: /people/search).
 * Returns { data, total, current_page, total_pages }
 */
export async function searchPeople(query, page = 1, limit = 12) {
  const qs = new URLSearchParams({ person: String(query || ''), page: String(page), limit: String(limit) })
  const res = await request(`/movies/search?${qs.toString()}`, {
    method: 'GET',
    headers: { person: String(query || '') }
  })

  const items = Array.isArray(res) ? res : res && Array.isArray(res.data) ? res.data : []
  const total = res && res.pagination && typeof res.pagination.total_items === 'number' ? res.pagination.total_items : null
  const current_page = res && res.pagination && typeof res.pagination.current_page === 'number' ? res.pagination.current_page : 1
  const total_pages = res && res.pagination && typeof res.pagination.total_pages === 'number' ? res.pagination.total_pages : (total ? Math.max(1, Math.ceil(total / limit)) : 1)

  return { data: items, total, current_page, total_pages }
}

/**
 * Get movie details by id (endpoint: /movies/{id})
 */
export async function getMovie(id) {
  if (!id) return null
  const res = await request(`/movies/${id}`, { method: 'GET' })
  return res && res.data ? res.data : res
}

/**
 * Get reviews for a movie (endpoint: /movie/{id}/reviews)
 * Returns an object: { data: [], total, current_page, total_pages, page_size }
 */
export async function getMovieReviews(id, page = 1, limit = 10) {
  if (!id) return { data: [], total: 0, current_page: 1, total_pages: 1, page_size: Number(limit) }
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) })
  const res = await request(`/movie/${id}/reviews?${qs.toString()}`, { method: 'GET' })

  const items = Array.isArray(res && res.results) ? res.results : Array.isArray(res && res.data) ? res.data : Array.isArray(res) ? res : []

  const total = res && res.pagination && typeof res.pagination.total_items === 'number' ? res.pagination.total_items : (items ? items.length : 0)
  const current_page = res && res.pagination && typeof res.pagination.current_page === 'number' ? res.pagination.current_page : Number(page)
  const total_pages = res && res.pagination && typeof res.pagination.total_pages === 'number' ? res.pagination.total_pages : (total ? Math.max(1, Math.ceil(total / limit)) : 1)
  const page_size = res && res.pagination && typeof res.pagination.page_size === 'number' ? res.pagination.page_size : Number(limit)

  return { data: items, total, current_page, total_pages, page_size }
}

export default { fetchTopRevenueMovies, fetchPopularMovies, fetchTopRatedMovies, searchMovies, getMovie, getMovieReviews }
