// lib/api/devocionais.ts
import type { DevocionalResponse, ConcluirDevocionalData, FavoritarDevocionalData } from '@/types/devocional'

const API_BASE = '/api/devocionais'

export const devocionaisApi = {
  async gerarDevocional(): Promise<DevocionalResponse> {
    const response = await fetch(`${API_BASE}/gerar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao gerar devocional')
    }

    return response.json()
  },

  async getDevocionalDoDia(): Promise<DevocionalResponse> {
    const response = await fetch(`${API_BASE}`, {
      method: 'GET',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao buscar devocional do dia')
    }

    return response.json()
  },

  async getDevocionais(): Promise<DevocionalResponse> {
    const response = await fetch(`${API_BASE}?historico=true`, {
      method: 'GET',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao buscar devocionais')
    }

    return response.json()
  },

  async concluirDevocional(data: ConcluirDevocionalData): Promise<DevocionalResponse> {
    const response = await fetch(`${API_BASE}/${data.devocional_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ acao: 'concluir' }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao concluir devocional')
    }

    return response.json()
  },

  async favoritarDevocional(data: FavoritarDevocionalData): Promise<DevocionalResponse> {
    const response = await fetch(`${API_BASE}/${data.devocional_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        acao: 'favoritar',
        favoritar: data.favoritar 
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao favoritar devocional')
    }

    return response.json()
  },

  async deletarDevocional(devocionalId: string): Promise<DevocionalResponse> {
    const response = await fetch(`${API_BASE}/${devocionalId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao deletar devocional')
    }

    return response.json()
  },
}