// components/app-updater.tsx
"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ServiceWorkerManager } from '@/lib/service-worker'
import { useToast } from '@/hooks/use-toast'
import { RefreshCw, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function AppUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  const swManager = ServiceWorkerManager.getInstance()

  useEffect(() => {
    // Registrar service worker
    swManager.register()

    // Verificar atualizações periodicamente (a cada 30 minutos)
    const interval = setInterval(() => {
      swManager.checkForUpdates()
    }, 30 * 60 * 1000)

    // Verificar se há atualização disponível
    const checkUpdate = () => {
      if (swManager.isUpdateAvailable()) {
        setUpdateAvailable(true)
        toast({
          title: "Atualização disponível! 🚀",
          description: "Uma nova versão do app está pronta para uso.",
          duration: 0, // Não remover automaticamente
        })
      }
    }

    // Verificar imediatamente e depois periodicamente
    checkUpdate()
    const checkInterval = setInterval(checkUpdate, 5000)

    return () => {
      clearInterval(interval)
      clearInterval(checkInterval)
    }
  }, [swManager, toast])

  const handleUpdate = async () => {
    setIsUpdating(true)
    
    toast({
      title: "Atualizando app...",
      description: "Por favor, aguarde enquanto baixamos a nova versão.",
    })

    // Aplicar atualização
    swManager.applyUpdate()
  }

  if (!updateAvailable) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-50"
      >
        <div className="bg-accent text-accent-foreground rounded-lg p-4 shadow-lg border mx-auto max-w-sm">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Nova versão disponível!</h4>
              <p className="text-xs opacity-90">Toque para atualizar</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="shrink-0"
            >
              {isUpdating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}