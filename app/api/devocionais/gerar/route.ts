// app/api/devocionais/gerar/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gerarDevocionalIA } from '@/lib/groq'
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

function isToday(date: string): boolean {
  const today = new Date()
  const checkDate = new Date(date)
  
  return today.getFullYear() === checkDate.getFullYear() &&
         today.getMonth() === checkDate.getMonth() &&
         today.getDate() === checkDate.getDate()
}

function getNextMidnight(): Date {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow
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

    const supabase = createClient()

    // Verificar se já gerou devocional hoje
    const { data: devocionalHoje, error: errorVerificacao } = await supabase
      .from('devocionais')
      .select('id, data_criacao')
      .eq('user_id', auth.userId)
      .gte('data_criacao', new Date().toISOString().split('T')[0]) // Desde hoje 00:00
      .order('data_criacao', { ascending: false })
      .limit(1)
      .single()

    if (devocionalHoje && isToday(devocionalHoje.data_criacao)) {
      const nextMidnight = getNextMidnight()
      const hoursUntilNext = Math.ceil((nextMidnight.getTime() - Date.now()) / (1000 * 60 * 60))
      
      return NextResponse.json({
        success: false,
        message: `Você já gerou sua devocional de hoje! A próxima estará disponível em ${hoursUntilNext}h.`,
        nextAvailable: nextMidnight.toISOString(),
        dailyLimitReached: true
      }, { status: 429 })
    }

    // Buscar último versículo usado para evitar repetição
    const { data: ultimaDevocional } = await supabase
      .from('devocionais')
      .select('versiculo_base')
      .eq('user_id', auth.userId)
      .order('data_criacao', { ascending: false })
      .limit(1)
      .single()

    // Gerar nova devocional com IA
    const devocionalIA = await gerarDevocionalIA(ultimaDevocional?.versiculo_base)

    // Salvar no banco
    const { data: novaDevocional, error } = await supabase
      .from('devocionais')
      .insert([
        {
          user_id: auth.userId,
          titulo: devocionalIA.titulo,
          versiculo_base: devocionalIA.versiculo_base,
          passagem_biblica: devocionalIA.passagem_biblica,
          conteudo: devocionalIA.conteudo,
          oracao: devocionalIA.oracao,
          concluida: false,
          favoritada: false,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar devocional:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao salvar devocional' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Devocional de hoje gerada com sucesso!',
      devocional: novaDevocional,
      nextAvailable: getNextMidnight().toISOString()
    })
  } catch (error) {
    console.error('Erro ao gerar devocional:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}