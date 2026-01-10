'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isGuest: boolean
  login: (password: string) => boolean
  loginAsGuest: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isGuest, setIsGuest] = useState(false)

  // 页面加载时检查认证状态
  useEffect(() => {
    const authStatus = localStorage.getItem('authStatus')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
      setIsGuest(false)
    } else if (authStatus === 'guest') {
      setIsAuthenticated(false)
      setIsGuest(true)
    }
  }, [])

  const login = (password: string): boolean => {
    if (password === 'lyz134679') {
      setIsAuthenticated(true)
      setIsGuest(false)
      localStorage.setItem('authStatus', 'authenticated')
      return true
    }
    return false
  }

  const loginAsGuest = () => {
    setIsAuthenticated(false)
    setIsGuest(true)
    localStorage.setItem('authStatus', 'guest')
  }

  const logout = () => {
    setIsAuthenticated(false)
    setIsGuest(false)
    localStorage.removeItem('authStatus')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isGuest, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
