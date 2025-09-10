// components/screens/diario-screen.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Plus, Calendar, Edit3, ArrowLeft, Save, Trash2, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useDiary } from "@/hooks/use-diary"
import type { DiaryEntry } from "@/types/diary"

type ViewMode = "list" | "new" | "view" | "edit"

export function DiarioScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<DiaryEntry | null>(null)

  const { entries, loading, actionLoading, createEntry, updateEntry, deleteEntry } = useDiary()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return "Hoje"
    } else if (diffInHours < 48) {
      return "Ontem"
    } else if (diffInHours < 72) {
      return "2 dias atrás"
    } else if (diffInHours < 96) {
      return "3 dias atrás"
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getPreview = (content: string, maxLength = 80) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const resetForm = () => {
    setFormData({ title: "", content: "" })
  }

  const handleCreateNew = () => {
    resetForm()
    setViewMode("new")
  }

  const handleViewEntry = (entry: DiaryEntry) => {
    setSelectedEntry(entry)
    setViewMode("view")
  }

  const handleEditEntry = (entry: DiaryEntry) => {
    setSelectedEntry(entry)
    setFormData({
      title: entry.title || "",
      content: entry.content
    })
    setViewMode("edit")
  }

  const handleSaveNew = async () => {
    if (!formData.content.trim()) return

    const success = await createEntry({
      title: formData.title.trim() || undefined,
      content: formData.content.trim()
    })

    if (success) {
      resetForm()
      setViewMode("list")
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedEntry || !formData.content.trim()) return

    const success = await updateEntry(selectedEntry.id, {
      title: formData.title.trim() || undefined,
      content: formData.content.trim()
    })

    if (success) {
      resetForm()
      setSelectedEntry(null)
      setViewMode("list")
    }
  }

  const handleDeleteConfirm = (entry: DiaryEntry) => {
    setEntryToDelete(entry)
    setShowDeleteDialog(true)
  }

  const handleDeleteExecute = async () => {
    if (!entryToDelete) return

    const success = await deleteEntry(entryToDelete.id)
    
    if (success) {
      setShowDeleteDialog(false)
      setEntryToDelete(null)
      if (viewMode === "view" && selectedEntry?.id === entryToDelete.id) {
        setViewMode("list")
        setSelectedEntry(null)
      }
    }
  }

  const handleBack = () => {
    resetForm()
    setSelectedEntry(null)
    setViewMode("list")
  }

  // Loading inicial
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-muted-foreground"
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando entradas...</span>
        </motion.div>
      </div>
    )
  }

  // Visualizar entrada específica
  if (viewMode === "view" && selectedEntry) {
    return (
      <motion.div
        className="p-6 space-y-6"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack} className="hover:bg-secondary/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEditEntry(selectedEntry)}
              disabled={actionLoading}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleDeleteConfirm(selectedEntry)}
              disabled={actionLoading}
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="pb-4">
            {selectedEntry.title && (
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {selectedEntry.title}
              </h3>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatFullDate(selectedEntry.created_at)}</span>
              {selectedEntry.updated_at !== selectedEntry.created_at && (
                <span className="text-xs">• Editada</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {selectedEntry.content}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Criar nova entrada
  if (viewMode === "new") {
    return (
      <motion.div
        className="p-6 space-y-6"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack} 
            className="hover:bg-secondary/20"
            disabled={actionLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={handleSaveNew}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={!formData.content.trim() || actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar
          </Button>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <Input
              placeholder="Título da entrada (opcional)"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-semibold border-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground"
              disabled={actionLoading}
              maxLength={200}
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date().toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Escreva suas reflexões, orações e pensamentos..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[300px] border-none p-0 focus-visible:ring-0 resize-none text-base leading-relaxed"
              disabled={actionLoading}
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
              <span>{formData.content.length}/5000 caracteres</span>
              {formData.title.length > 0 && (
                <span>{formData.title.length}/200 caracteres no título</span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Editar entrada
  if (viewMode === "edit" && selectedEntry) {
    return (
      <motion.div
        className="p-6 space-y-6"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack} 
            className="hover:bg-secondary/20"
            disabled={actionLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={handleSaveEdit}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={!formData.content.trim() || actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <Input
              placeholder="Título da entrada (opcional)"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="text-lg font-semibold border-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground"
              disabled={actionLoading}
              maxLength={200}
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatFullDate(selectedEntry.created_at)}</span>
              <span className="text-xs">• Editando</span>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Escreva suas reflexões, orações e pensamentos..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[300px] border-none p-0 focus-visible:ring-0 resize-none text-base leading-relaxed"
              disabled={actionLoading}
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
              <span>{formData.content.length}/5000 caracteres</span>
              {formData.title.length > 0 && (
                <span>{formData.title.length}/200 caracteres no título</span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Lista principal de entradas
  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <motion.div
        className="flex items-center justify-between"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-foreground">Diário Espiritual</h2>
          <p className="text-muted-foreground">
            {entries.length === 0 
              ? "Comece registrando sua jornada" 
              : `${entries.length} ${entries.length === 1 ? 'entrada' : 'entradas'}`
            }
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleCreateNew}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={actionLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova entrada
          </Button>
        </motion.div>
      </motion.div>

      {entries.length === 0 ? (
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma entrada ainda
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Comece a registrar suas reflexões, orações e momentos especiais com Deus.
          </p>
          <Button 
            onClick={handleCreateNew}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar primeira entrada
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.4,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="bg-card border-border cursor-pointer hover:bg-secondary/20 transition-all duration-300 shadow-md hover:shadow-lg group"
                  onClick={() => handleViewEntry(entry)}
                >
                  <CardHeader className="pb-3">
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                    >
                      <div className="flex-1">
                        {entry.title && (
                          <h3 className="font-medium text-foreground mb-1 truncate">
                            {entry.title}
                          </h3>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(entry.created_at)}</span>
                          {entry.updated_at !== entry.created_at && (
                            <span className="text-xs">• Editada</span>
                          )}
                        </div>
                      </div>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditEntry(entry)
                          }}
                          disabled={actionLoading}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="h-4 w-4 text-accent" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteConfirm(entry)
                          }}
                          disabled={actionLoading}
                          className="h-8 w-8 p-0 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <motion.p
                      className="text-foreground leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
                    >
                      {getPreview(entry.content)}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de confirmação para exclusão */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Excluir entrada"
        description="Tem certeza que deseja excluir esta entrada? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteExecute}
      />
    </div>
  )
}