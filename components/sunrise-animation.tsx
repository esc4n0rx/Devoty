"use client"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"

interface SunriseAnimationProps {
  className?: string
}

export function SunriseAnimation({ className }: SunriseAnimationProps) {
  return (
    <DotLottieReact
      src="https://lottie.host/160851ad-dedf-4562-88d0-dbbb76e367a4/5bPCGrW7fu.lottie"
      loop
      autoplay
       className={`w-40 h-40 mx-auto ${className || ""}`}
      aria-label="Sunrise animation"
    />
  )
}