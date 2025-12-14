// Minimal fetch wrapper for API requests (services/api/client.js)
// Reads VITE_API_BASE and VITE_API_TOKEN from environment (Vite: import.meta.env)
const BASE = import.meta.env.VITE_API_BASE || ''
const TOKEN = import.meta.env.VITE_API_TOKEN || null

async function request(path, options = {}) {
  const url = `${BASE}${path}`
  const init = {
    headers: { Accept: 'application/json' },
    ...options,
  }

  // attach Authorization header when token exists
  if (TOKEN) {
    init.headers = { ...init.headers, Authorization: `Bearer ${TOKEN}` }
  }

  if (init.body && typeof init.body === 'object') {
    init.headers = { ...init.headers, 'Content-Type': 'application/json' }
    init.body = JSON.stringify(init.body)
  }

  const res = await fetch(url, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(`HTTP ${res.status} ${res.statusText}`)
    err.status = res.status
    err.body = text
    throw err
  }

  return await res.json().catch(() => null)
}

export { request }
export default { request }
