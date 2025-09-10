// hooks/useBible.ts
"use client"

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { bibleDataManager } from '@/lib/bible-data'
import type { BibleData, BibleChapter, BibleSettings, BibleBookmark, BibleVerse, BibleSearchResult } from '@/types/bible'

export function useBible() {
  const [bibleData, setBibleData] = useState<BibleData | null>(null)
  const [currentChapter, setCurrentChapter] = useState<BibleChapter | null>(null)
  const [settings, setSettings] = useState<BibleSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<BibleSearchResult[]>([])

  // Carrega as configurações iniciais do usuário ou usa o padrão
  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/bible/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      } else {
        setSettings({
          bible_version: 'acf',
          current_book: 'gn',
          current_chapter: 1,
          font_size: 16
        } as BibleSettings)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      setSettings({ bible_version: 'acf', current_book: 'gn', current_chapter: 1, font_size: 16 } as BibleSettings)
    }
  }, [])

  // Atualiza as configurações no servidor e localmente
  const updateSettings = useCallback(async (updates: Partial<BibleSettings>) => {
    const newSettings = { ...settings, ...updates } as BibleSettings
    setSettings(newSettings)
    try {
      await fetch('/api/bible/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error("Erro ao salvar suas preferências.")
    }
  }, [settings])

  // Carrega o índice de livros da Bíblia para uma versão específica
  const loadBibleData = useCallback(async (version: 'acf' | 'nvi') => {
    try {
      const data = await bibleDataManager.getBibleData(version)
      setBibleData(data)
      return data
    } catch (error) {
      console.error('Error loading Bible data:', error)
      toast.error('Erro ao carregar o índice da Bíblia.')
      return null
    }
  }, [])

  // Carrega um capítulo específico, incluindo seus marcadores
  const loadChapter = useCallback(async (
    version: 'acf' | 'nvi',
    bookAbbrev: string,
    chapterNum: number
  ) => {
    if (!bookAbbrev || !chapterNum) return
    setLoading(true)
    
    try {
      const chapterData = await bibleDataManager.getChapter(version, bookAbbrev, chapterNum)
      const bookmarksResponse = await fetch(`/api/bible/bookmarks?book=${bookAbbrev}&chapter=${chapterNum}`)
      const { bookmarks } = await bookmarksResponse.json() as { bookmarks: BibleBookmark[] }

      const bookmarksMap = new Map(bookmarks.map(b => [b.verse, b.color]))
      
      const versesWithHighlights: BibleVerse[] = chapterData.verses.map(verse => {
        const highlightColor = bookmarksMap.get(verse.n)
        return highlightColor ? { ...verse, highlightColor } : verse
      })

      setCurrentChapter({ ...chapterData, verses: versesWithHighlights })
    } catch (error) {
      console.error('Error loading chapter:', error)
      toast.error('Erro ao carregar o capítulo.')
      setCurrentChapter(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Salva uma marcação (highlight) de forma otimista
  const saveBookmark = useCallback(async (verse: BibleVerse, color: string, note?: string) => {
    if (!settings) return

    const originalColor = verse.highlightColor

    // Atualização otimista da UI
    setCurrentChapter(prevChapter => {
      if (!prevChapter) return null
      const newVerses = prevChapter.verses.map(v => 
        v.n === verse.n ? { ...v, highlightColor: color } : v
      )
      return { ...prevChapter, verses: newVerses }
    })

    // Requisição para a API
    try {
      const response = await fetch('/api/bible/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_abbrev: settings.current_book,
          chapter: settings.current_chapter,
          verse: verse.n,
          text: verse.text,
          color,
          note,
        })
      })

      if (!response.ok) throw new Error('Failed to save bookmark')
      toast.success("Versículo marcado!")

    } catch (error) {
      console.error('Error saving bookmark:', error)
      toast.error("Erro ao salvar marcação.")

      // Rollback em caso de erro
      setCurrentChapter(prevChapter => {
        if (!prevChapter) return null
        const newVerses = prevChapter.verses.map(v => 
          v.n === verse.n ? { ...v, highlightColor: originalColor } : v
        )
        return { ...prevChapter, verses: newVerses }
      })
    }
  }, [settings])

  // Funções de navegação
  const navigateTo = useCallback((book: string, chapter: number) => {
    if (!settings) return
    loadChapter(settings.bible_version, book, chapter)
    updateSettings({ current_book: book, current_chapter: chapter })
  }, [settings, loadChapter, updateSettings])

  const nextChapter = useCallback(() => {
    if (!bibleData || !settings) return
    const next = bibleDataManager.getNextChapter(bibleData, settings.current_book, settings.current_chapter)
    if (next) {
      navigateTo(next.book, next.chapter)
    }
  }, [bibleData, settings, navigateTo])

  const previousChapter = useCallback(() => {
    if (!bibleData || !settings) return
    const prev = bibleDataManager.getPreviousChapter(bibleData, settings.current_book, settings.current_chapter)
    if (prev) {
      navigateTo(prev.book, prev.chapter)
    }
  }, [bibleData, settings, navigateTo])

  // Busca de versículos
  const searchVerses = async (query: string) => {
    if (!settings || !query.trim()) {
      setSearchResults([])
      return
    }
    try {
      const results = await bibleDataManager.searchVerses(settings.bible_version, query.trim(), 50)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching verses:', error)
      toast.error('Erro na busca.')
    }
  }

  // Efeito para carregar as configurações iniciais
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // Efeito para carregar os dados da Bíblia e o capítulo inicial ou quando a versão muda
  useEffect(() => {
    if (settings) {
      setLoading(true)
      loadBibleData(settings.bible_version).then(() => {
        if (settings) { // Verifica de novo pois o estado pode ter mudado
          loadChapter(settings.bible_version, settings.current_book, settings.current_chapter)
        }
      })
    }
  }, [settings?.bible_version]) // Roda apenas na mudança da versão

  return {
    bibleData,
    currentChapter,
    settings,
    searchResults,
    loading,
    loadChapter: navigateTo, // Expondo navigateTo como loadChapter para o seletor de livros
    nextChapter,
    previousChapter,
    searchVerses,
    updateSettings,
    setSearchResults,
    saveBookmark,
  }
}
