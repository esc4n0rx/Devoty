// app/api/diary/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import jwt from 'jsonwebtoken'
import type { CreateDiaryEntryData, DiaryFontStyle, DiaryTextAlignment } from '@/types/diary'

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

    const { data: entries, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar entradas do diário:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar entradas do diário' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      entries: entries || []
    })
  } catch (error) {
    console.error('Erro na API do diário:', error)
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

    const {
      title,
      content,
      devocional_id,
      text_color,
      background_color,
      font_style,
      text_alignment,
    }: CreateDiaryEntryData = await request.json()

    // Validações
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'O conteúdo da entrada é obrigatório' },
        { status: 400 }
      )
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { success: false, message: 'O conteúdo não pode exceder 5000 caracteres' },
        { status: 400 }
      )
    }

    if (title && title.length > 200) {
      return NextResponse.json(
        { success: false, message: 'O título não pode exceder 200 caracteres' },
        { status: 400 }
      )
    }

    const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
    const allowedFontStyles: DiaryFontStyle[] = ['default', 'serif', 'handwriting']
    const allowedTextAlignments: DiaryTextAlignment[] = ['left', 'center', 'right', 'justify']

    if (text_color && !hexColorRegex.test(text_color)) {
      return NextResponse.json(
        { success: false, message: 'A cor do texto deve estar no formato hexadecimal válido' },
        { status: 400 }
      )
    }

    if (background_color && !hexColorRegex.test(background_color)) {
      return NextResponse.json(
        { success: false, message: 'A cor de fundo deve estar no formato hexadecimal válido' },
        { status: 400 }
      )
    }

    if (font_style && !allowedFontStyles.includes(font_style)) {
      return NextResponse.json(
        { success: false, message: 'Estilo de fonte inválido' },
        { status: 400 }
      )
    }

    if (text_alignment && !allowedTextAlignments.includes(text_alignment)) {
      return NextResponse.json(
        { success: false, message: 'Alinhamento de texto inválido' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    if (devocional_id) {
      const { data: devotional, error: devotionalError } = await supabase
        .from('devocionais')
        .select('id')
        .eq('id', devocional_id)
        .eq('user_id', auth.userId)
        .single()

      if (devocionalError && devotionalError.code !== 'PGRST116') {
        console.error('Erro ao validar devocional vinculada:', devotionalError)
      }

      if (devocionalError || !devotional) {
        return NextResponse.json(
          { success: false, message: 'Devocional selecionada não encontrada' },
          { status: 400 }
        )
      }
    }

    const { data: newEntry, error } = await supabase
      .from('diary_entries')
      .insert([
        {
          user_id: auth.userId,
          title: title?.trim() || null,
          content: content.trim(),
          devocional_id: devocional_id || null,
          text_color: text_color || null,
          background_color: background_color || null,
          font_style: font_style || null,
          text_alignment: text_alignment || null,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar entrada do diário:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao criar entrada do diário' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Entrada criada com sucesso!',
      entry: newEntry
    })
  } catch (error) {
    console.error('Erro na API do diário:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}