"use client"

import { Home, Book, BookOpen, PenTool, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "hoje", label: "Hoje", icon: Home },
  { id: "devocionais", label: "Devocionais", icon: Book },
  { id: "biblia", label: "Bíblia", icon: BookOpen },
  { id: "diario", label: "Diário", icon: PenTool },
  { id: "perfil", label: "Perfil", icon: User },
]

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 min-w-0 flex-1 relative",
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground",
              )}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-accent/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <motion.div animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
                <Icon className={cn("h-6 w-6 mb-1 transition-colors duration-300", isActive && "text-accent")} />
              </motion.div>

              <span
                className={cn("text-xs font-medium truncate transition-colors duration-300", isActive && "text-accent")}
              >
                {tab.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
