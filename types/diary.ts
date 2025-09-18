// types/diary.ts
export type DiaryFontStyle = "default" | "serif" | "handwriting"

export type DiaryTextAlignment = "left" | "center" | "right" | "justify"

export interface DiaryEntry {
  id: string
  user_id: string
  title?: string | null
  content: string
  created_at: string
  updated_at: string
  devocional_id?: string | null
  text_color?: string | null
  background_color?: string | null
  font_style?: DiaryFontStyle | null
  text_alignment?: DiaryTextAlignment | null
}

export interface CreateDiaryEntryData {
  title?: string
  content: string
  devocional_id?: string | null
  text_color?: string | null
  background_color?: string | null
  font_style?: DiaryFontStyle | null
  text_alignment?: DiaryTextAlignment | null
}

export interface UpdateDiaryEntryData {
  title?: string | null
  content?: string
  devocional_id?: string | null
  text_color?: string | null
  background_color?: string | null
  font_style?: DiaryFontStyle | null
  text_alignment?: DiaryTextAlignment | null
}

export interface DiaryResponse {
  success: boolean
  message: string
  entry?: DiaryEntry
  entries?: DiaryEntry[]
}