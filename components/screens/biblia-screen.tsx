// components/screens/biblia-screen.tsx
"use client"

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBible } from '@/hooks/useBible'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Book, Search, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react'
import type { BibleVerse } from '@/types/bible'

export function BibliaScreen() {
  const { bibleData, currentChapter, settings, loading, updateSettings } = useBible()
  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentBook = useMemo(() => {
    if (!bibleData || !settings) return null
    return bibleData.bookMap.get(settings.current_book)
  }, [bibleData, settings])

  const handleVersionChange = (version: 'acf' | 'nvi') => {
    updateSettings({ bible_version: version })
  }

  const handleChapterChange = (chapter: number) => {
    updateSettings({ current_chapter: chapter })
    setIsBookSelectorOpen(false)
    scrollToTop()
  }

  const handleBookChange = (bookAbbrev: string) => {
    updateSettings({ current_book: bookAbbrev, current_chapter: 1 })
  }

  const nextChapter = () => {
    if (!bibleData || !settings || !currentBook) return
    if (settings.current_chapter < currentBook.chapters) {
      updateSettings({ current_chapter: settings.current_chapter + 1 })
    } else {
      const bookIndex = bibleData.books.findIndex(b => b.abbrev === settings.current_book)
      if (bookIndex < bibleData.books.length - 1) {
        const nextBook = bibleData.books[bookIndex + 1]
        updateSettings({ current_book: nextBook.abbrev, current_chapter: 1 })
      }
    }
    scrollToTop()
  }

  const previousChapter = () => {
    if (!bibleData || !settings) return
    if (settings.current_chapter > 1) {
      updateSettings({ current_chapter: settings.current_chapter - 1 })
    } else {
      const bookIndex = bibleData.books.findIndex(b => b.abbrev === settings.current_book)
      if (bookIndex > 0) {
        const prevBook = bibleData.books[bookIndex - 1]
        updateSettings({ current_book: prevBook.abbrev, current_chapter: prevBook.chapters })
      }
    }
    scrollToTop()
  }

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowScrollTop(scrollRef.current.scrollTop > 300)
    }
  }

  useEffect(() => {
    const scrollable = scrollRef.current
    scrollable?.addEventListener('scroll', handleScroll)
    return () => scrollable?.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading && !currentChapter) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex-shrink-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Bíblia Sagrada</h1>
          {settings && (
            <Select value={settings.bible_version} onValueChange={handleVersionChange}>
              <SelectTrigger className="w-24 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acf">ACF</SelectItem>
                <SelectItem value="nvi">NVI</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </header>

      {/* Bible Reader */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto relative pb-20">
        <AnimatePresence mode="wait">
          {currentChapter && settings ? (
            <motion.div
              key={`${settings.current_book}-${settings.current_chapter}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-16"
            >
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold">{currentBook?.name}</h2>
                <p className="text-6xl font-light text-foreground/60 mt-2">{currentChapter.n}</p>
              </div>
              <div className="max-w-2xl mx-auto space-y-2 text-lg leading-relaxed">
                {currentChapter.verses.map((verse: BibleVerse) => (
                  <p key={verse.n}>
                    <span className="font-bold text-accent text-sm align-super mr-2">{verse.n}</span>
                    {verse.text}
                  </p>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Selecione um livro e capítulo.</p>
            </div>
          )}
        </AnimatePresence>

        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <Button
                size="icon"
                className="fixed bottom-24 right-4 rounded-full shadow-lg"
                onClick={scrollToTop}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-16 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-t">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button size="icon" variant="ghost" onClick={previousChapter} disabled={settings.current_book === 'gn' && settings.current_chapter === 1}>
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Dialog open={isBookSelectorOpen} onOpenChange={setIsBookSelectorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 mx-4">
                {currentBook?.name} {settings.current_chapter}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Selecionar Livro e Capítulo</DialogTitle>
              </DialogHeader>
              <BookSelector
                bibleData={bibleData}
                currentBookAbbrev={settings.current_book}
                currentChapter={settings.current_chapter}
                onBookChange={handleBookChange}
                onChapterChange={handleChapterChange}
              />
            </DialogContent>
          </Dialog>

          <Button size="icon" variant="ghost" onClick={nextChapter}>
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </footer>
    </div>
  )
}

function BookSelector({ bibleData, currentBookAbbrev, currentChapter, onBookChange, onChapterChange }: any) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBookAbbrev, setSelectedBookAbbrev] = useState<string | null>(null)

  const filteredBooks = useMemo(() => {
    if (!bibleData) return []
    return bibleData.books.filter((book: any) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [bibleData, searchTerm])

  const selectedBook = useMemo(() => {
    if (!bibleData || !selectedBookAbbrev) return null
    return bibleData.bookMap.get(selectedBookAbbrev)
  }, [bibleData, selectedBookAbbrev])

  const handleBookSelect = (bookAbbrev: string) => {
    setSelectedBookAbbrev(bookAbbrev)
  }

  const handleChapterSelect = (chapter: number) => {
    if (selectedBookAbbrev) {
      onBookChange(selectedBookAbbrev)
      onChapterChange(chapter)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar livro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!selectedBookAbbrev ? (
            <motion.div
              key="book-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ScrollArea className="h-full">
                <div className="p-2">
                  {filteredBooks.map((book: any) => (
                    <Button
                      key={book.abbrev}
                      variant={'ghost'}
                      className="w-full justify-start"
                      onClick={() => handleBookSelect(book.abbrev)}
                    >
                      {book.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          ) : (
            <motion.div
              key="chapter-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full"
            >
              <div className="p-4">
                <Button variant="ghost" size="sm" onClick={() => setSelectedBookAbbrev(null)} className="mb-4">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Voltar para livros
                </Button>
                <h3 className="font-bold text-lg mb-2">{selectedBook?.name}</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 grid grid-cols-5 gap-2">
                  {selectedBook && Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                    <Button
                      key={chapter}
                      variant={currentBookAbbrev === selectedBookAbbrev && currentChapter === chapter ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChapterSelect(chapter)}
                    >
                      {chapter}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
