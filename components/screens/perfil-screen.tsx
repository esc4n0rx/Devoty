"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Settings, Award, Calendar, LogOut, Trophy, Star, Edit, ArrowLeft, Save } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const achievements = [
  { label: "Dias consecutivos", value: "7 dias", icon: Trophy },
  { label: "Devocionais completos", value: "12", icon: Star },
  { label: "Entradas no diário", value: "8", icon: Award },
]

const menuItems = [
  { icon: Settings, label: "Configurações", color: "text-foreground" },
  { icon: Calendar, label: "Histórico de leituras", color: "text-foreground" },
  { icon: LogOut, label: "Sair", color: "text-destructive" },
]

const readingHistory = [
  { date: "9 Jan 2025", devotional: "Confiança em Deus", completed: true },
  { date: "8 Jan 2025", devotional: "Paz Interior", completed: true },
  { date: "7 Jan 2025", devotional: "Gratidão Diária", completed: true },
  { date: "6 Jan 2025", devotional: "Perdão e Amor", completed: false },
  { date: "5 Jan 2025", devotional: "Esperança Renovada", completed: true },
]

export function PerfilScreen() {
  const [isEditing, setIsEditing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [userName, setUserName] = useState("João Silva")
  const [userEmail, setUserEmail] = useState("joao.silva@email.com")

  const handleSaveProfile = () => {
    console.log("Perfil salvo:", { name: userName, email: userEmail })
    setIsEditing(false)
  }

  if (showHistory) {
    return (
      <motion.div
        className="p-6 space-y-6 max-h-screen overflow-y-auto"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)} className="hover:bg-secondary/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-xl font-bold text-foreground">Histórico de Leituras</h2>
        </div>

        <div className="space-y-3">
          {readingHistory.map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{item.devotional}</h3>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${item.completed ? "bg-accent" : "bg-muted"}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <motion.div
        className="text-center space-y-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto shadow-lg relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <User className="h-10 w-10 text-accent-foreground" />
          <motion.button
            onClick={() => setIsEditing(true)}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary border-2 border-background rounded-full flex items-center justify-center hover:bg-accent transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit className="h-3 w-3 text-foreground" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-center text-xl font-bold"
              />
              <Input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="text-center text-muted-foreground"
              />
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={handleSaveProfile}
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
              <p className="text-muted-foreground">Membro desde Janeiro 2025</p>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Award className="h-5 w-5 text-accent" />
                </motion.div>
                Suas Conquistas
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.label}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/20 transition-colors duration-300"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.2 }}>
                      <Icon className="h-5 w-5 text-accent" />
                    </motion.div>
                    <span className="text-foreground">{achievement.label}</span>
                  </div>
                  <motion.span
                    className="font-bold text-accent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1, type: "spring", bounce: 0.5 }}
                  >
                    {achievement.value}
                  </motion.span>
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="space-y-3"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const handleClick = () => {
            if (item.label === "Histórico de leituras") {
              setShowHistory(true)
            } else if (item.label === "Configurações") {
              console.log("Abrir configurações")
            } else if (item.label === "Sair") {
              console.log("Fazer logout")
            }
          }

          return (
            <motion.div
              key={item.label}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                onClick={handleClick}
                className={`w-full h-12 justify-start bg-transparent hover:bg-secondary/20 transition-all duration-300 shadow-sm hover:shadow-md ${item.color}`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: item.label === "Sair" ? 0 : 5 }}
                  transition={{ duration: 0.2 }}
                  className="mr-3"
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                {item.label}
              </Button>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
