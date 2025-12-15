import { request } from '../client'

/**
 * Register a new user
 * @param {{username:string,email:string,password:string,phone?:string,dob?:string}} body
 * @returns {Promise<any>} response JSON
 */
export async function registerUser(body) {
  if (!body || typeof body !== 'object') throw new Error('registerUser requires a body object')
  return await request('/users/register', { method: 'POST', body })
}

/**
 * Login user
 * @param {{username:string,password:string}} body
 * @returns {Promise<any>} response JSON (typically tokens/user)
 */
export async function loginUser(body) {
  if (!body || typeof body !== 'object') throw new Error('loginUser requires a body object')
  return await request('/users/login', { method: 'POST', body })
}

export default { registerUser, loginUser }
