"use client"

import { Button } from "@/components/ui/button"
import { SunriseAnimation } from "./sunrise-animation"
import { motion } from "framer-motion"

interface OnboardingScreenProps {
  onJoinUs: () => void
  onLogin: () => void
}

export function OnboardingScreen({ onJoinUs, onLogin }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-4 overflow-hidden">
      <div className="max-w-md w-full text-center space-y-6 flex flex-col justify-center min-h-screen">
        <motion.div
          className="mb-4"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", type: "spring", bounce: 0.3 }}
        >
          <SunriseAnimation className="mb-4" />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl font-bold text-foreground tracking-tight"
            animate={{
              textShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 20px rgba(255,255,255,0.3)",
                "0 0 0px rgba(255,255,255,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            Devoty
          </motion.h1>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-xl font-semibold text-foreground text-balance"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Descubra um novo jeito de viver sua fé
          </motion.h2>

          <motion.p
            className="text-base text-muted-foreground leading-relaxed text-pretty"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Fortaleça sua caminhada espiritual com devocionais diários, reflexões bíblicas e espaço para registrar sua
            jornada.
          </motion.p>

          <motion.p
            className="text-sm text-muted-foreground leading-relaxed text-pretty"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Um lugar simples, moderno e feito para você se conectar com Deus todos os dias.
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-3 pt-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
        >
          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
            <Button
              onClick={onJoinUs}
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.8 }}>
                Junte-se a nós
              </motion.span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
            <Button
              onClick={onLogin}
              variant="outline"
              className="w-full h-12 text-base font-medium border-2 border-border hover:bg-secondary/50 text-foreground rounded-lg transition-all duration-300 bg-transparent shadow-md hover:shadow-lg"
            >
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 2 }}>
                Já tenho conta
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}