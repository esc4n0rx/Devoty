// components/screens/biblia-screen.tsx
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Sparkles, Search, Book, Loader2, RefreshCw } from 'lucide-react'
import { useBible } from '@/hooks/useBible'
import { BibleReader } from '@/components/bible-reader'
import { BibleSearch } from '@/components/bible-search'
import { BibleNavigation } from '@/components/bible-navigation'
import { FloatingBibleControls } from '@/components/floating-bible-controls'

export function BibliaScreen() {
  const {
    bibleData,
    currentChapter,
    settings,
    loading,
    updateSettings
  } = useBible()
  
  const [showSearch, setShowSearch] = useState(false)
  const [showNavigation, setShowNavigation] = useState(false)

  const handleVersionChange = async (version: 'acf' | 'nvi') => {
    await updateSettings({ bible_version: version })
    // O hook useBible automaticamente recarregará os dados
  }

  const getCurrentBookName = () => {
    if (!bibleData || !settings) return ''
    const book = bibleData.bookMap.get(settings.current_book)
    return book?.name || ''
  }

  if (loading && !currentChapter) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-accent mx-auto" />
          </motion.div>
          <p className="text-muted-foreground">Carregando a Bíblia...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <div className="p-6 space-y-6 pb-24">
        <motion.div
          className="text-center space-y-2"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-xl font-bold text-foreground"
            animate={{
              textShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 10px rgba(255,255,255,0.3)",
                "0 0 0px rgba(255,255,255,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            Bíblia Sagrada
          </motion.h2>
          <p className="text-muted-foreground">Explore a Palavra de Deus</p>
        </motion.div>

        {/* Controles superiores */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Seletor de versão */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Versão</span>
                </div>
                <Select
                  value={settings?.bible_version || 'acf'}
                  onValueChange={(value: 'acf' | 'nvi') => handleVersionChange(value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acf">
                      <div className="flex items-center justify-between w-full">
                        <span>Almeida Corrigida Fiel</span>
                        <Badge variant="secondary" className="ml-2">ACF</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="nvi">
                      <div className="flex items-center justify-between w-full">
                        <span>Nova Versão Internacional</span>
                        <Badge variant="secondary" className="ml-2">NVI</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSearch(true)}
              className="flex-1 sm:flex-none"
              disabled={loading}
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNavigation(true)}
              className="flex-1 sm:flex-none"
              disabled={loading}
            >
              <Book className="h-4 w-4 mr-2" />
              Navegar
            </Button>
          </div>
        </motion.div>

        {/* Indicador de capítulo atual */}
        {settings && currentChapter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-accent/10 to-transparent border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/20 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {getCurrentBookName()} {settings.current_chapter}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentChapter.verses.length} versículos
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {settings.bible_version.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Separator />

        {/* Leitor da Bíblia */}
        <AnimatePresence mode="wait">
          {currentChapter && settings ? (
            <BibleReader
              key={`${settings.current_book}-${settings.current_chapter}`}
              chapter={currentChapter}
              bookName={getCurrentBookName()}
              bookAbbrev={settings.current_book}
              fontSize={settings.font_size}
            />
          ) : !loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Bem-vindo à Bíblia
              </h3>
              <p className="text-muted-foreground mb-6">
                Selecione um livro e capítulo para começar a leitura
              </p>
              <Button onClick={() => setShowNavigation(true)}>
                <Book className="h-4 w-4 mr-2" />
                Escolher Livro
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Leitura sugerida (quando não há capítulo carregado) */}
        {!currentChapter && !loading && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <BookOpen className="h-5 w-5" />
                  </motion.div>
                  Leitura Sugerida
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-4 w-4 text-accent" />
                  </motion.div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Salmo 23</h3>
                  <p className="text-foreground leading-relaxed text-sm italic">
                    "O Senhor é o meu pastor; nada me faltará. Deitar-me faz em verdes pastos, 
                    guia-me mansamente a águas tranquilas. Refrigera a minha alma; guia-me pelas 
                    veredas da justiça, por amor do seu nome..."
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent hover:bg-accent/10 transition-all duration-300"
                  onClick={() => {
                    if (settings) {
                      // Navegar para Salmo 23 (assumindo 'sl' como abreviação)
                      // Você pode ajustar baseado na estrutura real dos seus XMLs
                    }
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ler capítulo completo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Controles flutuantes */}
      <FloatingBibleControls
        onSearchOpen={() => setShowSearch(true)}
        onNavigationOpen={() => setShowNavigation(true)}
      />

      {/* Modais */}
      <BibleSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />

      <BibleNavigation
        isOpen={showNavigation}
        onClose={() => setShowNavigation(false)}
      />
    </>
  )
}