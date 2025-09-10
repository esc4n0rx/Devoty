// hooks/use-devocionais.ts
"use client"

import { useState, useEffect } from 'react'
import { devocionaisApi } from '@/lib/api/devocionais'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import type { Devocional } from '@/types/devocional'

export function useDevocionais() {
  const [devocionalDoDia, setDevocionalDoDia] = useState<Devocional | null>(null)
  const [devocionais, setDevocionais] = useState<Devocional[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState(false)
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [congratulationsData, setCongratulationsData] = useState<{
    chama: number
    titulo: string
  } | null>(null)
  
  const { user, checkAuth } = useAuth()
  const { toast } = useToast()

  const carregarDevocionalDoDia = async () => {
    try {
      const response = await devocionaisApi.getDevocionalDoDia()
      if (response.success && response.devocional) {
        setDevocionalDoDia(response.devocional)
      }
    } catch (error) {
      console.error('Erro ao carregar devocional do dia:', error)
    }
  }

  const carregarDevocionais = async () => {
    try {
      const response = await devocionaisApi.getDevocionais()
      if (response.success && response.devocionais) {
        setDevocionais(response.devocionais)
      }
    } catch (error) {
      console.error('Erro ao carregar devocionais:', error)
    }
  }

  const concluirDevocional = async (devocionalId: string) => {
    setLoadingAction(true)
    try {
      const response = await devocionaisApi.concluirDevocional({ devocional_id: devocionalId })
      
      if (response.success) {
        // Atualizar estado local
        if (devocionalDoDia?.id === devocionalId) {
          setDevocionalDoDia({
            ...devocionalDoDia,
            concluida: true,
            data_conclusao: new Date().toISOString()
          })
        }
        
        // Atualizar dados do usuário para refletir nova chama
        await checkAuth()
        
        // Preparar dados para o modal de parabéns
        const novaChama = (user?.chama || 0) + 1
        setCongratulationsData({
          chama: novaChama,
          titulo: devocionalDoDia?.titulo || 'Devocional'
        })
        
        // Mostrar modal de parabéns
        setShowCongratulations(true)
        
        // Toast só aparece após o modal
        setTimeout(() => {
          toast({
            title: "Devocional concluída! 🔥",
            description: `Você ganhou +1 ponto de chama! Total: ${novaChama} dias`,
          })
        }, 4500)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao concluir devocional",
        variant: "destructive",
      })
    } finally {
      setLoadingAction(false)
    }
  }

  const favoritarDevocional = async (devocionalId: string, favoritar: boolean) => {
    try {
      const response = await devocionaisApi.favoritarDevocional({ 
        devocional_id: devocionalId, 
        favoritar 
      })
      
      if (response.success) {
        // Atualizar estado local
        setDevocionais(prev => 
          prev.map(dev => 
            dev.id === devocionalId 
              ? { ...dev, favoritada: favoritar }
              : dev
          )
        )
        
        toast({
          title: favoritar ? "Adicionado aos favoritos" : "Removido dos favoritos",
          description: response.message,
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao favoritar devocional",
        variant: "destructive",
      })
    }
  }

  const deletarDevocional = async (devocionalId: string) => {
    try {
      const response = await devocionaisApi.deletarDevocional(devocionalId)
      
      if (response.success) {
        setDevocionais(prev => prev.filter(dev => dev.id !== devocionalId))
        
        toast({
          title: "Devocional removida",
          description: response.message,
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao deletar devocional",
        variant: "destructive",
      })
    }
  }

  const gerarNovaDevocional = async () => {
    setLoading(true)
    try {
      const response = await devocionaisApi.gerarDevocional()
      
      if (response.success && response.devocional) {
        setDevocionalDoDia(response.devocional)
        toast({
          title: "Nova devocional gerada!",
          description: "Uma nova devocional foi criada para você.",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao gerar devocional",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const closeCongratulations = () => {
    setShowCongratulations(false)
    setCongratulationsData(null)
  }

  useEffect(() => {
    if (user) {
      Promise.all([
        carregarDevocionalDoDia(),
        carregarDevocionais()
      ]).finally(() => setLoading(false))
    }
  }, [user])

  return {
    devocionalDoDia,
    devocionais,
    loading,
    loadingAction,
    showCongratulations,
    congratulationsData,
    concluirDevocional,
    favoritarDevocional,
    deletarDevocional,
    gerarNovaDevocional,
    closeCongratulations,
    recarregar: () => {
      carregarDevocionalDoDia()
      carregarDevocionais()
    }
  }
}