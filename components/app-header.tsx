// components/app-header.tsx
"use client"

import { Button } from "@/components/ui/button"
import { User, Flame, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"

interface AppHeaderProps {
  onProfileClick: () => void
  title?: string
  onBack?: () => void
}

export function AppHeader({ onProfileClick, title, onBack }: AppHeaderProps) {
  const { user } = useAuth()

  if (onBack && title) {
    return (
      <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4 px-6 py-4">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.h1 
            className="text-xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {title}
          </motion.h1>
        </div>
      </header>
    )
  }

  if (!user) {
    return (
      <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="animate-pulse">
            <div className="h-5 bg-muted rounded w-24 mb-1"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 w-10 bg-muted rounded-full"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            className="text-lg font-semibold text-foreground"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Olá, {user.nome.split(' ')[0]}
          </motion.h1>
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Que Deus abençoe seu dia
          </motion.p>
        </motion.div>

        <motion.div
          className="flex items-center gap-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <motion.div
            className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Flame className="h-4 w-4 text-accent" />
            </motion.div>
            <motion.span
              className="text-sm font-semibold text-accent"
              key={user.chama}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {user.chama || 0}
            </motion.span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onProfileClick}
              className="h-10 w-10 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors duration-300"
            >
              <User className="h-5 w-5 text-accent" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  )
}