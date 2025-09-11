// hooks/useBible.ts
"use client"

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { bibleDataManager } from '@/lib/bible-data'
import type { BibleData, BibleChapter, BibleSettings, BibleBookmark, BibleVerse, BibleSearchResult } from '@/types/bible'

export function useBible(initialSettings: Partial<BibleSettings> = {}) {
  const [bibleData, setBibleData] = useState<BibleData | null>(null)
  const [currentChapter, setCurrentChapter] = useState<BibleChapter | null>(null)
  const [settings, setSettings] = useState<BibleSettings>(() => ({
    bible_version: 'acf',
    current_book: 'gn',
    current_chapter: 1,
    font_size: 16,
    ...initialSettings,
  }))
  const [loading, setLoading] = useState(true)

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

  const loadChapter = useCallback(async (version: 'acf' | 'nvi', bookAbbrev: string, chapterNum: number) => {
    if (!bookAbbrev || !chapterNum) return
    setLoading(true)
    try {
      const chapterData = await bibleDataManager.getChapter(version, bookAbbrev, chapterNum)
      setCurrentChapter(chapterData)
    } catch (error) {
      console.error('Error loading chapter:', error)
      toast.error('Erro ao carregar o capítulo.')
      setCurrentChapter(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = (updates: Partial<BibleSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  useEffect(() => {
    loadBibleData(settings.bible_version)
  }, [settings.bible_version, loadBibleData])

  useEffect(() => {
    loadChapter(settings.bible_version, settings.current_book, settings.current_chapter)
  }, [settings.bible_version, settings.current_book, settings.current_chapter, loadChapter])

  return {
    bibleData,
    currentChapter,
    settings,
    loading,
    updateSettings,
    loadChapter,
  }
}
