// lib/api/diary.ts
import type { CreateDiaryEntryData, UpdateDiaryEntryData, DiaryResponse } from '@/types/diary'

const API_BASE_URL = '/api/diary'

class DiaryApi {
  async getEntries(): Promise<DiaryResponse> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar entradas')
      }

      return data
    } catch (error) {
      console.error('Erro na API:', error)
      throw error
    }
  }

  async getEntry(id: string): Promise<DiaryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar entrada')
      }

      return data
    } catch (error) {
      console.error('Erro na API:', error)
      throw error
    }
  }

  async createEntry(entryData: CreateDiaryEntryData): Promise<DiaryResponse> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(entryData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar entrada')
      }

      return data
    } catch (error) {
      console.error('Erro na API:', error)
      throw error
    }
  }

  async updateEntry(id: string, entryData: UpdateDiaryEntryData): Promise<DiaryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(entryData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar entrada')
      }

      return data
    } catch (error) {
      console.error('Erro na API:', error)
      throw error
    }
  }

  async deleteEntry(id: string): Promise<DiaryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao excluir entrada')
      }

      return data
    } catch (error) {
      console.error('Erro na API:', error)
      throw error
    }
  }
}

export const diaryApi = new DiaryApi()