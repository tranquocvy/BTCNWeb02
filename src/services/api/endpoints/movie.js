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

export default { fetchTopRevenueMovies, fetchPopularMovies, fetchTopRatedMovies }
