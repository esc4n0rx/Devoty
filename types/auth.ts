// types/auth.ts
import { UpdateUserData, User } from "./user"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  nome: string
  email: string
  senha: string
  idade: number
}

export interface ForgotPasswordData {
  email: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    nome: string
    email: string
    chama: number
    avatar_url: string
  }
  token?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  logout: () => Promise<void>
  forgotPassword: (data: ForgotPasswordData) => Promise<AuthResponse>
  updateProfile: (data: UpdateUserData) => Promise<AuthResponse>
  checkAuth: () => Promise<void> // Adicionar checkAuth
}