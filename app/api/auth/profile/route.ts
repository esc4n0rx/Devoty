// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import jwt from 'jsonwebtoken'
import type { UpdateUserData } from '@/types/user'

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

    const { data: user, error } = await supabase
      .from('users')
      .select('id, nome, email, idade, chama, avatar_url, data_criacao')
      .eq('id', auth.userId)
      .is('deleted_at', null)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        idade: user.idade,
        chama: user.chama,
        avatar_url: user.avatar_url,
        data_criacao: user.data_criacao,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
     { status: 500 }
   )
 }
}

export async function PUT(request: NextRequest) {
 try {
   const auth = await getAuthenticatedUser(request)
   if (!auth) {
     return NextResponse.json(
       { success: false, message: 'Token inválido ou expirado' },
       { status: 401 }
     )
   }

   const updateData: UpdateUserData = await request.json()

   // Validações
   if (updateData.idade && (updateData.idade < 13 || updateData.idade > 120)) {
     return NextResponse.json(
       { success: false, message: 'Idade deve estar entre 13 e 120 anos' },
       { status: 400 }
     )
   }

   if (updateData.email) {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
     if (!emailRegex.test(updateData.email)) {
       return NextResponse.json(
         { success: false, message: 'Email inválido' },
         { status: 400 }
       )
     }
   }

   const supabase = createClient()

   // Verificar se email já existe (se estiver sendo alterado)
   if (updateData.email && updateData.email !== auth.email) {
     const { data: existingUser } = await supabase
       .from('users')
       .select('id')
       .eq('email', updateData.email)
       .is('deleted_at', null)
       .single()

     if (existingUser) {
       return NextResponse.json(
         { success: false, message: 'Este email já está em uso' },
         { status: 409 }
       )
     }
   }

   // Atualizar usuário
   const { data: updatedUser, error } = await supabase
     .from('users')
     .update(updateData)
     .eq('id', auth.userId)
     .select('id, nome, email, idade, chama, avatar_url')
     .single()

   if (error) {
     console.error('Erro ao atualizar usuário:', error)
     return NextResponse.json(
       { success: false, message: 'Erro ao atualizar perfil' },
       { status: 500 }
     )
   }

   return NextResponse.json({
     success: true,
     message: 'Perfil atualizado com sucesso!',
     user: updatedUser,
   })
 } catch (error) {
   console.error('Erro ao atualizar perfil:', error)
   return NextResponse.json(
     { success: false, message: 'Erro interno do servidor' },
     { status: 500 }
   )
 }
}