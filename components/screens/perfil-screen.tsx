// components/screens/perfil-screen.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Settings, Award, Calendar, LogOut, Trophy, Star, Edit, ArrowLeft, Save, BookOpen, Notebook } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useDevocionais } from "@/hooks/use-devocionais"
import { useDiary } from "@/hooks/use-diary"
import { Skeleton } from "@/components/ui/skeleton"

export function PerfilScreen() {
  const [isEditing, setIsEditing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editData, setEditData] = useState({
    nome: "",
    email: "",
    idade: "",
  })

  const { user, logout, updateProfile } = useAuth()
  const { devocionais, loading: devocionaisLoading } = useDevocionais()
  const { entries, loading: diaryLoading } = useDiary()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setEditData({
        nome: user.nome,
        email: user.email,
        idade: user.idade?.toString() || "",
      })
    }
  }, [user, isEditing])

  const completedDevotionals = useMemo(() => devocionais.filter(d => d.concluida), [devocionais])

  const achievements = [
    { label: "Dias consecutivos", value: user?.chama || 0, icon: Trophy, unit: "dias" },
    { label: "Devocionais completos", value: completedDevotionals.length, icon: Star, loading: devocionaisLoading },
    { label: "Entradas no diário", value: entries.length, icon: Notebook, loading: diaryLoading },
  ]

  const handleSaveProfile = async () => {
    if (!editData.nome || !editData.email) {
      toast({ title: "Erro", description: "Nome e email são obrigatórios", variant: "destructive" })
      return
    }
    setEditLoading(true)
    try {
      const response = await updateProfile({
        nome: editData.nome,
        email: editData.email,
        idade: editData.idade ? parseInt(editData.idade) : undefined,
      })
      if (response.success) {
        toast({ title: "Perfil atualizado!", description: response.message })
        setIsEditing(false)
      }
    } catch (error) {
      toast({ title: "Erro", description: error instanceof Error ? error.message : "Erro ao atualizar perfil", variant: "destructive" })
    } finally {
      setEditLoading(false)
    }
  }

  const menuItems = [
    { icon: Calendar, label: "Histórico de leituras", color: "text-foreground", onClick: () => setShowHistory(true) },
    { icon: Settings, label: "Configurações", color: "text-foreground", onClick: () => toast({ title: "Em breve", description: "Configurações serão implementadas em breve" }) },
    { icon: LogOut, label: "Sair", color: "text-destructive", onClick: logout },
  ]

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-8 w-48 mt-4" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b border-border flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.div key={showHistory ? 'history' : 'main'} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {showHistory ? (
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <User className="h-6 w-6 text-accent" />
            )}
          </motion.div>
        </AnimatePresence>
        <h1 className="text-xl font-bold text-foreground">{showHistory ? "Histórico de Leituras" : "Meu Perfil"}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div key="history-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-3">
              {devocionaisLoading ? (
                Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
              ) : devocionais.length > 0 ? (
                devocionais.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Card className="bg-card border-border shadow-sm">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground truncate max-w-[250px]">{item.titulo}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.data_criacao).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${item.concluida ? "bg-accent" : "bg-muted"}`} title={item.concluida ? "Concluído" : "Pendente"} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Nenhum histórico encontrado</h3>
                  <p className="text-sm">Comece a ler os devocionais para ver seu progresso aqui.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="profile-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="text-center space-y-4">
                <motion.div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto shadow-lg relative" whileHover={{ scale: 1.05 }}>
                  <User className="h-12 w-12 text-accent-foreground" />
                  {!isEditing && (
                    <motion.button onClick={() => setIsEditing(true)} className="absolute bottom-0 right-0 w-8 h-8 bg-card border-2 border-background rounded-full flex items-center justify-center hover:bg-accent/20 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Edit className="h-4 w-4 text-foreground" />
                    </motion.button>
                  )}
                </motion.div>
                <div>
                  {isEditing ? (
                    <div className="space-y-3 max-w-sm mx-auto">
                      <Input value={editData.nome} onChange={(e) => setEditData({ ...editData, nome: e.target.value })} placeholder="Nome completo" className="text-center text-xl font-bold" disabled={editLoading} />
                      <Input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} placeholder="Email" type="email" className="text-center text-sm text-muted-foreground" disabled={editLoading} />
                      <Input value={editData.idade} onChange={(e) => setEditData({ ...editData, idade: e.target.value })} placeholder="Idade" type="number" className="text-center text-sm text-muted-foreground" disabled={editLoading} />
                      <div className="flex gap-2 justify-center pt-2">
                        <Button onClick={handleSaveProfile} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={editLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          {editLoading ? "Salvando..." : "Salvar"}
                        </Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" disabled={editLoading}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-foreground">{user.nome}</h1>
                      <p className="text-muted-foreground">Membro desde {new Date(user.data_criacao || user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <Card className="bg-card border-border shadow-lg">
                <CardHeader><CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2"><Award className="h-5 w-5 text-accent" />Suas Conquistas</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((ach, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ach.icon className="h-5 w-5 text-accent/80" />
                        <span className="text-foreground font-medium">{ach.label}</span>
                      </div>
                      {ach.loading ? <Skeleton className="h-6 w-12" /> : <span className="font-bold text-accent text-lg">{`${ach.value} ${ach.unit || ''}`}</span>}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Menu */}
              <div className="space-y-3 pt-4">
                {menuItems.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Button variant="ghost" onClick={item.onClick} className={`w-full h-14 justify-start text-base ${item.color}`}>
                      <item.icon className="h-5 w-5 mr-4" />
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
