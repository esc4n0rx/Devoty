// components/bible-reader.tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Bookmark, BookmarkCheck } from 'lucide-react'
import { useBible } from '@/hooks/useBible'
import { BibleBookmarkModal } from './bible-bookmark-modal'
import type { BibleChapter, BibleVerse } from '@/types/bible'

interface BibleReaderProps {
  chapter: BibleChapter
  bookName: string
  bookAbbrev: string
  fontSize: number
}

export function BibleReader({ chapter, bookName, bookAbbrev, fontSize }: BibleReaderProps) {
  const { bookmarks, addBookmark } = useBible()
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)

  const isBookmarked = (verseNum: number) => {
    return bookmarks.some(b => 
      b.book_abbrev === bookAbbrev && 
      b.chapter === chapter.n && 
      b.verse === verseNum
    )
  }

  const handleVerseSelect = (verse: BibleVerse) => {
    setSelectedVerse(verse)
    setShowBookmarkModal(true)
  }

  const handleBookmark = async (note?: string, color: string = 'yellow') => {
    if (!selectedVerse) return

    await addBookmark(
      bookAbbrev,
      chapter.n,
      selectedVerse.n,
      selectedVerse.text,
      note,
      color
    )

    setShowBookmarkModal(false)
    setSelectedVerse(null)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            {/* Cabeçalho do capítulo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-accent" />
                <h1 className="text-2xl font-bold text-foreground">
                  {bookName} {chapter.n}
                </h1>
              </div>
              <Separator className="bg-border" />
            </motion.div>

            {/* Versículos */}
            <div className="space-y-4">
              <AnimatePresence>
                {chapter.verses.map((verse, index) => (
                  <motion.div
                    key={verse.n}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.3 + (index * 0.05),
                      duration: 0.4 
                    }}
                    className="group relative"
                  >
                    <div 
                      className={`
                        flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                        hover:bg-accent/10 hover:shadow-sm
                        ${isBookmarked(verse.n) ? 'bg-accent/5 border-l-4 border-accent' : ''}
                      `}
                      onClick={() => handleVerseSelect(verse)}
                    >
                      <span 
                        className="flex-shrink-0 text-accent font-semibold text-sm mt-1 min-w-[2rem]"
                        style={{ fontSize: Math.max(fontSize - 2, 12) }}
                      >
                        {verse.n}
                      </span>
                      
                      <p 
                        className="text-foreground leading-relaxed flex-1"
                        style={{ fontSize }}
                      >
                        {verse.text}
                      </p>

                      {/* Indicador de marcação */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isBookmarked(verse.n) ? (
                          <BookmarkCheck className="h-4 w-4 text-accent" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de marcação */}
      <BibleBookmarkModal
        isOpen={showBookmarkModal}
        onClose={() => {
          setShowBookmarkModal(false)
          setSelectedVerse(null)
        }}
        verse={selectedVerse}
        bookName={bookName}
        chapter={chapter.n}
        onSave={handleBookmark}
      />
    </>
  )
}