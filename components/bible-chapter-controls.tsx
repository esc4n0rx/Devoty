// components/bible-chapter-controls.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBible } from '@/hooks/useBible'
import { BibleBookSelector } from './bible-book-selector'

export function BibleChapterControls() {
  const { bibleData, settings, previousChapter, nextChapter } = useBible()
  const [showSelector, setShowSelector] = useState(false)

  if (!settings || !bibleData) return null

  const currentBook = bibleData.bookMap.get(settings.current_book)
  const currentBookName = currentBook?.name || ''

  return (
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-20 left-0 right-0 z-40 px-4"
      >
        <div className="max-w-sm mx-auto">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-full shadow-lg flex items-center justify-between px-4 py-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={previousChapter}
              className="rounded-full h-10 w-10 p-0"
              disabled={settings.current_book === 'gn' && settings.current_chapter === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowSelector(true)}
              className="flex-1 mx-2 text-center"
            >
              <div className="text-sm">
                <div className="font-medium text-foreground">
                  {currentBookName} {settings.current_chapter}
                </div>
              </div>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={nextChapter}
              className="rounded-full h-10 w-10 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <BibleBookSelector
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
      />
    </>
  )
}