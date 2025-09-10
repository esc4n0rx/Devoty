// components/next-devocional-countdown.tsx
"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Sunrise } from 'lucide-react'
import { motion } from 'framer-motion'

interface NextDevocionalCountdownProps {
  nextAvailable: string
}

export function NextDevocionalCountdown({ nextAvailable }: NextDevocionalCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const next = new Date(nextAvailable).getTime()
      const difference = next - now

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [nextAvailable])

  if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="bg-secondary/50 border-border shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sunrise className="h-5 w-5 text-accent" />
            </motion.div>
            <h3 className="font-semibold text-foreground">Próxima Devocional</h3>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="text-center">
              <motion.div 
                className="text-2xl font-bold text-accent"
                key={timeLeft.hours}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {timeLeft.hours.toString().padStart(2, '0')}
              </motion.div>
              <div className="text-xs text-muted-foreground">horas</div>
            </div>
            
            <div className="text-accent text-xl">:</div>
            
            <div className="text-center">
              <motion.div 
                className="text-2xl font-bold text-accent"
                key={timeLeft.minutes}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {timeLeft.minutes.toString().padStart(2, '0')}
              </motion.div>
              <div className="text-xs text-muted-foreground">min</div>
            </div>
            
            <div className="text-accent text-xl">:</div>
            
            <div className="text-center">
              <motion.div 
                className="text-2xl font-bold text-accent"
                key={timeLeft.seconds}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {timeLeft.seconds.toString().padStart(2, '0')}
              </motion.div>
              <div className="text-xs text-muted-foreground">seg</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Disponível à meia-noite</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}