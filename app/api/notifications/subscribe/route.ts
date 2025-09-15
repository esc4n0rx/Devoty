// app/api/notifications/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import jwt from 'jsonwebtoken'
import type { SupabaseClient } from '@supabase/supabase-js'

type AuthenticatedUser = { userId: string; email: string }

type PushSubscriptionPayload = {
  endpoint: string
  expirationTime?: number | null
  keys?: {
    p256dh?: string
    auth?: string
  }
}

const SUBSCRIPTIONS_TABLE = 'notification_subscriptions'

async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return null
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedUser
  } catch {
    return null
  }
}

async function upsertSubscription(
  supabase: SupabaseClient<any, any, any>,
  userId: string,
  subscription: PushSubscriptionPayload,
  userAgent: string | null
) {
  const sanitizedSubscription = {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime ?? null,
    keys: subscription.keys ?? null,
  }

  const { data: existingRows, error: existingError } = await supabase
    .from(SUBSCRIPTIONS_TABLE)
    .select('id')
    .eq('user_id', userId)
    .eq('endpoint', subscription.endpoint)
    .limit(1)

  if (existingError) {
    throw existingError
  }

  const existing = existingRows?.[0]

  const payload: Record<string, unknown> = {
    user_id: userId,
    endpoint: subscription.endpoint,
    subscription: sanitizedSubscription,
    updated_at: new Date().toISOString(),
  }

  if (userAgent) {
    payload.user_agent = userAgent
  }

  if (existing?.id) {
    payload.id = existing.id
  }

  const { error } = await supabase
    .from(SUBSCRIPTIONS_TABLE)
    .upsert(payload)

  if (error) {
    throw error
  }
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

    const body = await request.json().catch(() => null)
    const subscription = body?.subscription as PushSubscriptionPayload | undefined

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { success: false, message: 'Assinatura de push inválida' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    const userAgent = request.headers.get('user-agent')

    try {
      await upsertSubscription(supabase, auth.userId, subscription, userAgent)
    } catch (error: any) {
      console.error('Erro ao salvar assinatura de push:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao registrar dispositivo para notificações' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Dispositivo registrado para notificações',
    })
  } catch (error) {
    console.error('Erro no endpoint de inscrição em notificações:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
