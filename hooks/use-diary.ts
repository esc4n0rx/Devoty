// hooks/use-diary.ts
"use client"

import { useState, useEffect, useCallback } from 'react'
import { diaryApi } from '@/lib/api/diary'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import type { DiaryEntry, CreateDiaryEntryData, UpdateDiaryEntryData } from '@/types/diary'

export function useDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  
  const { user } = useAuth()
  const { toast } = useToast()

  const loadEntries = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await diaryApi.getEntries()
      
      if (response.success && response.entries) {
        setEntries(response.entries)
      }
    } catch (error) {
      console.error('Erro ao carregar entradas:', error)
      toast({
        title: "Erro",
        description: "Erro ao carregar entradas do diário",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [user, toast])

  const createEntry = async (entryData: CreateDiaryEntryData): Promise<boolean> => {
    try {
      setActionLoading(true)
      const response = await diaryApi.createEntry(entryData)
      
      if (response.success && response.entry) {
        setEntries(prev => [response.entry!, ...prev])
        toast({
          title: "Entrada criada!",
          description: response.message,
        })
        return true
      }
      return false
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar entrada"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const updateEntry = async (id: string, entryData: UpdateDiaryEntryData): Promise<boolean> => {
    try {
      setActionLoading(true)
      const response = await diaryApi.updateEntry(id, entryData)
      
      if (response.success && response.entry) {
        setEntries(prev => 
          prev.map(entry => 
            entry.id === id ? response.entry! : entry
          )
        )
        toast({
          title: "Entrada atualizada!",
          description: response.message,
        })
        return true
      }
      return false
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar entrada"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setActionLoading(false)
    }
  }

  const deleteEntry = async (id: string): Promise<boolean> => {
    try {
      setActionLoading(true)
      const response = await diaryApi.deleteEntry(id)
      
      if (response.success) {
        setEntries(prev => prev.filter(entry => entry.id !== id))
        toast({
          title: "Entrada excluída!",
          description: response.message,
        })
        return true
      }
      return false
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao excluir entrada"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setActionLoading(false)
    }
  }

  // Carregar entradas ao montar o componente ou quando usuário mudar
  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  return {
    entries,
    loading,
    actionLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshEntries: loadEntries,
  }
}