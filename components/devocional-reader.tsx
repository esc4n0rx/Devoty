// components/devocional-reader.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Heart, CheckCircle, Play, Pause, StopCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { Devocional } from "@/types/devocional"
import { CongratulationsModal } from "@/components/congratulations-modal"
import { useAudio } from "@/hooks/useAudio"
import { useEffect, useMemo } from "react"

interface DevocionalReaderProps {
  devocional: Devocional
  onBack: () => void
  onConcluir?: () => void
  onFavoritar?: (favoritar: boolean) => void
  showActions?: boolean
  loadingAction?: boolean
  // Propriedades do modal de parabéns
  showCongratulations?: boolean
  congratulationsData?: {
    chama: number
    titulo: string
  } | null
  onCloseCongratulations?: () => void
  userName?: string
}

export function DevocionalReader({ 
  devocional, 
  onBack, 
  onConcluir, 
  onFavoritar, 
  showActions = true,
  loadingAction = false,
  showCongratulations = false,
  congratulationsData,
  onCloseCongratulations,
  userName = "Amigo"
}: DevocionalReaderProps) {
  const { speechState, speak, pause, resume, cancel } = useAudio()

  // Garante que o áudio pare ao sair do leitor
  useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  const fullDevocionalText = useMemo(() => {
    return `
      Devocional: ${devocional.titulo}. 
      Versículo base: ${devocional.versiculo_base}. 
      Passagem bíblica: ${devocional.passagem_biblica}. 
      Reflexão: ${devocional.conteudo}. 
      Oração: ${devocional.oracao}.
    `;
  }, [devocional])

  const handlePlayPause = () => {
    if (speechState === 'idle') {
      speak(fullDevocionalText)
    } else if (speechState === 'paused') {
      resume()
    } else {
      pause()
    }
  }

  const handleStop = () => {
    cancel()
  }

  const handleConcluir = () => {
    if (onConcluir && !devocional.concluida) {
      onConcluir()
    }
  }

  const handleFavoritar = () => {
    if (onFavoritar) {
      onFavoritar(!devocional.favoritada)
    }
  }

  return (
    <>
      {/* Container principal com altura total disponível */}
      <div className="h-full flex flex-col bg-background">
        {/* Header fixo com botões de ação */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between p-6 bg-background border-b border-border flex-shrink-0"
        >
          {/* Lado esquerdo - Botão voltar e título */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-accent/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">Devocional</h1>
          </div>

          {/* Lado direito - Botões de ação */}
          {showActions && (
            <div className="flex items-center gap-2">
              {/* Botão de favoritar */}
              {onFavoritar && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavoritar}
                    className="p-2 hover:bg-accent/10 transition-colors duration-300"
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors duration-300 ${
                        devocional.favoritada 
                          ? "text-red-500 fill-red-500" 
                          : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                </motion.div>
              )}

              {/* Botão de concluir */}
              {!devocional.concluida && onConcluir ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleConcluir}
                    disabled={loadingAction}
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all duration-300 font-medium px-4"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {loadingAction ? "Concluindo..." : "Concluir"}
                  </Button>
                </motion.div>
              ) : devocional.concluida ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                >
                  <div className="flex items-center gap-2 bg-accent/20 text-accent px-3 py-2 rounded-md border border-accent/30">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Concluída</span>
                  </div>
                </motion.div>
              ) : null}
            </div>
          )}
        </motion.div>

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-card border-border shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {devocional.titulo}
                  </CardTitle>
                  <p className="text-accent font-medium text-lg">{devocional.versiculo_base}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(devocional.data_criacao).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Passagem Bíblica */}
                  <div className="bg-accent/5 border-l-4 border-accent p-4 rounded-r-lg">
                    <h3 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wide">
                      Passagem Bíblica
                    </h3>
                    <div className="space-y-3">
                      <p className="text-foreground leading-relaxed italic text-base">
                        {devocional.passagem_biblica}
                      </p>
                      <p className="text-accent font-medium text-right text-sm">
                        - {devocional.versiculo_base}
                      </p>
                    </div>
                  </div>

                  {/* Reflexão */}
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Reflexão</h3>
                    <div className="text-foreground leading-relaxed space-y-3">
                      {devocional.conteudo.split('\n').map((paragrafo, index) => 
                        paragrafo.trim() && (
                          <p key={index} className="text-base">
                            {paragrafo.trim()}
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  {/* Oração */}
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-3">Oração do Dia</h4>
                    <div className="text-foreground leading-relaxed italic space-y-3">
                      {devocional.oracao.split('\n').map((paragrafo, index) => 
                        paragrafo.trim() && (
                          <p key={index} className="text-base">
                            {paragrafo.trim()}
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  {/* Espaço extra no final para garantir que o último conteúdo seja visível */}
                  <div className="h-8"></div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de Parabéns */}
      {showCongratulations && congratulationsData && onCloseCongratulations && (
        <CongratulationsModal
          isOpen={showCongratulations}
          onClose={onCloseCongratulations}
          chamaAtual={congratulationsData.chama}
          nomeUsuario={userName}
          tituloDevocional={congratulationsData.titulo}
        />
      )}

      {/* Floating Audio Controls */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto bg-background/80 backdrop-blur-sm border border-border shadow-2xl rounded-full flex items-center gap-2 p-2"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          className="w-14 h-14 rounded-full bg-accent/20 hover:bg-accent/30"
        >
          {speechState === 'playing' ? (
            <Pause className="h-6 w-6 text-accent" />
          ) : (
            <Play className="h-6 w-6 text-accent" />
          )}
        </Button>
        {(speechState === 'playing' || speechState === 'paused') && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStop}
            className="w-14 h-14 rounded-full hover:bg-destructive/20"
          >
            <StopCircle className="h-6 w-6 text-destructive" />
          </Button>
        )}
      </motion.div>
    </>
  )
}