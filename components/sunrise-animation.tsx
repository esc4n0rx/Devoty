"use client"

import { useEffect, useRef } from "react"

interface SunriseAnimationProps {
  className?: string
}

export function SunriseAnimation({ className }: SunriseAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Lottie animation
    const loadLottie = async () => {
      try {
        const lottie = await import("lottie-web")

        if (containerRef.current) {
          lottie.default.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "https://lottie.host/4d5c8b5e-8b5a-4b5a-9b5a-8b5a4b5a8b5a/sunrise.json",
          })
        }
      } catch (error) {
        console.log("Lottie animation failed to load, using fallback")
        // Fallback: Simple CSS animation
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="w-24 h-24 bg-gradient-to-t from-accent to-yellow-300 rounded-full animate-pulse mx-auto"></div>
          `
        }
      }
    }

    loadLottie()
  }, [])

  return <div ref={containerRef} className={`w-32 h-32 mx-auto ${className}`} aria-label="Sunrise animation" />
}
