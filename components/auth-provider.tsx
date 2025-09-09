// components/auth-provider.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '@/lib/api/auth'
import type { AuthContextType, LoginCredentials, RegisterData, ForgotPasswordData } from '@/types/auth'
import type { User, UpdateUserData } from '@/types/user'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authApi.getProfile()
      if (response.success && response.user) {
        setUser(response.user as User)
      }
    } catch (error) {
      console.log('Usuário não autenticado')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials)
    if (response.success && response.user) {
      setUser(response.user as User)
    }
    return response
  }

  const register = async (data: RegisterData) => {
    const response = await authApi.register(data)
    if (response.success && response.user) {
      setUser(response.user as User)
    }
    return response
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  const forgotPassword = async (data: ForgotPasswordData) => {
    return await authApi.forgotPassword(data)
  }

  const updateProfile = async (data: UpdateUserData) => {
    const response = await authApi.updateProfile(data)
    if (response.success && response.user) {
      setUser(response.user as User)
    }
    return response
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}