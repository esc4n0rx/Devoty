// lib/bible-parser.ts
import { XMLParser } from 'fast-xml-parser'
import { bibleCache } from './bible-cache'
import type { BibleData, BibleBook, BibleChapter } from '@/types/bible'

class OptimizedBibleParser {
  private parser: XMLParser
  private booksIndex = new Map<string, { name: string; abbrev: string; chapters: number }>()

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseAttributeValue: true,
      trimValues: true,
      processEntities: true,
    })
  }

  async loadBooksIndex(version: 'acf' | 'nvi' = 'acf'): Promise<BibleData> {
    const cacheKey = `books-index-${version}`
    const cached = bibleCache.get<BibleData>(cacheKey)
    
    if (cached) return cached

    try {
      const response = await fetch(`/bible/${version}.min.xml`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const text = await response.text()
      
      // Parse apenas a estrutura dos livros
      const booksRegex = /<book\s+name="([^"]+)"\s+abbrev="([^"]+)"\s+chapters="(\d+)"/g
      const books: BibleBook[] = []
      const bookMap = new Map<string, BibleBook>()

      let match: RegExpExecArray | null
      while ((match = booksRegex.exec(text)) !== null) {
        const book: BibleBook = {
          name: match[1],
          abbrev: match[2],
          chapters: parseInt(match[3])
        }
        books.push(book)
        bookMap.set(book.abbrev, book)
        this.booksIndex.set(book.abbrev, book)
      }

      const data = { books, bookMap }
      bibleCache.set(cacheKey, data)
      return data

    } catch (error) {
      console.error('Error loading books index:', error)
      throw new Error(`Failed to load Bible index`)
    }
  }

  async loadChapter(
    version: 'acf' | 'nvi',
    bookAbbrev: string,
    chapterNum: number
  ): Promise<BibleChapter> {
    const cacheKey = `chapter-${version}-${bookAbbrev}-${chapterNum}`
    const cached = bibleCache.get<BibleChapter>(cacheKey)
    
    if (cached) return cached

    try {
      const response = await fetch(`/bible/${version}.min.xml`)
      const text = await response.text()

      // Encontrar o livro
      const bookStartPattern = `<book name="[^"]*" abbrev="${bookAbbrev}" chapters="\\d+">`
      const bookStartRegex = new RegExp(bookStartPattern)
      const bookStartMatch = text.search(bookStartRegex)
      
      if (bookStartMatch === -1) {
        throw new Error(`Book ${bookAbbrev} not found`)
      }

      // Encontrar o final do livro
      const bookEndIndex = text.indexOf('</book>', bookStartMatch)
      if (bookEndIndex === -1) {
        throw new Error(`Book ${bookAbbrev} end not found`)
      }

      const bookContent = text.substring(bookStartMatch, bookEndIndex)

      // Encontrar o capítulo específico
      const chapterPattern = `<c n="${chapterNum}">`
      const chapterStartIndex = bookContent.indexOf(chapterPattern)
      
      if (chapterStartIndex === -1) {
        throw new Error(`Chapter ${chapterNum} not found in book ${bookAbbrev}`)
      }

      const chapterEndIndex = bookContent.indexOf('</c>', chapterStartIndex)
      if (chapterEndIndex === -1) {
        throw new Error(`Chapter ${chapterNum} end not found`)
      }

      const chapterContent = bookContent.substring(chapterStartIndex, chapterEndIndex)

      // Extrair versículos usando regex mais simples
      const verses = []
      const versePattern = /<v n="(\d+)">([^<]*)<\/v>/g
      
      let verseMatch: RegExpExecArray | null
      while ((verseMatch = versePattern.exec(chapterContent)) !== null) {
        verses.push({
          n: parseInt(verseMatch[1]),
          text: verseMatch[2].trim()
        })
      }

      // Se não encontrou versículos com a regex simples, tentar uma mais robusta
      if (verses.length === 0) {
        const alternativePattern = /<v n="(\d+)"[^>]*>(.*?)<\/v>/g
        let altMatch: RegExpExecArray | null
        while ((altMatch = alternativePattern.exec(chapterContent)) !== null) {
          const cleanText = altMatch[2].replace(/<[^>]*>/g, '').trim()
          if (cleanText) {
            verses.push({
              n: parseInt(altMatch[1]),
              text: cleanText
            })
          }
        }
      }

      if (verses.length === 0) {
        throw new Error(`No verses found in chapter ${chapterNum} of ${bookAbbrev}`)
      }

      const chapter = { n: chapterNum, verses }
      bibleCache.set(cacheKey, chapter)
      return chapter

    } catch (error) {
      console.error('Error loading chapter:', error)
      throw new Error(`Failed to load chapter ${chapterNum} of ${bookAbbrev}`)
    }
  }

  async searchVerses(version: 'acf' | 'nvi', query: string, limit = 50) {
    const cacheKey = `search-${version}-${query}-${limit}`
    const cached = bibleCache.get<any[]>(cacheKey)
    
    if (cached) return cached

    try {
      const response = await fetch(`/bible/${version}.min.xml`)
      const text = await response.text()

      const results = []
      const queryLower = query.toLowerCase()

      // Usar uma abordagem mais simples para busca
      const lines = text.split('\n')
      let currentBook = ''
      let currentBookAbbrev = ''
      let currentChapter = 0

      for (const line of lines) {
        if (results.length >= limit) break

        // Detectar início de livro
        const bookMatch = line.match(/<book name="([^"]+)" abbrev="([^"]+)"/)
        if (bookMatch) {
          currentBook = bookMatch[1]
          currentBookAbbrev = bookMatch[2]
          continue
        }

        // Detectar capítulo
        const chapterMatch = line.match(/<c n="(\d+)">/)
        if (chapterMatch) {
          currentChapter = parseInt(chapterMatch[1])
          continue
        }

        // Detectar versículo
        const verseMatch = line.match(/<v n="(\d+)">(.*?)<\/v>/)
        if (verseMatch && currentBook && currentChapter) {
          const verseNum = parseInt(verseMatch[1])
          const verseText = verseMatch[2].replace(/<[^>]*>/g, '').trim()
          
          if (verseText.toLowerCase().includes(queryLower)) {
            results.push({
              book_name: currentBook,
              book_abbrev: currentBookAbbrev,
              chapter: currentChapter,
              verse: verseNum,
              text: verseText
            })
          }
        }
      }

      bibleCache.set(cacheKey, results)
      return results

    } catch (error) {
      console.error('Error searching verses:', error)
      return []
    }
  }
}

export const optimizedBibleParser = new OptimizedBibleParser()