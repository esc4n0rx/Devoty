"use client"

import { useState } from "react"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { RegisterScreen } from "@/components/register-screen"
import { LoginScreen } from "@/components/login-screen"
import { AppLayout } from "@/components/app-layout"
import { HojeScreen } from "@/components/screens/hoje-screen"
import { DevocionaisScreen } from "@/components/screens/devocionais-screen"
import { BibliaScreen } from "@/components/screens/biblia-screen"
import { DiarioScreen } from "@/components/screens/diario-screen"
import { PerfilScreen } from "@/components/screens/perfil-screen"

type Screen = "onboarding" | "register" | "login" | "app"

export default function HomePage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding")
  const [activeTab, setActiveTab] = useState("hoje")
  const [userData] = useState({
    name: "João",
    streakCount: 7,
  })

  const handleJoinUs = () => {
    setCurrentScreen("register")
  }

  const handleLogin = () => {
    setCurrentScreen("login")
  }

  const handleBack = () => {
    setCurrentScreen("onboarding")
  }

  const handleAuthComplete = () => {
    setCurrentScreen("app")
  }

  if (currentScreen === "onboarding") {
    return <OnboardingScreen onJoinUs={handleJoinUs} onLogin={handleLogin} />
  }

  if (currentScreen === "register") {
    return <RegisterScreen onBack={handleBack} onComplete={handleAuthComplete} />
  }

  if (currentScreen === "login") {
    return <LoginScreen onBack={handleBack} onComplete={handleAuthComplete} />
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
        userName={userData.name}
        streakCount={userData.streakCount}
      >
        {renderActiveScreen()}
      </AppLayout>
    )
  }

  return null
}
