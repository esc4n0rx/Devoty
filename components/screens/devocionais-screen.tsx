// components/screens/devocionais-screen.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, CheckCircle, Heart, ArrowLeft, Search, Trash2, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useState } from "react"
import { DevocionalReader } from "@/components/devocional-reader"
import { useDevocionais } from "@/hooks/use-devocionais"
import type { Devocional } from "@/types/devocional"

export function DevocionaisScreen() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDevocional, setSelectedDevocional] = useState<Devocional | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'completed'>('all')
  
  const { 
    devocionais, 
    loading, 
    favoritarDevocional, 
    deletarDevocional 
  } = useDevocionais()

  const filteredDevocionais = devocionais.filter((dev) => {
    const matchesSearch = 
      dev.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.versiculo_base.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (filterType) {
      case 'favorites':
        return matchesSearch && dev.favoritada
      case 'completed':
        return matchesSearch && dev.concluida
      default:
        return matchesSearch
    }
  })

  const handleDeleteDevocional = async (devocionalId: string) => {
    if (confirm('Tem certeza que deseja remover esta devocional?')) {
      await deletarDevocional(devocionalId)
    }
  }

  if (selectedDevocional) {
    return (
      <DevocionalReader
        devocional={selectedDevocional}
        onBack={() => setSelectedDevocional(null)}
        onFavoritar={(favoritar) => favoritarDevocional(selectedDevocional.id, favoritar)}
        showActions={false}
      />
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <motion.div
        className="text-center space-y-2"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-xl font-bold text-foreground">Suas Devocionais</h2>
        <p className="text-muted-foreground">Sua jornada espiritual diária</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar devocionais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'Todas', count: devocionais.length },
            { key: 'favorites', label: 'Favoritas', count: devocionais.filter(d => d.favoritada).length },
            { key: 'completed', label: 'Concluídas', count: devocionais.filter(d => d.concluida).length }
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={filterType === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(filter.key as any)}
              className="whitespace-nowrap"
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
      </motion.div>

      {filteredDevocionais.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma devocional encontrada
          </h3>
          <p className="text-muted-foreground">
            {searchTerm 
              ? "Tente ajustar sua busca ou escolha outro filtro" 
              : "Você ainda não tem devocionais. Complete sua primeira devocional na tela Hoje!"
            }
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {filteredDevocionais.map((devocional, index) => (
            <motion.div
              key={devocional.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`bg-card border-border cursor-pointer hover:bg-secondary/20 transition-all duration-300 shadow-md hover:shadow-lg relative group ${
                  devocional.concluida ? "ring-1 ring-accent/30" : ""
                }`}
                onClick={() => setSelectedDevocional(devocional)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base font-semibold text-foreground">
                          {devocional.titulo}
                        </CardTitle>
                        {devocional.favoritada && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {devocional.versiculo_base}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {devocional.conteudo.substring(0, 150)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          favoritarDevocional(devocional.id, !devocional.favoritada)
                        }}
                        className="p-1 hover:bg-accent/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            devocional.favoritada 
                              ? "text-red-500 fill-red-500" 
                              : "text-muted-foreground"
                          }`}
                        />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteDevocional(devocional.id)
                        }}
                        className="p-1 hover:bg-destructive/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </motion.button>
                      {devocional.concluida && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                        >
                          <CheckCircle className="h-5 w-5 text-accent" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <motion.div 
                      className="flex items-center gap-1" 
                      whileHover={{ scale: 1.05 }}
                    >
                      <Calendar className="h-3 w-3" />
                      {new Date(devocional.data_criacao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </motion.div>
                    {devocional.concluida && devocional.data_conclusao && (
                      <motion.div 
                        className="flex items-center gap-1 text-accent" 
                        whileHover={{ scale: 1.05 }}
                      >
                        <CheckCircle className="h-3 w-3" />
                        Concluída em {new Date(devocional.data_conclusao).toLocaleDateString('pt-BR')}
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}