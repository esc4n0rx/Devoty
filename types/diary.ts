// types/diary.ts
export interface DiaryEntry {
  id: string
  user_id: string
  title?: string
  content: string
  created_at: string
  updated_at: string
}

export interface CreateDiaryEntryData {
  title?: string
  content: string
}

export interface UpdateDiaryEntryData {
  title?: string
  content?: string
}

export interface DiaryResponse {
  success: boolean
  message: string
  entry?: DiaryEntry
  entries?: DiaryEntry[]
}