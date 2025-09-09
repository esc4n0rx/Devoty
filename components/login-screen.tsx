// components/login-screen.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Mail, Phone } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface LoginScreenProps {
  onBack: () => void
  onComplete: () => void
  onForgotPassword: () => void
}

export function LoginScreen({ onBack, onComplete, onForgotPassword }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) return

    setLoading(true)
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      })

      if (response.success) {
        toast({
          title: "Login realizado!",
          description: response.message,
        })
        onComplete()
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Email ou senha incorretos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Em breve",
      description: `Login com ${provider} será implementado em breve`,
    })
  }

  return (
    <motion.div 
      className="min-h-screen bg-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </motion.div>
        <h1 className="text-lg font-semibold">Entrar</h1>
        <div className="w-10" />
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <motion.div 
            className="text-center space-y-2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Continue sua jornada espiritual</p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div 
              className="space-y-2"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                  className="transition-all duration-300 focus:shadow-lg"
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  className="transition-all duration-300 focus:shadow-lg"
                />
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.button 
                type="button" 
                onClick={onForgotPassword} 
                className="text-sm text-accent hover:underline transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Esqueceu a senha?
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!formData.email || !formData.password || loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">ou entre com</span>
            </div>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            {[
              { provider: "Google", icon: Mail },
              { provider: "Facebook", icon: null },
              { provider: "Phone", icon: Phone },
            ].map((social, index) => (
              <motion.div
                key={social.provider}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-medium bg-transparent hover:bg-secondary/20 transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => handleSocialLogin(social.provider)}
                  disabled={loading}
                >
                  {social.provider === "Facebook" ? (
                    <div className="h-5 w-5 mr-2 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                      f
                    </div>
                  ) : (
                    social.icon && <social.icon className="h-5 w-5 mr-2" />
                  )}
                  {social.provider}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}