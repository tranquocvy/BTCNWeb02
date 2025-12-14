import { request } from '../client'

/**
 * Get person details by id (endpoint: /persons/{id})
 */
export async function getPerson(id) {
  if (!id) return null
  let res = await request(`/persons/${id}`, { method: 'GET' })

  return res && res.data ? res.data : res
}

export default { getPerson }
