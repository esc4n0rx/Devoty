// components/bible-reader.tsx
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { BibleVerseActions } from './bible-verse-actions'
import type { BibleChapter, BibleVerse } from '@/types/bible'

interface BibleReaderProps {
  chapter: BibleChapter
  bookName: string
  bookAbbrev: string
  fontSize: number
  version: string
  saveBookmark: (verse: BibleVerse, color: string, note?: string) => Promise<void>
}

const HIGHLIGHT_COLORS: Record<string, { bg: string, text: string }> = {
  yellow: { bg: 'bg-yellow-200/70', text: 'text-yellow-900' },
  green:  { bg: 'bg-green-200/70',  text: 'text-green-900' },
  blue:   { bg: 'bg-blue-200/70',   text: 'text-blue-900' },
  pink:   { bg: 'bg-pink-200/70',   text: 'text-pink-900' },
  purple: { bg: 'bg-purple-200/70', text: 'text-purple-900' },
  orange: { bg: 'bg-orange-200/70', text: 'text-orange-900' },
}

export function BibleReader({ 
  chapter, 
  bookName, 
  bookAbbrev, 
  fontSize, 
  version, 
  saveBookmark
}: BibleReaderProps) {
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null)
  const [showActions, setShowActions] = useState(false)

  const handleVerseClick = (verse: BibleVerse) => {
    if (selectedVerse?.n === verse.n) {
      setShowActions(!showActions)
    } else {
      setSelectedVerse(verse)
      setShowActions(true)
    }
  }

  const handleCloseActions = () => {
    setShowActions(false)
    setSelectedVerse(null)
  }

  return (
    <>
      <div className="px-4 pb-32">
        {/* Header do capítulo */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {version.toUpperCase()}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {bookName}
          </h1>
          <div className="text-6xl font-light text-foreground/60 mt-2">
            {chapter.n}
          </div>
        </div>

        {/* Versículos */}
        <div className="max-w-2xl mx-auto space-y-1">
          {chapter.verses.map((verse, index) => {
            const highlight = verse.highlightColor ? HIGHLIGHT_COLORS[verse.highlightColor] : null
            
            return (
              <motion.div
                key={verse.n}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`
                  group cursor-pointer transition-all duration-200 rounded-lg
                  ${selectedVerse?.n === verse.n 
                    ? 'bg-accent/10 -mx-4 px-4 py-2' 
                    : highlight
                    ? `${highlight.bg} ${highlight.text} -mx-4 px-4 py-2`
                    : 'hover:bg-accent/5 -mx-2 px-2 py-1'
                  }
                `}
                onClick={() => handleVerseClick(verse)}
              >
                <div className="flex gap-3">
                  <span 
                    className={`
                      flex-shrink-0 font-medium text-sm mt-1 min-w-[1.5rem]
                      ${highlight ? 'text-current/80' : 'text-accent'}
                    `}
                    style={{ fontSize: Math.max(fontSize - 2, 12) }}
                  >
                    {verse.n}
                  </span>
                  
                  <p 
                    className={`
                      leading-relaxed flex-1
                      ${highlight ? 'text-current' : 'text-foreground'}
                    `}
                    style={{ fontSize }}
                  >
                    {verse.text}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Ações do versículo */}
      {selectedVerse && (
        <BibleVerseActions
          verse={selectedVerse}
          bookName={bookName}
          chapter={chapter.n}
          bookAbbrev={bookAbbrev}
          isOpen={showActions}
          onClose={handleCloseActions}
          onSave={saveBookmark}
        />
      )}
    </>
  )
}
