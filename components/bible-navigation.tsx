// components/bible-navigation.tsx
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
import { Badge } from '@/components/ui/badge'
import { Book, Search } from 'lucide-react'
import { useBible } from '@/hooks/useBible'
import { bibleDataManager } from '@/lib/bible-data'

interface BibleNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function BibleNavigation({ isOpen, onClose }: BibleNavigationProps) {
  const { bibleData, settings, loadChapter } = useBible()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBook, setSelectedBook] = useState<string | null>(null)

  if (!bibleData || !settings) return null

  const books = bibleDataManager.getBooksForNavigation(bibleData)
  const filteredBooks = books.filter(book => 
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBookSelect = (bookAbbrev: string) => {
    if (selectedBook === bookAbbrev) {
      setSelectedBook(null)
    } else {
      setSelectedBook(bookAbbrev)
    }
  }

  const handleChapterSelect = async (bookAbbrev: string, chapter: number) => {
    await loadChapter(settings.bible_version, bookAbbrev, chapter)
    onClose()
  }

  const selectedBookData = selectedBook ? books.find(b => b.abbrev === selectedBook) : null

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-accent" />
                  Navegar pela Bíblia
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Campo de busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar livro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lista de livros */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">Livros</h3>
                    <ScrollArea className="h-80">
                      <div className="space-y-1">
                        {filteredBooks.map((book) => (
                          <Button
                            key={book.abbrev}
                            variant={selectedBook === book.abbrev ? "default" : "ghost"}
                            className="w-full justify-start text-left"
                            onClick={() => handleBookSelect(book.abbrev)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{book.name}</span>
                              <Badge variant="secondary" className="ml-2">
                                {book.chapters.length}
                              </Badge>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Capítulos do livro selecionado */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {selectedBookData ? `Capítulos - ${selectedBookData.name}` : 'Capítulos'}
                    </h3>
                    <ScrollArea className="h-80">
                      {selectedBookData ? (
                        <div className="grid grid-cols-4 gap-2">
                          {selectedBookData.chapters.map((chapter) => (
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
                                onClick={() => handleChapterSelect(selectedBook!, chapter)}
                              >
                                {chapter}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          Selecione um livro para ver os capítulos
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}