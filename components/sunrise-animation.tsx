"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"

interface SunriseAnimationProps {
  className?: string
}

export function SunriseAnimation({ className }: SunriseAnimationProps) {
  return (
    <DotLottieReact
      src="/animations/Bible.lottie"
      loop
      autoplay
      className={`w-32 h-32 mx-auto ${className || ""}`}
      aria-label="Sunrise animation"
    />
  )
}