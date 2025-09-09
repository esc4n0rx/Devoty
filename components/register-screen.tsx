"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Mail, Phone, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface RegisterScreenProps {
  onBack: () => void
  onComplete: () => void
}

type RegisterStep = "email" | "details"

export function RegisterScreen({ onBack, onComplete }: RegisterScreenProps) {
  const [step, setStep] = useState<RegisterStep>("email")
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    age: "",
    acceptedTerms: false,
  })

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.email && formData.acceptedTerms) {
      setStep("details")
    }
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.password && formData.age) {
      console.log("Registration completed:", formData)
      onComplete()
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // TODO: Implement social login
  }

  if (step === "email") {
    return (
      <motion.div
        className="min-h-screen bg-background flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
          <h1 className="text-lg font-semibold">Criar conta</h1>
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
              <h2 className="text-2xl font-bold text-foreground">Bem-vindo ao Devoty</h2>
              <p className="text-muted-foreground">Comece sua jornada espiritual hoje</p>
            </motion.div>

            <motion.form
              onSubmit={handleEmailSubmit}
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
                    className="transition-all duration-300 focus:shadow-lg"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-3"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Checkbox
                    id="terms"
                    checked={formData.acceptedTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, acceptedTerms: checked as boolean })}
                  />
                </motion.div>
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                  Aceito os{" "}
                  <button type="button" className="text-accent hover:underline transition-colors duration-200">
                    termos de uso
                  </button>{" "}
                  e{" "}
                  <button type="button" className="text-accent hover:underline transition-colors duration-200">
                    política de privacidade
                  </button>
                </label>
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
                  disabled={!formData.email || !formData.acceptedTerms}
                >
                  Continuar
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">ou continue com</span>
              </div>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              {[
                { provider: "Google", icon: Mail, color: "text-foreground" },
                { provider: "Facebook", icon: null, color: "text-foreground" },
                { provider: "Phone", icon: Phone, color: "text-foreground" },
              ].map((social, index) => (
                <motion.div
                  key={social.provider}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 text-base font-medium bg-transparent hover:bg-secondary/20 transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={() => handleSocialLogin(social.provider)}
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

  return (
    <motion.div
      className="min-h-screen bg-background flex flex-col"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <motion.div
        className="flex items-center justify-between p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" onClick={() => setStep("email")} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </motion.div>
        <h1 className="text-lg font-semibold">Finalizar cadastro</h1>
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
            <h2 className="text-2xl font-bold text-foreground">Quase lá!</h2>
            <p className="text-muted-foreground">Precisamos de mais algumas informações</p>
          </motion.div>

          <motion.form
            onSubmit={handleDetailsSubmit}
            className="space-y-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              {
                id: "name",
                label: "Nome completo",
                type: "text",
                placeholder: "Seu nome",
                value: formData.name,
                key: "name",
              },
              {
                id: "password",
                label: "Senha",
                type: "password",
                placeholder: "Crie uma senha segura",
                value: formData.password,
                key: "password",
              },
              { id: "age", label: "Idade", type: "number", placeholder: "Sua idade", value: formData.age, key: "age" },
            ].map((field, index) => (
              <motion.div
                key={field.id}
                className="space-y-2"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <label htmlFor={field.id} className="text-sm font-medium text-foreground">
                  {field.label}
                </label>
                <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    required
                    {...(field.type === "number" && { min: "13", max: "120" })}
                    className="transition-all duration-300 focus:shadow-lg"
                  />
                </motion.div>
              </motion.div>
            ))}

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
                disabled={!formData.name || !formData.password || !formData.age}
              >
                <motion.span className="flex items-center gap-2">
                  Criar conta
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </motion.div>
                </motion.span>
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  )
}
