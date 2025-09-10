// app/api/devocionais/hoje/route.ts
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

    // Buscar devocional de hoje (desde 00:00 de hoje)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data: devocional, error } = await supabase
      .from('devocionais')
      .select('*')
      .eq('user_id', auth.userId)
      .gte('data_criacao', today.toISOString())
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