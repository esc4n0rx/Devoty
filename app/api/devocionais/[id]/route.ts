// app/api/devocionais/[id]/route.ts
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

export async function PATCH(
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

    const { acao, favoritar } = await request.json()
    const devocionalId = params.id

    const supabase = createClient()

    if (acao === 'concluir') {
      // Verificar se já foi concluída hoje
      const { data: devocional } = await supabase
        .from('devocionais')
        .select('concluida, data_conclusao')
        .eq('id', devocionalId)
        .eq('user_id', auth.userId)
        .single()

      if (!devocional) {
        return NextResponse.json(
          { success: false, message: 'Devocional não encontrada' },
          { status: 404 }
        )
      }

      if (devocional.concluida) {
        return NextResponse.json(
          { success: false, message: 'Devocional já foi concluída' },
          { status: 400 }
        )
      }

      // Marcar como concluída
      const { error: updateError } = await supabase
        .from('devocionais')
        .update({ 
          concluida: true, 
          data_conclusao: new Date().toISOString() 
        })
        .eq('id', devocionalId)
        .eq('user_id', auth.userId)

      if (updateError) {
        console.error('Erro ao concluir devocional:', updateError)
        return NextResponse.json(
          { success: false, message: 'Erro ao concluir devocional' },
          { status: 500 }
        )
      }

      // Verificar sequência de chama
      const hoje = new Date()
      const ontem = new Date(hoje)
      ontem.setDate(hoje.getDate() - 1)
      
      const ontemStr = ontem.toISOString().split('T')[0]

      const { data: devocionalOntem } = await supabase
        .from('devocionais')
        .select('concluida')
        .eq('user_id', auth.userId)
        .gte('data_criacao', `${ontemStr}T00:00:00.000Z`)
        .lte('data_criacao', `${ontemStr}T23:59:59.999Z`)
        .single()

      // Atualizar chama do usuário
      let novaChama = 1 // Primeira conclusão ou quebrou sequência

      if (devocionalOntem?.concluida) {
        // Manter sequência - buscar chama atual e incrementar
        const { data: userData } = await supabase
          .from('users')
          .select('chama')
          .eq('id', auth.userId)
          .single()

        novaChama = (userData?.chama || 0) + 1
      }

      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ chama: novaChama })
        .eq('id', auth.userId)

      if (userUpdateError) {
        console.error('Erro ao atualizar chama:', userUpdateError)
      }

      return NextResponse.json({
        success: true,
        message: `Devocional concluída! Chama: ${novaChama} dias`,
      })

    } else if (acao === 'favoritar') {
      const { error } = await supabase
        .from('devocionais')
        .update({ favoritada: favoritar })
        .eq('id', devocionalId)
        .eq('user_id', auth.userId)

      if (error) {
        console.error('Erro ao favoritar devocional:', error)
        return NextResponse.json(
          { success: false, message: 'Erro ao favoritar devocional' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: favoritar ? 'Devocional favoritada!' : 'Devocional desfavoritada!',
      })
    }

    return NextResponse.json(
      { success: false, message: 'Ação inválida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro na operação:', error)
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

    const devocionalId = params.id
    const supabase = createClient()

    const { error } = await supabase
      .from('devocionais')
      .delete()
      .eq('id', devocionalId)
      .eq('user_id', auth.userId)

    if (error) {
      console.error('Erro ao deletar devocional:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao deletar devocional' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Devocional removida com sucesso!',
    })
  } catch (error) {
    console.error('Erro ao deletar:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}