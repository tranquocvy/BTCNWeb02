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

export default { fetchTopRevenueMovies, fetchPopularMovies, fetchTopRatedMovies, searchMovies }
