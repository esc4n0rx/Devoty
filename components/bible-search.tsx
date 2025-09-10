// components/bible-search.tsx
"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'
import { useBible } from '@/hooks/useBible'

interface BibleSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function BibleSearch({ isOpen, onClose }: BibleSearchProps) {
  const { searchResults, loadChapter, settings, setSearchResults } = useBible()

  const handleResultClick = async (result: any) => {
    if (settings) {
      await loadChapter(settings.bible_version, result.book_abbrev, result.chapter)
      onClose()
    }
  }

  const handleClose = () => {
    setSearchResults([])
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-lg max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-accent" />
                  Resultados da Busca
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-96">
              <AnimatePresence>
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {searchResults.length} resultado(s) encontrado(s)
                    </p>
                    
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={`${result.book_abbrev}-${result.chapter}-${result.verse}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 border border-border rounded-lg hover:bg-accent/5 cursor-pointer transition-colors"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="space-y-2">
                          <Badge variant="secondary" className="text-xs">
                            {result.book_name} {result.chapter}:{result.verse}
                          </Badge>
                          <p className="text-sm text-foreground leading-relaxed">
                            {result.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Nenhum resultado encontrado
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}