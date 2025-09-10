// components/bible-bookmark-modal.tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Bookmark, Palette } from 'lucide-react'
import type { BibleVerse } from '@/types/bible'

interface BibleBookmarkModalProps {
  isOpen: boolean
  onClose: () => void
  verse: BibleVerse | null
  bookName: string
  chapter: number
  onSave: (note?: string, color?: string) => void
}

const BOOKMARK_COLORS = [
  { name: 'Amarelo', value: 'yellow', color: 'bg-yellow-200' },
  { name: 'Verde', value: 'green', color: 'bg-green-200' },
  { name: 'Azul', value: 'blue', color: 'bg-blue-200' },
  { name: 'Rosa', value: 'pink', color: 'bg-pink-200' },
  { name: 'Roxo', value: 'purple', color: 'bg-purple-200' },
  { name: 'Laranja', value: 'orange', color: 'bg-orange-200' },
]

export function BibleBookmarkModal({ 
  isOpen, 
  onClose, 
  verse, 
  bookName, 
  chapter, 
  onSave 
}: BibleBookmarkModalProps) {
  const [note, setNote] = useState('')
  const [selectedColor, setSelectedColor] = useState('yellow')

  const handleSave = () => {
    onSave(note.trim() || undefined, selectedColor)
    setNote('')
    setSelectedColor('yellow')
  }

  const handleClose = () => {
    setNote('')
    setSelectedColor('yellow')
    onClose()
  }

  if (!verse) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-accent" />
                  Marcar Versículo
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Referência do versículo */}
                <div className="bg-accent/10 p-3 rounded-lg">
                  <div className="font-semibold text-foreground mb-2">
                    {bookName} {chapter}:{verse.n}
                  </div>
                  <p className="text-sm text-foreground/80 italic">
                    "{verse.text}"
                  </p>
                </div>

                {/* Seleção de cor */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Cor da marcação
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {BOOKMARK_COLORS.map((color) => (
                      <motion.button
                        key={color.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          w-8 h-8 rounded-full border-2 transition-all
                          ${color.color}
                          ${selectedColor === color.value 
                            ? 'border-foreground shadow-lg' 
                            : 'border-border hover:border-foreground/50'
                          }
                        `}
                        onClick={() => setSelectedColor(color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Nota opcional */}
                <div className="space-y-2">
                  <Label htmlFor="note">Nota (opcional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Adicione suas reflexões sobre este versículo..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-accent hover:bg-accent/90">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Marcar
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}