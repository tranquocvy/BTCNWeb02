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

/**
 * Get current user profile
 * @returns {Promise<any>} user profile data
 */
export async function getUserProfile() {
  return await request('/users/profile', { method: 'GET' })
}

/**
 * Update current user profile
 * @param {{email?:string,phone?:string,dob?:string}} body
 * @returns {Promise<any>} updated user data
 */
export async function updateUserProfile(body) {
  if (!body || typeof body !== 'object') throw new Error('updateUserProfile requires a body object')
  return await request('/users/profile', { method: 'PATCH', body })
}

export default { registerUser, loginUser, getUserProfile, updateUserProfile }
