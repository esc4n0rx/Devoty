// hooks/use-notifications.ts
"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'

type UseNotificationsReturn = {
  isSupported: boolean
  permission: NotificationPermission
  isLoading: boolean
  isSubscribed: boolean
  subscription: PushSubscription | null
  error: string | null
  registration: ServiceWorkerRegistration | null
  requestPermission: () => Promise<NotificationPermission>
  enableNotifications: () => Promise<PushSubscription | null>
  refreshSubscription: () => Promise<PushSubscription | null>
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export function useNotifications(): UseNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isLoading, setIsLoading] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [error, setError] = useState<string | null>(null)

  const vapidPublicKey = useMemo(() => process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || '', [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const supported =
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window

    setIsSupported(supported)
    setPermission(Notification.permission)

    if (!supported) {
      return
    }

    let isMounted = true

    const registerServiceWorker = async () => {
      try {
        const existingRegistration = await navigator.serviceWorker.getRegistration('/sw.js')

        if (!existingRegistration) {
          await navigator.serviceWorker.register('/sw.js')
        }

        const readyRegistration = await navigator.serviceWorker.ready

        if (!isMounted) {
          return
        }

        setRegistration(readyRegistration)

        const currentSubscription = await readyRegistration.pushManager.getSubscription()
        if (isMounted) {
          setSubscription(currentSubscription)
        }
      } catch (swError) {
        console.error('Erro ao registrar service worker para notificações:', swError)
        if (isMounted) {
          setError('Não foi possível registrar o service worker para notificações')
        }
      }
    }

    registerServiceWorker()

    return () => {
      isMounted = false
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return 'denied'
    }

    if (permission === 'denied') {
      return 'denied'
    }

    if (permission === 'granted') {
      return 'granted'
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [isSupported, permission])

  const persistSubscription = useCallback(async (subscriptionToPersist: PushSubscription) => {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ subscription: subscriptionToPersist.toJSON() }),
      })

      if (!response.ok) {
        throw new Error('Falha ao registrar dispositivo no servidor')
      }
    } catch (persistError) {
      console.error('Erro ao persistir assinatura de notificações:', persistError)
      setError('Não foi possível salvar sua inscrição para notificações')
      throw persistError
    }
  }, [])

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Notificações push não são suportadas neste dispositivo')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const permissionResult = await requestPermission()

      if (permissionResult !== 'granted') {
        setError('Permissão para notificações não concedida')
        return null
      }

      const swRegistration = registration || (await navigator.serviceWorker.ready)

      let currentSubscription = await swRegistration.pushManager.getSubscription()

      if (!currentSubscription) {
        if (!vapidPublicKey) {
          throw new Error('Chave pública de push não configurada')
        }

        currentSubscription = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        })
      }

      await persistSubscription(currentSubscription)

      setSubscription(currentSubscription)
      setPermission('granted')

      return currentSubscription
    } catch (subscriptionError) {
      const message =
        subscriptionError instanceof Error
          ? subscriptionError.message
          : 'Erro ao ativar notificações'

      setError(message)
      console.error('Erro ao ativar notificações:', subscriptionError)

      return null
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, persistSubscription, registration, requestPermission, vapidPublicKey])

  return {
    isSupported,
    permission,
    isLoading,
    isSubscribed: Boolean(subscription),
    subscription,
    error,
    registration,
    requestPermission,
    enableNotifications: subscribe,
    refreshSubscription: subscribe,
  }
}
