"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Mail, Phone } from "lucide-react"

interface LoginScreenProps {
  onBack: () => void
  onComplete: () => void
}

export function LoginScreen({ onBack, onComplete }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.email && formData.password) {
      console.log("Login attempt:", formData)
      onComplete()
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // TODO: Implement social login
  }

  const handleForgotPassword = () => {
    console.log("Forgot password")
    // TODO: Implement forgot password
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Entrar</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Continue sua jornada espiritual</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={handleForgotPassword} className="text-sm text-accent hover:underline">
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={!formData.email || !formData.password}
            >
              Entrar
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">ou entre com</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-medium bg-transparent"
              onClick={() => handleSocialLogin("Google")}
            >
              <Mail className="h-5 w-5 mr-2" />
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-medium bg-transparent"
              onClick={() => handleSocialLogin("Facebook")}
            >
              <div className="h-5 w-5 mr-2 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                f
              </div>
              Facebook
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-medium bg-transparent"
              onClick={() => handleSocialLogin("Phone")}
            >
              <Phone className="h-5 w-5 mr-2" />
              Telefone
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
