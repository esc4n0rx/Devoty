// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { LoginCredentials } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginCredentials = await request.json()

    // Validações básicas
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Buscar usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('id, nome, email, senha_hash, chama, avatar_url')
      .eq('email', email)
      .is('deleted_at', null)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.senha_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Gerar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Configurar cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        chama: user.chama,
        avatar_url: user.avatar_url,
      },
      token,
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}