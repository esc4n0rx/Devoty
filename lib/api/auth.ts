// lib/api/auth.ts
import type { LoginCredentials, RegisterData, ForgotPasswordData, AuthResponse } from '@/types/auth'
import type { UpdateUserData } from '@/types/user'

const API_BASE = '/api/auth'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro no login')
    }

    return response.json()
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro no registro')
    }

    return response.json()
  },

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao enviar email')
    }

    return response.json()
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE}/logout`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Erro no logout')
    }
  },

  async getProfile(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao buscar perfil')
    }

    return response.json()
  },

  async updateProfile(data: UpdateUserData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao atualizar perfil')
    }

    return response.json()
  },
}