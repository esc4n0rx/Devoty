// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { RegisterScreen } from "@/components/register-screen"
import { LoginScreen } from "@/components/login-screen"
import { ForgotPasswordScreen } from "@/components/forgot-password-screen"
import { AppLayout } from "@/components/app-layout"
import { HojeScreen } from "@/components/screens/hoje-screen"
import { DevocionaisScreen } from "@/components/screens/devocionais-screen"
import { BibliaScreen } from "@/components/screens/biblia-screen"
import { DiarioScreen } from "@/components/screens/diario-screen"
import { PerfilScreen } from "@/components/screens/perfil-screen"
import { useAuth } from "@/hooks/use-auth"

type Screen = "onboarding" | "register" | "login" | "forgot-password" | "app"

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding")
  const [activeTab, setActiveTab] = useState("hoje")
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        setCurrentScreen("app")
      } else {
        setCurrentScreen("onboarding")
      }
    }
  }, [user, loading])

  const handleJoinUs = () => {
    setCurrentScreen("register")
  }

  const handleLogin = () => {
    setCurrentScreen("login")
  }

  const handleBack = () => {
    setCurrentScreen("onboarding")
  }

  const handleBackToLogin = () => {
    setCurrentScreen("login")
  }

  const handleForgotPassword = () => {
    setCurrentScreen("forgot-password")
  }

  const handleAuthComplete = () => {
    setCurrentScreen("app")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (currentScreen === "onboarding") {
    return <OnboardingScreen onJoinUs={handleJoinUs} onLogin={handleLogin} />
  }

  if (currentScreen === "register") {
    return <RegisterScreen onBack={handleBack} onComplete={handleAuthComplete} onLoginRedirect={handleLogin} />
  }

  if (currentScreen === "login") {
    return (
      <LoginScreen
        onBack={handleBack}
        onComplete={handleAuthComplete}
        onForgotPassword={handleForgotPassword}
      />
    )
  }

  if (currentScreen === "forgot-password") {
    return <ForgotPasswordScreen onBack={handleBackToLogin} />
  }

  if (currentScreen === "app") {
    const renderActiveScreen = () => {
      switch (activeTab) {
        case "hoje":
          return <HojeScreen />
        case "devocionais":
          return <DevocionaisScreen />
        case "biblia":
          return <BibliaScreen />
        case "diario":
          return <DiarioScreen />
        case "perfil":
          return <PerfilScreen />
        default:
          return <HojeScreen />
      }
    }

    return (
      <AppLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userName={user?.nome}
        streakCount={user?.chama || 0}
      >
        {renderActiveScreen()}
      </AppLayout>
    )
  }

  return null
}