// hooks/useBible.ts
"use client"

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { bibleDataManager } from '@/lib/bible-data'
import type { BibleData, BibleChapter, BibleSettings } from '@/types/bible'

export function useBible() {
  const [bibleData, setBibleData] = useState<BibleData | null>(null)
  const [currentChapter, setCurrentChapter] = useState<BibleChapter | null>(null)
  const [settings, setSettings] = useState<BibleSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  // Configurações padrão
  const defaultSettings: Partial<BibleSettings> = {
    bible_version: 'acf',
    current_book: 'gn',
    current_chapter: 1,
    font_size: 16
  }

  // Carregar configurações
  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/bible/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      } else {
        setSettings(defaultSettings as BibleSettings)
      }
    } catch (error) {
      setSettings(defaultSettings as BibleSettings)
    }
  }, [])

  // Carregar índice dos livros (muito rápido)
  const loadBibleData = useCallback(async (version: 'acf' | 'nvi' = 'acf') => {
    try {
      const data = await bibleDataManager.getBibleData(version)
      setBibleData(data)
    } catch (error) {
      console.error('Error loading Bible data:', error)
      toast.error('Erro ao carregar índice da Bíblia')
    }
  }, [])

  // Carregar capítulo específico
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
      updateSettings({
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

  // Navegação entre capítulos
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
      const results = await bibleDataManager.searchVerses(
        settings.bible_version,
        query.trim(),
        50
      )
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching verses:', error)
      toast.error('Erro na busca')
    }
  }

  // Efeitos de inicialização
  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  useEffect(() => {
    if (settings) {
      loadBibleData(settings.bible_version)
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
    searchResults,
    loading,
    loadChapter,
    nextChapter,
    previousChapter,
    searchVerses,
    updateSettings,
    setSearchResults
  }
}