// app/api/devocionais/route.ts
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

    const { searchParams } = new URL(request.url)
    const historico = searchParams.get('historico')

    const supabase = createClient()

    if (historico === 'true') {
      // Buscar todas as devocionais do usuário (histórico)
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
        devocionais: devocionais || [],
      })
    } else {
      // Buscar devocional do dia (hoje)
      const hoje = new Date().toISOString().split('T')[0]
      
      const { data: devocionalDoDia, error } = await supabase
        .from('devocionais')
        .select('*')
        .eq('user_id', auth.userId)
        .gte('data_criacao', `${hoje}T00:00:00.000Z`)
        .lte('data_criacao', `${hoje}T23:59:59.999Z`)
        .order('data_criacao', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Erro ao buscar devocional do dia:', error)
        return NextResponse.json(
          { success: false, message: 'Erro ao buscar devocional do dia' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        devocional: devocionalDoDia || null,
      })
    }
  } catch (error) {
    console.error('Erro na API de devocionais:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}