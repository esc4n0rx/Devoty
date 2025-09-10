// lib/bible-parser.ts
import { XMLParser } from 'fast-xml-parser'
import type { BibleData, BibleBook, BibleChapter, BibleVerse } from '@/types/bible'

class BibleParser {
  private parser: XMLParser
  private bibleData: Map<string, BibleData> = new Map()

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseAttributeValue: true,
      trimValues: true,
    })
  }

  async loadBible(version: 'acf' | 'nvi' = 'acf'): Promise<BibleData> {
    // Verificar cache primeiro
    if (this.bibleData.has(version)) {
      return this.bibleData.get(version)!
    }

    try {
      const response = await fetch(`/bible/${version}.min.xml`)
      if (!response.ok) {
        throw new Error(`Failed to load Bible ${version}`)
      }

      const xmlText = await response.text()
      const result = this.parser.parse(xmlText)

      const bibleData = this.processBibleXML(result)
      this.bibleData.set(version, bibleData)

      return bibleData
    } catch (error) {
      console.error('Error loading Bible:', error)
      throw new Error(`Failed to parse Bible ${version}`)
    }
  }

  private processBibleXML(xml: any): BibleData {
    const books: BibleBook[] = []
    const bookMap = new Map<string, BibleBook>()

    const booksArray = Array.isArray(xml.bible.book) ? xml.bible.book : [xml.bible.book]

    for (const bookXml of booksArray) {
      const book: BibleBook = {
        name: bookXml.name,
        abbrev: bookXml.abbrev,
        chapters: parseInt(bookXml.chapters),
        chaptersData: new Map()
      }

      books.push(book)
      bookMap.set(book.abbrev, book)
    }

    return { books, bookMap }
  }

  async loadChapter(
    version: 'acf' | 'nvi',
    bookAbbrev: string,
    chapterNum: number
  ): Promise<BibleChapter> {
    const bibleData = await this.loadBible(version)
    const book = bibleData.bookMap.get(bookAbbrev)

    if (!book) {
      throw new Error(`Book ${bookAbbrev} not found`)
    }

    // Verificar cache do capítulo
    if (book.chaptersData?.has(chapterNum)) {
      return book.chaptersData.get(chapterNum)!
    }

    // Carregar capítulo sob demanda
    try {
      const response = await fetch(`/bible/${version}.min.xml`)
      const xmlText = await response.text()
      const result = this.parser.parse(xmlText)

      const chapter = this.findChapterInXML(result, bookAbbrev, chapterNum)
      
      if (!book.chaptersData) {
        book.chaptersData = new Map()
      }
      book.chaptersData.set(chapterNum, chapter)

      return chapter
    } catch (error) {
      console.error('Error loading chapter:', error)
      throw new Error(`Failed to load chapter ${chapterNum} of ${bookAbbrev}`)
    }
  }

  private findChapterInXML(xml: any, bookAbbrev: string, chapterNum: number): BibleChapter {
    const booksArray = Array.isArray(xml.bible.book) ? xml.bible.book : [xml.bible.book]
    
    for (const bookXml of booksArray) {
      if (bookXml.abbrev === bookAbbrev) {
        const chaptersArray = Array.isArray(bookXml.c) ? bookXml.c : [bookXml.c]
        
        for (const chapterXml of chaptersArray) {
          if (parseInt(chapterXml.n) === chapterNum) {
            const verses: BibleVerse[] = []
            const versesArray = Array.isArray(chapterXml.v) ? chapterXml.v : [chapterXml.v]
            
            for (const verseXml of versesArray) {
              verses.push({
                n: parseInt(verseXml.n),
                text: verseXml['#text'] || verseXml
              })
            }

            return {
              n: chapterNum,
              verses
            }
          }
        }
      }
    }

    throw new Error(`Chapter ${chapterNum} not found in book ${bookAbbrev}`)
  }

  async searchVerses(
    version: 'acf' | 'nvi',
    query: string,
    limit: number = 50
  ): Promise<Array<{
    book_abbrev: string
    book_name: string
    chapter: number
    verse: number
    text: string
  }>> {
    try {
      const response = await fetch(`/bible/${version}.min.xml`)
      const xmlText = await response.text()
      const result = this.parser.parse(xmlText)

      const results: Array<{
        book_abbrev: string
        book_name: string
        chapter: number
        verse: number
        text: string
      }> = []

      const queryLower = query.toLowerCase()
      const booksArray = Array.isArray(result.bible.book) ? result.bible.book : [result.bible.book]

      for (const book of booksArray) {
        if (results.length >= limit) break

        const chaptersArray = Array.isArray(book.c) ? book.c : [book.c]
        
        for (const chapter of chaptersArray) {
          if (results.length >= limit) break

          const versesArray = Array.isArray(chapter.v) ? chapter.v : [chapter.v]
          
          for (const verse of versesArray) {
            if (results.length >= limit) break

            const text = verse['#text'] || verse
            if (text.toLowerCase().includes(queryLower)) {
              results.push({
                book_abbrev: book.abbrev,
                book_name: book.name,
                chapter: parseInt(chapter.n),
                verse: parseInt(verse.n),
                text
              })
            }
          }
        }
      }

      return results
    } catch (error) {
      console.error('Error searching verses:', error)
      return []
    }
  }
}

export const bibleParser = new BibleParser()