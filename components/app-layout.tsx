"use client"

import type { ReactNode } from "react"
import { BottomNavigation } from "./bottom-navigation"
import { AppHeader } from "./app-header"
import { motion, AnimatePresence } from "framer-motion"

interface AppLayoutProps {
  children: ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  streakCount?: number
  userName?: string
}

export function AppLayout({ children, activeTab, onTabChange, streakCount = 7, userName }: AppLayoutProps) {
  const handleProfileClick = () => {
    onTabChange("perfil")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <AppHeader userName={userName} streakCount={streakCount} onProfileClick={handleProfileClick} />
      </motion.div>

      <div className="flex-1 pb-20 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
            }}
            className="absolute inset-0"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
      </motion.div>
    </div>
  )
}
