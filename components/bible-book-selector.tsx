// components/bible-book-selector.tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Book } from 'lucide-react'
import { useBible } from '@/hooks/useBible'

interface BibleBookSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function BibleBookSelector({ isOpen, onClose }: BibleBookSelectorProps) {
  const { bibleData, settings, loadChapter } = useBible()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBook, setSelectedBook] = useState<string | null>(null)

  if (!bibleData || !settings) return null

  const filteredBooks = bibleData.books.filter(book => 
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedBookData = selectedBook 
    ? bibleData.bookMap.get(selectedBook) 
    : null

  const handleChapterSelect = async (chapter: number) => {
    if (selectedBook) {
      await loadChapter(settings.bible_version, selectedBook, chapter)
      onClose()
    }
  }

  const handleClose = () => {
    setSearchTerm('')
    setSelectedBook(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-md max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-accent" />
                Escolher Capítulo
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Busca de livros */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar livro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {!selectedBook ? (
                // Lista de livros
                <ScrollArea className="h-80">
                  <div className="space-y-1">
                    {filteredBooks.map((book) => (
                      <Button
                        key={book.abbrev}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setSelectedBook(book.abbrev)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{book.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {book.chapters} cap.
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                // Capítulos do livro selecionado
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBook(null)}
                    >
                      ← Voltar
                    </Button>
                    <span className="font-medium">
                      {selectedBookData?.name}
                    </span>
                  </div>

                  <ScrollArea className="h-64">
                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: selectedBookData?.chapters || 0 }, (_, i) => i + 1).map((chapter) => (
                        <motion.div
                          key={chapter}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant={
                              settings.current_book === selectedBook && 
                              settings.current_chapter === chapter 
                                ? "default" 
                                : "outline"
                            }
                            size="sm"
                            className="w-full"
                            onClick={() => handleChapterSelect(chapter)}
                          >
                            {chapter}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}