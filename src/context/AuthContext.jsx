import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

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
      try { localStorage.setItem('auth_user', JSON.stringify(userObj)) } catch {}
      setUser(userObj)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
    try { window.location.reload() } catch {}
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
