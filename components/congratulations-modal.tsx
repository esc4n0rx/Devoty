// components/congratulations-modal.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { Flame, Trophy, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface CongratulationsModalProps {
  isOpen: boolean
  onClose: () => void
  chamaAtual: number
  nomeUsuario: string
  tituloDevocional: string
}

export function CongratulationsModal({ 
  isOpen, 
  onClose, 
  chamaAtual, 
  nomeUsuario,
  tituloDevocional 
}: CongratulationsModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Auto close after 4 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  const handleClose = () => {
    setShowConfetti(false)
    onClose()
  }

  const getMilestoneMessage = (chama: number) => {
    if (chama === 1) return "Primeira devocional concluída! 🎉"
    if (chama === 7) return "Uma semana completa! 🌟"
    if (chama === 30) return "Um mês de dedicação! 🏆"
    if (chama === 100) return "Cem dias de fé! 👑"
    if (chama % 10 === 0) return `${chama} dias consecutivos! 🔥`
    return "Mais um dia de crescimento espiritual! ✨"
  }

  const getEncouragementMessage = (chama: number) => {
    const messages = [
      "Sua dedicação é inspiradora!",
      "Continue nessa jornada de fé!",
      "Cada dia é um passo mais perto de Deus!",
      "Sua constância está sendo recompensada!",
      "Que sua luz continue brilhando!",
      "Deus se alegra com sua perseverança!"
    ]
    return messages[chama % messages.length]
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md border-0 bg-gradient-to-br from-accent/10 via-background to-accent/5 shadow-2xl backdrop-blur-sm"
        showCloseButton={false}
      >
        {/* Títulos para acessibilidade - visualmente ocultos */}
        <DialogHeader className="sr-only">
          <DialogTitle>
            Parabéns! Devocional Concluída
          </DialogTitle>
          <DialogDescription>
            Você concluiu com sucesso a devocional "{tituloDevocional}" e ganhou +1 ponto de chama. 
            Sua sequência atual é de {chamaAtual} dias consecutivos.
          </DialogDescription>
        </DialogHeader>

        <div className="relative overflow-hidden">
          {/* Confetti Animation Background */}
          <AnimatePresence>
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-accent rounded-full"
                    initial={{ 
                      x: Math.random() * 400 - 200, 
                      y: -20, 
                      opacity: 1,
                      scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{ 
                      y: 600, 
                      x: Math.random() * 400 - 200,
                      opacity: 0,
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: Math.random() * 2 + 2,
                      delay: Math.random() * 0.5,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 py-6">
            {/* Fire Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                bounce: 0.4,
                delay: 0.2 
              }}
              className="relative"
            >
              <DotLottieReact
                src="/animations/Fire.lottie"
                loop
                autoplay
                className="w-24 h-24"
              />
              
              {/* Chama Counter */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.8, 
                  type: "spring", 
                  bounce: 0.6 
                }}
                className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg"
              >
                {chamaAtual}
              </motion.div>
            </motion.div>

            {/* Main Message */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-2"
            >
              <motion.h2 
                className="text-2xl font-bold text-foreground"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Parabéns, {nomeUsuario.split(' ')[0]}! 🎉
              </motion.h2>
              
              <motion.p 
                className="text-accent font-semibold text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {getMilestoneMessage(chamaAtual)}
              </motion.p>

              <motion.p 
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Você concluiu: "{tituloDevocional}"
              </motion.p>
            </motion.div>

            {/* Stats Display */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-6 p-4 bg-secondary/30 rounded-xl border border-accent/20"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Flame className="h-5 w-5 text-accent" />
                </motion.div>
                <div className="text-center">
                  <div className="font-bold text-foreground">{chamaAtual}</div>
                  <div className="text-xs text-muted-foreground">dias</div>
                </div>
              </div>

              <div className="w-px h-8 bg-border"></div>

              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Star className="h-5 w-5 text-yellow-500" />
                </motion.div>
                <div className="text-center">
                  <div className="font-bold text-foreground">+1</div>
                  <div className="text-xs text-muted-foreground">ponto</div>
                </div>
              </div>

              {chamaAtual >= 7 && (
                <>
                  <div className="w-px h-8 bg-border"></div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Trophy className="h-5 w-5 text-amber-500" />
                    </motion.div>
                    <div className="text-center">
                      <div className="font-bold text-foreground">
                        {Math.floor(chamaAtual / 7)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.floor(chamaAtual / 7) === 1 ? 'semana' : 'semanas'}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Encouragement Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-foreground font-medium text-center px-4"
            >
              {getEncouragementMessage(chamaAtual)}
            </motion.p>

            {/* Continue Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="pt-2"
            >
              <Button
                onClick={handleClose}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continuar jornada ✨
              </Button>
            </motion.div>

            {/* Auto close indicator */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-accent/30 rounded-full"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}