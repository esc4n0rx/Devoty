// hooks/useBible.ts
"use client"

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { bibleDataManager } from '@/lib/bible-data'
import type { 
  BibleData, 
  BibleChapter, 
  BibleSettings, 
  BibleBookmark, 
  BibleSearchResult 
} from '@/types/bible'

export function useBible() {
  const [bibleData, setBibleData] = useState<BibleData | null>(null)
  const [currentChapter, setCurrentChapter] = useState<BibleChapter | null>(null)
  const [settings, setSettings] = useState<BibleSettings | null>(null)
  const [bookmarks, setBookmarks] = useState<BibleBookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<BibleSearchResult[]>([])

  // Carregar configurações iniciais
  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/bible/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      } else {
        // Usar configurações padrão
        const defaultSettings = bibleDataManager.getDefaultSettings()
        setSettings({
          ...defaultSettings,
          id: '',
          user_id: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }, [])

  // Carregar dados da Bíblia
  const loadBibleData = useCallback(async (version: 'acf' | 'nvi' = 'acf') => {
    try {
      setLoading(true)
      const data = await bibleDataManager.getBibleData(version)
      setBibleData(data)
    } catch (error) {
      console.error('Error loading Bible data:', error)
      toast.error('Erro ao carregar a Bíblia')
    } finally {
      setLoading(false)
    }
  }, [])

  // Carregar capítulo
  const loadChapter = useCallback(async (
    version: 'acf' | 'nvi',
    bookAbbrev: string,
    chapterNum: number
  ) => {
    try {
      setLoading(true)
      const chapter = await bibleDataManager.getChapter(version, bookAbbrev, chapterNum)
      setCurrentChapter(chapter)
      
      // Atualizar configurações
      await updateSettings({
        current_book: bookAbbrev,
        current_chapter: chapterNum
      })
    } catch (error) {
      console.error('Error loading chapter:', error)
      toast.error('Erro ao carregar capítulo')
    } finally {
      setLoading(false)
    }
  }, [])

  // Atualizar configurações
  const updateSettings = async (updates: Partial<BibleSettings>) => {
    try {
      const response = await fetch('/api/bible/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  // Navegar para próximo capítulo
  const nextChapter = useCallback(() => {
    if (!bibleData || !settings) return

    const next = bibleDataManager.getNextChapter(
      bibleData,
      settings.current_book,
      settings.current_chapter
    )

    if (next) {
      loadChapter(settings.bible_version, next.book, next.chapter)
    }
  }, [bibleData, settings, loadChapter])

  // Navegar para capítulo anterior
  const previousChapter = useCallback(() => {
    if (!bibleData || !settings) return

    const prev = bibleDataManager.getPreviousChapter(
      bibleData,
      settings.current_book,
      settings.current_chapter
    )

    if (prev) {
      loadChapter(settings.bible_version, prev.book, prev.chapter)
    }
  }, [bibleData, settings, loadChapter])

  // Buscar versículos
  const searchVerses = async (query: string) => {
    if (!settings || !query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setLoading(true)
      const results = await bibleDataManager.searchVerses(
        settings.bible_version,
        query.trim()
      )
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching verses:', error)
      toast.error('Erro na busca')
    } finally {
      setLoading(false)
    }
  }

  // Adicionar marcação
  const addBookmark = async (
    bookAbbrev: string,
    chapter: number,
    verse: number,
    text: string,
    note?: string,
    color: string = 'yellow'
  ) => {
    try {
      const response = await fetch('/api/bible/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_abbrev: bookAbbrev,
          chapter,
          verse,
          text,
          note,
          color
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBookmarks(prev => [...prev, data.bookmark])
        toast.success('Versículo marcado!')
      }
    } catch (error) {
      console.error('Error adding bookmark:', error)
      toast.error('Erro ao marcar versículo')
    }
  }

  // Carregar marcações
  const loadBookmarks = async () => {
    try {
      const response = await fetch('/api/bible/bookmarks')
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data.bookmarks || [])
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error)
    }
  }

  // Efeitos
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  useEffect(() => {
    if (settings) {
      loadBibleData(settings.bible_version)
      loadBookmarks()
    }
  }, [settings, loadBibleData])

  useEffect(() => {
    if (settings && bibleData && !currentChapter) {
      loadChapter(settings.bible_version, settings.current_book, settings.current_chapter)
    }
  }, [settings, bibleData, currentChapter, loadChapter])

  return {
    bibleData,
    currentChapter,
    settings,
    bookmarks,
    searchResults,
    loading,
    loadChapter,
    nextChapter,
    previousChapter,
    searchVerses,
    addBookmark,
    updateSettings,
    setSearchResults
  }
}