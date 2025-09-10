// app/api/devocionais/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import jwt from 'jsonwebtoken'
import { getBrazilianDateForDB } from '@/lib/utils/timezone'

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
    const url = new URL(request.url)
    const historico = url.searchParams.get('historico')

    // Se for para buscar histórico, retornar todas as devocionais
    if (historico === 'true') {
      const { data: devocionais, error } = await supabase
        .from('devocionais')
        .select('*')
        .eq('user_id', auth.userId)
        .order('data_criacao', { ascending: false })

      if (error) {
        console.error('Erro ao buscar devocionais:', error)
        return NextResponse.json(
          { success: false, message: 'Erro ao buscar devocionais' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        devocionais
      })
    }

    // Buscar devocional de hoje usando timezone brasileiro
    const brazilianDateStart = getBrazilianDateForDB()
    
    const { data: devocional, error } = await supabase
      .from('devocionais')
      .select('*')
      .eq('user_id', auth.userId)
      .gte('data_criacao', brazilianDateStart)
      .order('data_criacao', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Erro ao buscar devocional do dia:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar devocional' },
        { status: 500 }
      )
    }

    if (!devocional) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma devocional encontrada para hoje',
        devocional: null,
        canGenerate: true
      })
    }

    return NextResponse.json({
      success: true,
      devocional,
      canGenerate: false
    })
  } catch (error) {
    console.error('Erro no endpoint devocional do dia:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}