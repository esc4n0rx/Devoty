// components/bible-search.tsx
"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Search, X, BookOpen } from 'lucide-react'
import { useBible } from '@/hooks/useBible'
import { useDebounce } from '@/hooks/useDebounce'

interface BibleSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function BibleSearch({ isOpen, onClose }: BibleSearchProps) {
  const [query, setQuery] = useState('')
  const { searchResults, searchVerses, loadChapter, settings, setSearchResults } = useBible()
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery.trim() && debouncedQuery.length >= 3) {
      searchVerses(debouncedQuery)
    } else {
      setSearchResults([])
    }
  }, [debouncedQuery, searchVerses, setSearchResults])

  const handleResultClick = async (result: any) => {
    if (settings) {
      await loadChapter(settings.bible_version, result.book_abbrev, result.chapter)
      onClose()
    }
  }

  const handleClose = () => {
    setQuery('')
    setSearchResults([])
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-accent" />
                  Buscar na Bíblia
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Campo de busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Digite palavras ou frases para buscar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-10"
                    autoFocus
                  />
                  {query && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Dica de busca */}
                {!query && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Digite pelo menos 3 caracteres para começar a busca
                  </p>
                )}

                {/* Resultados */}
                {query && (
                  <ScrollArea className="h-96">
                    <AnimatePresence>
                      {searchResults.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground mb-3">
                            {searchResults.length} resultado(s) encontrado(s)
                          </p>
                          {searchResults.map((result, index) => (
                            <motion.div
                              key={`${result.book_abbrev}-${result.chapter}-${result.verse}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-3 border border-border rounded-lg hover:bg-accent/5 cursor-pointer transition-colors"
                              onClick={() => handleResultClick(result)}
                            >
                              <div className="flex items-start gap-3">
                                <BookOpen className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {result.book_name} {result.chapter}:{result.verse}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-foreground leading-relaxed">
                                    {result.text}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : query.length >= 3 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-8"
                        >
                          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">
                            Nenhum resultado encontrado para "{query}"
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </ScrollArea>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}