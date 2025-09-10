// app/api/bible/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import jwt from 'jsonwebtoken'

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    const supabase = createClient()

    const { data: bookmarks, error } = await supabase
      .from('bible_bookmarks')
      .select('*')
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar marcações' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      bookmarks: bookmarks || []
    })
  } catch (error) {
    console.error('Error in bookmarks GET:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    const { book_abbrev, chapter, verse, text, note, color } = await request.json()

    if (!book_abbrev || !chapter || !verse || !text) {
      return NextResponse.json(
        { success: false, message: 'Dados incompletos' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Verificar se já existe uma marcação para este versículo
    const { data: existing } = await supabase
      .from('bible_bookmarks')
      .select('id')
      .eq('user_id', auth.userId)
      .eq('book_abbrev', book_abbrev)
      .eq('chapter', chapter)
      .eq('verse', verse)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Versículo já está marcado' },
       { status: 409 }
     )
   }

   const { data: bookmark, error } = await supabase
     .from('bible_bookmarks')
     .insert([{
       user_id: auth.userId,
       book_abbrev,
       chapter,
       verse,
       text,
       note,
       color: color || 'yellow'
     }])
     .select()
     .single()

   if (error) {
     console.error('Error creating bookmark:', error)
     return NextResponse.json(
       { success: false, message: 'Erro ao criar marcação' },
       { status: 500 }
     )
   }

   return NextResponse.json({
     success: true,
     bookmark
   })
 } catch (error) {
   console.error('Error in bookmarks POST:', error)
   return NextResponse.json(
     { success: false, message: 'Erro interno do servidor' },
     { status: 500 }
   )
 }
}

export async function DELETE(request: NextRequest) {
 try {
   const auth = await getAuthenticatedUser(request)
   if (!auth) {
     return NextResponse.json(
       { success: false, message: 'Token inválido ou expirado' },
       { status: 401 }
     )
   }

   const { searchParams } = new URL(request.url)
   const bookmarkId = searchParams.get('id')

   if (!bookmarkId) {
     return NextResponse.json(
       { success: false, message: 'ID da marcação obrigatório' },
       { status: 400 }
     )
   }

   const supabase = createClient()

   const { error } = await supabase
     .from('bible_bookmarks')
     .delete()
     .eq('id', bookmarkId)
     .eq('user_id', auth.userId)

   if (error) {
     console.error('Error deleting bookmark:', error)
     return NextResponse.json(
       { success: false, message: 'Erro ao deletar marcação' },
       { status: 500 }
     )
   }

   return NextResponse.json({
     success: true,
     message: 'Marcação removida com sucesso'
   })
 } catch (error) {
   console.error('Error in bookmarks DELETE:', error)
   return NextResponse.json(
     { success: false, message: 'Erro interno do servidor' },
     { status: 500 }
   )
 }
}