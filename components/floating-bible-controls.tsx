// components/floating-bible-controls.tsx
"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bookmark, 
  Settings,
  Book,
  Minus,
  Plus
} from 'lucide-react'
import { useBible } from '@/hooks/useBible'
import { BibleSearch } from './bible-search'
import { BibleNavigation } from './bible-navigation'

interface FloatingBibleControlsProps {
  onSearchOpen: () => void
  onNavigationOpen: () => void
}

export function FloatingBibleControls({ 
  onSearchOpen, 
  onNavigationOpen 
}: FloatingBibleControlsProps) {
  const { nextChapter, previousChapter, settings, updateSettings } = useBible()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const increaseFontSize = () => {
    if (settings && settings.font_size < 24) {
      updateSettings({ font_size: settings.font_size + 2 })
    }
  }

  const decreaseFontSize = () => {
    if (settings && settings.font_size > 12) {
      updateSettings({ font_size: settings.font_size - 2 })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Controles de navegação */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-50"
          >
            <div className="flex flex-col gap-2 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
              <Button
                size="sm"
                variant="ghost"
                onClick={previousChapter}
                className="h-10 w-10"
                title="Capítulo anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={nextChapter}
                className="h-10 w-10"
                title="Próximo capítulo"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Controles inferiores */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 bg-card/95 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
              <Button
                size="sm"
                variant="ghost"
                onClick={onSearchOpen}
                className="rounded-full h-10 w-10"
                title="Buscar versículos"
              >
                <Search className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={onNavigationOpen}
                className="rounded-full h-10 w-10"
                title="Navegar por livros"
              >
                <Book className="h-4 w-4" />
              </Button>

              <div className="h-4 w-px bg-border mx-1" />

              <Button
                size="sm"
                variant="ghost"
                onClick={decreaseFontSize}
                className="rounded-full h-10 w-10"
                title="Diminuir fonte"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="text-sm font-medium text-foreground min-w-[2rem] text-center">
                {settings?.font_size || 16}
              </span>

              <Button
                size="sm"
                variant="ghost"
                onClick={increaseFontSize}
                className="rounded-full h-10 w-10"
                title="Aumentar fonte"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}