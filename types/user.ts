// types/user.ts
export interface User {
  id: string
  nome: string
  email: string
  idade: number
  avatar_url: string
  chama: number
  data_criacao: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  nome: string
  email: string
  senha: string
  idade: number
}

export interface UpdateUserData {
  nome?: string
  email?: string
  idade?: number
  avatar_url?: string
}