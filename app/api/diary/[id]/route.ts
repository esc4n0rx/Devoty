// app/api/diary/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import jwt from 'jsonwebtoken'
import type { UpdateDiaryEntryData } from '@/types/diary'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthenticatedUser(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    const { id } = params
    const supabase = createClient()

    const { data: entry, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.userId)
      .single()

    if (error || !entry) {
      return NextResponse.json(
        { success: false, message: 'Entrada não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      entry
    })
  } catch (error) {
    console.error('Erro na API do diário:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthenticatedUser(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    const { id } = params
    const { title, content }: UpdateDiaryEntryData = await request.json()

    // Validações
    if (content !== undefined) {
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
    }

    if (title !== undefined && title.length > 200) {
      return NextResponse.json(
        { success: false, message: 'O título não pode exceder 200 caracteres' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Primeiro, verificar se a entrada existe e pertence ao usuário
    const { data: existingEntry, error: fetchError } = await supabase
      .from('diary_entries')
      .select('id')
      .eq('id', id)
      .eq('user_id', auth.userId)
      .single()

    if (fetchError || !existingEntry) {
      return NextResponse.json(
        { success: false, message: 'Entrada não encontrada' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (title !== undefined) {
      updateData.title = title?.trim() || null
    }

    if (content !== undefined) {
      updateData.content = content.trim()
    }

    const { data: updatedEntry, error: updateError } = await supabase
      .from('diary_entries')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', auth.userId)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao atualizar entrada do diário:', updateError)
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar entrada do diário' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Entrada atualizada com sucesso!',
      entry: updatedEntry
    })
  } catch (error) {
    console.error('Erro na API do diário:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthenticatedUser(request)
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    const { id } = params
    const supabase = createClient()

    // Verificar se a entrada existe e pertence ao usuário
    const { data: existingEntry, error: fetchError } = await supabase
      .from('diary_entries')
      .select('id')
      .eq('id', id)
      .eq('user_id', auth.userId)
      .single()

    if (fetchError || !existingEntry) {
      return NextResponse.json(
        { success: false, message: 'Entrada não encontrada' },
        { status: 404 }
      )
    }

    const { error: deleteError } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.userId)

    if (deleteError) {
      console.error('Erro ao excluir entrada do diário:', deleteError)
      return NextResponse.json(
        { success: false, message: 'Erro ao excluir entrada do diário' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Entrada excluída com sucesso!'
    })
  } catch (error) {
    console.error('Erro na API do diário:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}