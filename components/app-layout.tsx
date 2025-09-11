// components/app-layout.tsx
"use client"

import type { ReactNode } from "react"
import { BottomNavigation } from "./bottom-navigation"
import { AppHeader } from "./app-header"
import { CongratulationsModal } from "./congratulations-modal"
import { motion, AnimatePresence } from "framer-motion"
import { useDevocionais } from "@/hooks/use-devocionais"
import { useAuth } from "@/hooks/use-auth"

interface AppLayoutProps {
  children: ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  const { 
    showCongratulations, 
    congratulationsData, 
    closeCongratulations 
  } = useDevocionais()
  const { user } = useAuth()

  const handleProfileClick = () => {
    onTabChange("perfil")
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header fixo */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-shrink-0"
      >
        <AppHeader onProfileClick={handleProfileClick} />
      </motion.div>

      {/* Conteúdo principal */}
      <div className="flex-1 relative overflow-hidden pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute inset-0"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation fixo */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="flex-shrink-0"
      >
        <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
      </motion.div>

      {/* Modal Global de Parabéns */}
      {showCongratulations && congratulationsData && (
        <CongratulationsModal
          isOpen={showCongratulations}
          onClose={closeCongratulations}
          chamaAtual={congratulationsData.chama}
          nomeUsuario={user?.nome || "Amigo"}
          tituloDevocional={congratulationsData.titulo}
        />
      )}
    </div>
  )
}