import React, { useContext } from 'react'

export const AuthContext = React.createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
