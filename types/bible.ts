// types/bible.ts
export interface BibleVerse {
  n: number
  text: string
}

export interface BibleChapter {
  n: number
  verses: BibleVerse[]
}

export interface BibleBook {
  name: string
  abbrev: string
  chapters: number
  chaptersData?: Map<number, BibleChapter>
}

export interface BibleData {
  books: BibleBook[]
  bookMap: Map<string, BibleBook>
}

export interface BibleBookmark {
  id: string
  user_id: string
  book_abbrev: string
  chapter: number
  verse: number
  text: string
  note?: string
  color: string
  created_at: string
  updated_at: string
}

export interface BibleSettings {
  id: string
  user_id: string
  bible_version: 'acf' | 'nvi'
  current_book: string
  current_chapter: number
  font_size: number
  created_at: string
  updated_at: string
}

export interface BibleSearchResult {
  book_abbrev: string
  book_name: string
  chapter: number
  verse: number
  text: string
}