// components/screens/hoje-screen.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Headphones, BookOpen, Heart, RefreshCw, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { DevocionalReader } from "@/components/devocional-reader"
import { CongratulationsModal } from "@/components/congratulations-modal"
import { useDevocionais } from "@/hooks/use-devocionais"
import { useAuth } from "@/hooks/use-auth"
import { NextDevocionalCountdown } from "../next-devocional-countdown"

export function HojeScreen() {
  const [showDevocional, setShowDevocional] = useState(false)
  const { 
    devocionalDoDia, 
    loading, 
    loadingAction, 
    showCongratulations,
    congratulationsData,
    canGenerateToday, 
    nextAvailable, 
    concluirDevocional, 
    gerarNovaDevocional,
    closeCongratulations
  } = useDevocionais()
  const { user } = useAuth()

  if (showDevocional && devocionalDoDia) {
    return (
      <DevocionalReader
        devocional={devocionalDoDia}
        onBack={() => setShowDevocional(false)}
        onConcluir={() => concluirDevocional(devocionalDoDia.id)}
        loadingAction={loadingAction}
        showCongratulations={showCongratulations}
        congratulationsData={congratulationsData}
        onCloseCongratulations={closeCongratulations}
        userName={user?.nome || "Amigo"}
      />
    )
  }

  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="animate-pulse">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="flex gap-3">
                  <div className="h-12 bg-muted rounded flex-1"></div>
                  <div className="h-12 bg-muted rounded flex-1"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {devocionalDoDia ? (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <motion.div
                    className="text-center space-y-2 mb-4"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <h2 className="text-xl font-bold text-foreground">Devocional de Hoje</h2>
                      {devocionalDoDia.concluida && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                        >
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {new Date().toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <CardTitle className="text-lg font-semibold text-foreground text-center">
                      {devocionalDoDia.titulo}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      {devocionalDoDia.versiculo_base}
                    </p>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <motion.p
                    className="text-foreground leading-relaxed text-center line-clamp-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {devocionalDoDia.conteudo}
                  </motion.p>

                  <motion.div
                    className="flex gap-3"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled
                      >
                        <Headphones className="h-4 w-4 mr-2" />
                        Ouvir (Em breve)
                      </Button>
                    </motion.div>

                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full h-12 bg-transparent hover:bg-accent/10 transition-all duration-300"
                        onClick={() => setShowDevocional(true)}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Ler
                      </Button>
                    </motion.div>
                  </motion.div>

                  {devocionalDoDia.concluida && (
                    <motion.div
                      className="text-center pt-2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6, type: "spring", bounce: 0.4 }}
                    >
                      <div className="flex items-center justify-center gap-2 text-accent text-sm font-medium">
                        <Heart className="h-4 w-4 fill-accent" />
                        Devocional concluída hoje!
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Caso não tenha devocional do dia
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                    className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="h-8 w-8 text-accent" />
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Sua devocional está chegando!
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Gere uma nova devocional personalizada para você
                  </p>
                </CardHeader>
                <CardContent>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={gerarNovaDevocional}
                      disabled={loading || !canGenerateToday}
                      className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      {loading ? 'Gerando...' : !canGenerateToday ? 'Já gerada hoje' : 'Gerar Devocional'}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <Card className="bg-secondary/50 border-border shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <motion.h3
                  className="font-semibold text-foreground mb-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Reflexão do Dia
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground leading-relaxed"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Reserve alguns minutos hoje para se conectar com Deus através da oração e reflexão. 
                  Cada devocional é uma oportunidade de crescimento espiritual e fortalecimento da fé.
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

    {!devocionalDoDia && !canGenerateToday && nextAvailable && (
      <NextDevocionalCountdown nextAvailable={nextAvailable} />
    )}

      {/* Modal de Parabéns Global - fora do DevocionalReader */}
      {showCongratulations && congratulationsData && !showDevocional && (
        <CongratulationsModal
          isOpen={showCongratulations}
          onClose={closeCongratulations}
          chamaAtual={congratulationsData.chama}
          nomeUsuario={user?.nome || "Amigo"}
          tituloDevocional={congratulationsData.titulo}
        />
      )}
    </>
  )
}