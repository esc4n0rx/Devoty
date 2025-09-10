// lib/bible-data.ts
import { bibleParser } from './bible-parser'
import type { BibleData, BibleBook, BibleChapter, BibleSettings } from '@/types/bible'

class BibleDataManager {
  private cache = new Map<string, any>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  async getBibleData(version: 'acf' | 'nvi' = 'acf'): Promise<BibleData> {
    const cacheKey = `bible-${version}`
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data
      }
    }

    const data = await bibleParser.loadBible(version)
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    return data
  }

  async getChapter(
    version: 'acf' | 'nvi',
    bookAbbrev: string,
    chapterNum: number
  ): Promise<BibleChapter> {
    const cacheKey = `chapter-${version}-${bookAbbrev}-${chapterNum}`
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data
      }
    }

    const data = await bibleParser.loadChapter(version, bookAbbrev, chapterNum)
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })

    return data
  }

  async searchVerses(version: 'acf' | 'nvi', query: string, limit?: number) {
    return bibleParser.searchVerses(version, query, limit)
  }

  getDefaultSettings(): Omit<BibleSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
    return {
      bible_version: 'acf',
      current_book: 'gn',
      current_chapter: 1,
      font_size: 16
    }
  }

  getBooksForNavigation(data: BibleData) {
    return data.books.map(book => ({
      name: book.name,
      abbrev: book.abbrev,
      chapters: Array.from({ length: book.chapters }, (_, i) => i + 1)
    }))
  }

  getNextChapter(
    data: BibleData,
    currentBook: string,
    currentChapter: number
  ): { book: string; chapter: number } | null {
    const book = data.bookMap.get(currentBook)
    if (!book) return null

    if (currentChapter < book.chapters) {
      return { book: currentBook, chapter: currentChapter + 1 }
    }

    // Próximo livro
    const currentIndex = data.books.findIndex(b => b.abbrev === currentBook)
    if (currentIndex >= 0 && currentIndex < data.books.length - 1) {
      const nextBook = data.books[currentIndex + 1]
      return { book: nextBook.abbrev, chapter: 1 }
    }

    return null
  }

  getPreviousChapter(
    data: BibleData,
    currentBook: string,
    currentChapter: number
  ): { book: string; chapter: number } | null {
    if (currentChapter > 1) {
      return { book: currentBook, chapter: currentChapter - 1 }
    }

    // Livro anterior
    const currentIndex = data.books.findIndex(b => b.abbrev === currentBook)
    if (currentIndex > 0) {
      const prevBook = data.books[currentIndex - 1]
      return { book: prevBook.abbrev, chapter: prevBook.chapters }
    }

    return null
  }
}

export const bibleDataManager = new BibleDataManager()