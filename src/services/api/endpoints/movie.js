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
 * Returns approximately 30 movies from page 1.
 */
export async function fetchPopularMovies() {
  const qs = new URLSearchParams({ page: '1', limit: '30' })
  const data = await request(`/movies/most-popular?${qs.toString()}`, { method: 'GET' })

  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.data)) return data.data
  return []
}

export default { fetchTopRevenueMovies, fetchPopularMovies }
