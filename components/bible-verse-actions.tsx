// components/bible-verse-actions.tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Bookmark, Copy, Share } from 'lucide-react'
import { toast } from 'sonner'
import { BibleBookmarkModal } from './bible-bookmark-modal'
import type { BibleVerse } from '@/types/bible'

interface BibleVerseActionsProps {
  verse: BibleVerse
  bookName: string
  chapter: number
  bookAbbrev: string
  isOpen: boolean
  onClose: () => void
  onSave: (verse: BibleVerse, color: string, note?: string) => Promise<void>
}

export function BibleVerseActions({
  verse,
  bookName,
  chapter,
  bookAbbrev,
  isOpen,
  onClose,
  onSave
}: BibleVerseActionsProps) {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)

  const handleCopy = async () => {
    const text = `"${verse.text}" - ${bookName} ${chapter}:${verse.n}`
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Versículo copiado!')
      onClose()
    } catch (error) {
      toast.error('Erro ao copiar')
    }
  }

  const handleShare = async () => {
    const text = `"${verse.text}" - ${bookName} ${chapter}:${verse.n}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bookName} ${chapter}:${verse.n}`,
          text
        })
        onClose()
      } catch (error) {
        // Ignora o erro de "AbortError" que ocorre se o usuário fechar o diálogo de compartilhamento
        if ((error as Error).name !== 'AbortError') {
          handleCopy() // Fallback para copiar em outros erros
        }
      }
    } else {
      handleCopy()
    }
  }

  const handleBookmark = () => {
    setShowBookmarkModal(true)
  }

  const handleBookmarkSave = async (note?: string, color?: string) => {
    if (color) {
      await onSave(verse, color, note)
    }
    setShowBookmarkModal(false)
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleBookmark}
                  className="flex flex-col h-auto py-2 px-3"
                >
                  <Bookmark className="h-4 w-4 mb-1" />
                  <span className="text-xs">Salvar</span>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="flex flex-col h-auto py-2 px-3"
                >
                  <Copy className="h-4 w-4 mb-1" />
                  <span className="text-xs">Copiar</span>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShare}
                  className="flex flex-col h-auto py-2 px-3"
                >
                  <Share className="h-4 w-4 mb-1" />
                  <span className="text-xs">Compartilhar</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BibleBookmarkModal
        isOpen={showBookmarkModal}
        onClose={() => setShowBookmarkModal(false)}
        verse={verse}
        bookName={bookName}
        chapter={chapter}
        onSave={handleBookmarkSave}
      />
    </>
  )
}
