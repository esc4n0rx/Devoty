// types/devocional.ts
export interface Devocional {
  id: string
  user_id: string
  titulo: string
  versiculo_base: string
  passagem_biblica: string 
  conteudo: string
  oracao: string
  data_criacao: string
  concluida: boolean
  favoritada: boolean
  data_conclusao?: string
}

export interface DevocionalResponse {
  success: boolean
  message: string
  devocional?: Devocional
  devocionais?: Devocional[]
  nextAvailable?: string      
  dailyLimitReached?: boolean 
  canGenerate?: boolean    
}

export interface ConcluirDevocionalData {
  devocional_id: string
}

export interface FavoritarDevocionalData {
  devocional_id: string
  favoritar: boolean
}