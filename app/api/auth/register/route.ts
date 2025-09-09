import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { RegisterData } from '@/types/auth'

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha, idade }: RegisterData = await request.json()

    // Validações básicas
    if (!nome || !email || !senha || !idade) {
      return NextResponse.json(
        { success: false, message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (idade < 13 || idade > 120) {
      return NextResponse.json(
        { success: false, message: 'Idade deve estar entre 13 e 120 anos' },
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

    if (senha.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .is('deleted_at', null)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email já cadastrado. Faça login ou use outro email.' },
        { status: 409 }
      )
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 12)

    // Criar usuário
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          nome,
          email,
          senha_hash: senhaHash,
          idade,
          avatar_url: 'public/images/avatar.png',
          chama: 0,
        }
      ])
      .select('id, nome, email, chama, avatar_url')
      .single()

    if (error) {
      console.error('Erro ao criar usuário:', error)
      return NextResponse.json(
        { success: false, message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    // Gerar JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Configurar cookie
    const response = NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso!',
      user: newUser,
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
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}