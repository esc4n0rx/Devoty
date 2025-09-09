// components/forgot-password-screen.tsx
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface ForgotPasswordScreenProps {
  onBack: () => void
}

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { forgotPassword } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const response = await forgotPassword({ email })
      if (response.success) {
        setSuccess(true)
        toast({
          title: "Email enviado!",
          description: response.message,
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao enviar email",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        className="min-h-screen bg-background flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md w-full text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle className="h-10 w-10 text-accent-foreground" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            <h2 className="text-2xl font-bold text-foreground">Email enviado!</h2>
            <p className="text-muted-foreground">
              Verifique sua caixa de entrada para instruções sobre como redefinir sua senha.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button onClick={onBack} className="w-full h-12">
              Voltar ao login
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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
        <h1 className="text-lg font-semibold">Esqueci a senha</h1>
        <div className="w-10" />
      </motion.div>

      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <motion.div
            className="text-center space-y-2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Mail className="h-16 w-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground">Recuperar senha</h2>
            <p className="text-muted-foreground">
              Digite seu email e enviaremos instruções para redefinir sua senha
            </p>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="transition-all duration-300 focus:shadow-lg"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!email || loading}
              >
                {loading ? "Enviando..." : "Enviar instruções"}
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  )
}