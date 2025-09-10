// components/screens/biblia-screen.tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
 SelectTrigger, 
 SelectValue 
} from '@/components/ui/select'
import { Search, Loader2 } from 'lucide-react'
import { useBible } from '@/hooks/useBible'
import { BibleReader } from '@/components/bible-reader'
import { BibleChapterControls } from '@/components/bible-chapter-controls'
import { BibleSearch } from '@/components/bible-search'

export function BibliaScreen() {
 const {
   bibleData,
   currentChapter,
   settings,
   loading,
   updateSettings,
   searchVerses,
   saveBookmark
 } = useBible()
 
 const [showSearch, setShowSearch] = useState(false)
 const [searchQuery, setSearchQuery] = useState('')

 const handleVersionChange = async (version: 'acf' | 'nvi') => {
   await updateSettings({ bible_version: version })
 }

 const getCurrentBookName = () => {
   if (!bibleData || !settings) return ''
   const book = bibleData.bookMap.get(settings.current_book)
   return book?.name || ''
 }

 const handleQuickSearch = () => {
   if (searchQuery.trim()) {
     searchVerses(searchQuery.trim())
     setShowSearch(true)
   }
 }

 // Loading inicial
 if (loading && !currentChapter) {
   return (
     <div className="flex items-center justify-center min-h-[70vh]">
       <motion.div
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: 1, scale: 1 }}
         className="text-center space-y-4"
       >
         <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
         >
           <Loader2 className="h-8 w-8 text-accent mx-auto" />
         </motion.div>
         <p className="text-muted-foreground">Carregando Bíblia...</p>
       </motion.div>
     </div>
   )
 }

 return (
   <div className="flex flex-col h-screen bg-background">
     {/* Header com controles */}
     <div className="flex-shrink-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
       <div className="px-4 py-3 space-y-3">
         {/* Linha 1: Saudação */}
         <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex items-center justify-between"
         >
           <div>
             <h1 className="text-lg font-bold text-foreground">Bíblia Sagrada</h1>
             <p className="text-sm text-muted-foreground">Explore a Palavra de Deus</p>
           </div>
           
           {/* Indicador de versão */}
           {settings && (
             <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
             >
               <Select
                 value={settings.bible_version}
                 onValueChange={handleVersionChange}
               >
                 <SelectTrigger className="w-20 h-8 text-xs">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="acf">ACF</SelectItem>
                   <SelectItem value="nvi">NVI</SelectItem>
                 </SelectContent>
               </Select>
             </motion.div>
           )}
         </motion.div>

         {/* Linha 2: Busca */}
         <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="flex gap-2"
         >
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Buscar versículos..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
               className="pl-10 h-9"
             />
           </div>
           <Button
             size="sm"
             onClick={handleQuickSearch}
             disabled={!searchQuery.trim()}
             className="h-9 px-3"
           >
             <Search className="h-4 w-4" />
           </Button>
         </motion.div>
       </div>
     </div>

     {/* Conteúdo principal scrollável */}
     <div className="flex-1 overflow-y-auto">
       <AnimatePresence mode="wait">
         {currentChapter && settings ? (
           <motion.div
             key={`${settings.current_book}-${settings.current_chapter}`}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             transition={{ duration: 0.3 }}
           >
             <BibleReader
             chapter={currentChapter}
             bookName={getCurrentBookName()}
             bookAbbrev={settings.current_book}
             fontSize={settings.font_size}
             version={settings.bible_version}
             saveBookmark={saveBookmark}
           />
           </motion.div>
         ) : !loading ? (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex items-center justify-center min-h-[50vh]"
           >
             <div className="text-center space-y-4">
               <div className="text-6xl">📖</div>
               <div>
                 <h3 className="text-lg font-semibold text-foreground mb-2">
                   Bem-vindo à Bíblia
                 </h3>
                 <p className="text-muted-foreground mb-4">
                   Toque no controle abaixo para escolher um livro
                 </p>
               </div>
             </div>
           </motion.div>
         ) : null}
       </AnimatePresence>
     </div>

     {/* Controles de navegação */}
     <BibleChapterControls />

     {/* Modal de busca */}
     <BibleSearch
       isOpen={showSearch}
       onClose={() => {
         setShowSearch(false)
         setSearchQuery('')
       }}
     />
   </div>
 )
}