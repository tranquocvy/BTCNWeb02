import React, { useState } from 'react'
import { AuthContext } from './AuthContextCore'
import { logoutUser } from '../services/api/endpoints/auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('auth_user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })
  
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('auth_token') || null
    } catch {
      return null
    }
  })

  const login = (userObj, tokenStr) => {
    if (tokenStr) {
      localStorage.setItem('auth_token', tokenStr)
      setToken(tokenStr)
    }
    if (userObj) {
      try { localStorage.setItem('auth_user', JSON.stringify(userObj)) } catch {console.error();
      }
      setUser(userObj)
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
    } catch {
      console.error()
    }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
    try { window.location.reload() } catch {return null}
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth } from './AuthContextCore'
export default AuthProvider
