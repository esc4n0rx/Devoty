// app/api/bible/settings/route.ts
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

    const { data: settings, error } = await supabase
      .from('bible_settings')
      .select('*')
      .eq('user_id', auth.userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar configurações' },
        { status: 500 }
      )
    }

    // Se não existir, criar configurações padrão
    if (!settings) {
      const { data: newSettings, error: createError } = await supabase
        .from('bible_settings')
        .insert([{
          user_id: auth.userId,
          bible_version: 'acf',
          current_book: 'gn',
          current_chapter: 1,
          font_size: 16
        }])
        .select()
        .single()

      if (createError) {
        console.error('Error creating settings:', createError)
        return NextResponse.json(
          { success: false, message: 'Erro ao criar configurações' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        settings: newSettings
      })
    }

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error('Error in bible settings GET:', error)
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

    const updates = await request.json()
    const supabase = createClient()

    const { data: settings, error } = await supabase
      .from('bible_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', auth.userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating settings:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar configurações' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error('Error in bible settings PUT:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}