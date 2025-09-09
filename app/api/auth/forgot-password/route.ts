// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ForgotPasswordData } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const { email }: ForgotPasswordData = await request.json()

    // Validações básicas
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Verificar se usuário existe
    const { data: user } = await supabase
      .from('users')
      .select('id, nome')
      .eq('email', email)
      .is('deleted_at', null)
      .single()

    // Sempre retornar sucesso por segurança (não revelar se email existe)
    // TODO: Implementar envio de email quando domínio estiver configurado
    console.log('Solicitação de reset de senha para:', email, user ? `(usuário: ${user.nome})` : '(email não encontrado)')

    return NextResponse.json({
      success: true,
      message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.',
    })
  } catch (error) {
    console.error('Erro no forgot password:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}