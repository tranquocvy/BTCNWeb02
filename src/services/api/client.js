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

  if (TOKEN) {
    init.headers = {
      ...init.headers,
      'x-app-token': TOKEN,
    }
  }

  // Additionally send user token from localStorage if logged in
  const userToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (userToken) {
    init.headers = {
      ...init.headers,
      Authorization: `Bearer ${userToken}`,
    }
  }

  if (init.body && typeof init.body === 'object') {
    init.headers = { ...init.headers, 'Content-Type': 'application/json' }
    init.body = JSON.stringify(init.body)
  }

  let res
  try {
    res = await fetch(url, init)
  } catch (err) {
    const e = new Error(`Network error when fetching ${url}: ${err && err.message ? err.message : String(err)}`)
    e.cause = err
    throw e
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let parsed = null
    try {
      parsed = text ? JSON.parse(text) : null
    } catch {
      parsed = null
    }
    const serverMessage = parsed && (parsed.message || parsed.error || parsed.msg) ? (parsed.message || parsed.error || parsed.msg) : null
    const errMessage = serverMessage || `HTTP ${res.status} ${res.statusText} when fetching ${url}`
    const err = new Error(errMessage)
    err.status = res.status
    err.body = parsed ?? text
    throw err
  }

  return await res.json().catch(() => null)
}

export { request }
export default { request }
