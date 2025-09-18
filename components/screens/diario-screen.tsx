// components/screens/diario-screen.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Plus,
  Calendar,
  Edit3,
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
  Palette,
  PaintBucket,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  BookOpen,
  Link2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMemo, useState } from "react"
import { useDiary } from "@/hooks/use-diary"
import { useDevocionais } from "@/hooks/use-devocionais"
import { cn } from "@/lib/utils"
import type { DiaryEntry, DiaryFontStyle, DiaryTextAlignment } from "@/types/diary"
import type { Devocional } from "@/types/devocional"

type ViewMode = "list" | "new" | "view" | "edit"

type DiaryFormState = {
  title: string
  content: string
  devocional_id: string | null
  text_color: string
  background_color: string
  font_style: DiaryFontStyle
  text_alignment: DiaryTextAlignment
}

type ColorOption = {
  label: string
  value: string
}

const DEFAULT_TEXT_COLOR = "#111827"
const DEFAULT_BACKGROUND_COLOR = "#FFFFFF"
const DEFAULT_FONT_STYLE: DiaryFontStyle = "default"
const DEFAULT_TEXT_ALIGNMENT: DiaryTextAlignment = "left"

const TEXT_COLOR_OPTIONS: ColorOption[] = [
  { label: "Padrão", value: DEFAULT_TEXT_COLOR },
  { label: "Vinho", value: "#7F1D1D" },
  { label: "Verde", value: "#047857" },
  { label: "Azul", value: "#1D4ED8" },
  { label: "Roxo", value: "#6B21A8" },
  { label: "Âmbar", value: "#92400E" },
]

const BACKGROUND_COLOR_OPTIONS: ColorOption[] = [
  { label: "Branco", value: DEFAULT_BACKGROUND_COLOR },
  { label: "Creme", value: "#FEF3C7" },
  { label: "Lavanda", value: "#EDE9FE" },
  { label: "Celeste", value: "#E0F2FE" },
  { label: "Sálvia", value: "#DCFCE7" },
  { label: "Pêssego", value: "#FFEDD5" },
]

const FONT_STYLE_LABELS: Record<DiaryFontStyle, string> = {
  default: "Moderna",
  serif: "Clássica",
  handwriting: "Manuscrita",
}

const FONT_STYLE_FAMILIES: Record<DiaryFontStyle, string> = {
  default: "var(--font-sans, 'Inter', system-ui, sans-serif)",
  serif: "'Merriweather', 'Georgia', serif",
  handwriting: "'Pacifico', 'Handlee', 'Comic Sans MS', cursive",
}

const FONT_STYLE_OPTIONS = (
  Object.keys(FONT_STYLE_LABELS) as DiaryFontStyle[]
).map((value) => ({
  value,
  label: FONT_STYLE_LABELS[value],
}))

const TEXT_ALIGNMENT_OPTIONS: Array<{
  value: DiaryTextAlignment
  label: string
  icon: LucideIcon
}> = [
  { value: "left", label: "Esquerda", icon: AlignLeft },
  { value: "center", label: "Centralizado", icon: AlignCenter },
  { value: "right", label: "Direita", icon: AlignRight },
  { value: "justify", label: "Justificado", icon: AlignJustify },
]

const TEXT_ALIGNMENT_LABELS: Record<DiaryTextAlignment, string> = {
  left: "Esquerda",
  center: "Centralizado",
  right: "Direita",
  justify: "Justificado",
}

const TEXT_ALIGNMENT_CLASSES: Record<DiaryTextAlignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
}

const createDefaultFormState = (): DiaryFormState => ({
  title: "",
  content: "",
  devocional_id: null,
  text_color: DEFAULT_TEXT_COLOR,
  background_color: DEFAULT_BACKGROUND_COLOR,
  font_style: DEFAULT_FONT_STYLE,
  text_alignment: DEFAULT_TEXT_ALIGNMENT,
})

const normalizeColor = (color: string) => color.trim().toUpperCase()

const isDefaultTextColor = (color: string) =>
  normalizeColor(color) === DEFAULT_TEXT_COLOR

const isDefaultBackground = (color: string) =>
  normalizeColor(color) === DEFAULT_BACKGROUND_COLOR

export function DiarioScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [formData, setFormData] = useState<DiaryFormState>(createDefaultFormState())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<DiaryEntry | null>(null)

  const { entries, loading, actionLoading, createEntry, updateEntry, deleteEntry } = useDiary()
  const { devocionais, loading: devocionaisLoading } = useDevocionais()

  const devotionalMap = useMemo(() => {
    const map = new Map<string, Devocional>()
    devocionais.forEach((dev) => {
      map.set(dev.id, dev)
    })
    return map
  }, [devocionais])

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
    setFormData(createDefaultFormState())
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
      content: entry.content,
      devocional_id: entry.devocional_id || null,
      text_color: entry.text_color ? normalizeColor(entry.text_color) : DEFAULT_TEXT_COLOR,
      background_color: entry.background_color
        ? normalizeColor(entry.background_color)
        : DEFAULT_BACKGROUND_COLOR,
      font_style: entry.font_style || DEFAULT_FONT_STYLE,
      text_alignment: entry.text_alignment || DEFAULT_TEXT_ALIGNMENT,
    })
    setViewMode("edit")
  }

  const handleSaveNew = async () => {
    if (!formData.content.trim()) return

    const success = await createEntry({
      title: formData.title.trim() || undefined,
      content: formData.content.trim(),
      devocional_id: formData.devocional_id,
      text_color: isDefaultTextColor(formData.text_color) ? null : normalizeColor(formData.text_color),
      background_color: isDefaultBackground(formData.background_color)
        ? null
        : normalizeColor(formData.background_color),
      font_style: formData.font_style === DEFAULT_FONT_STYLE ? null : formData.font_style,
      text_alignment:
        formData.text_alignment === DEFAULT_TEXT_ALIGNMENT ? null : formData.text_alignment,
    })

    if (success) {
      resetForm()
      setViewMode("list")
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedEntry || !formData.content.trim()) return

    const success = await updateEntry(selectedEntry.id, {
      title: formData.title.trim() || null,
      content: formData.content.trim(),
      devocional_id: formData.devocional_id,
      text_color: isDefaultTextColor(formData.text_color) ? null : normalizeColor(formData.text_color),
      background_color: isDefaultBackground(formData.background_color)
        ? null
        : normalizeColor(formData.background_color),
      font_style: formData.font_style === DEFAULT_FONT_STYLE ? null : formData.font_style,
      text_alignment:
        formData.text_alignment === DEFAULT_TEXT_ALIGNMENT ? null : formData.text_alignment,
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

  const handleResetPersonalization = () => {
    setFormData((prev) => ({
      ...prev,
      text_color: DEFAULT_TEXT_COLOR,
      background_color: DEFAULT_BACKGROUND_COLOR,
      font_style: DEFAULT_FONT_STYLE,
      text_alignment: DEFAULT_TEXT_ALIGNMENT,
    }))
  }

  const renderEntryForm = (mode: "new" | "edit") => {
    const isEdit = mode === "edit"
    const handleSave = isEdit ? handleSaveEdit : handleSaveNew
    const saveLabel = isEdit ? "Salvar Alterações" : "Salvar"
    const dateLabel =
      isEdit && selectedEntry
        ? formatFullDate(selectedEntry.created_at)
        : new Date().toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
    const selectedDevotional = formData.devocional_id
      ? devotionalMap.get(formData.devocional_id)
      : null
    const currentTextColor = normalizeColor(formData.text_color)
    const currentBackground = normalizeColor(formData.background_color)
    const hasCustomBackground = !isDefaultBackground(formData.background_color)
    const personalizationIsDefault =
      isDefaultTextColor(formData.text_color) &&
      isDefaultBackground(formData.background_color) &&
      formData.font_style === DEFAULT_FONT_STYLE &&
      formData.text_alignment === DEFAULT_TEXT_ALIGNMENT
    const alignmentConfig =
      TEXT_ALIGNMENT_OPTIONS.find((item) => item.value === formData.text_alignment) ||
      TEXT_ALIGNMENT_OPTIONS[0]
    const AlignmentIcon = alignmentConfig.icon

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
            onClick={handleSave}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={!formData.content.trim() || actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saveLabel}
          </Button>
        </div>

        <Card
          className={cn(
            "border-border shadow-lg transition-colors",
            hasCustomBackground ? undefined : "bg-card"
          )}
          style={hasCustomBackground ? { backgroundColor: currentBackground } : undefined}
        >
          <CardHeader>
            <Input
              placeholder="Título da entrada (opcional)"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="text-lg font-semibold border-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground"
              style={{
                color: currentTextColor,
                fontFamily: FONT_STYLE_FAMILIES[formData.font_style],
              }}
              disabled={actionLoading}
              maxLength={200}
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{dateLabel}</span>
              {isEdit && <span className="text-xs">• Editando</span>}
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Escreva suas reflexões, orações e pensamentos..."
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              className="min-h-[300px] border-none p-0 focus-visible:ring-0 resize-none text-base leading-relaxed"
              style={{
                color: currentTextColor,
                backgroundColor: hasCustomBackground ? currentBackground : "transparent",
                fontFamily: FONT_STYLE_FAMILIES[formData.font_style],
                textAlign: formData.text_alignment,
              }}
              disabled={actionLoading}
              maxLength={5000}
            />
            <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
              <span>{formData.content.length}/5000 caracteres</span>
              {formData.title.length > 0 && (
                <span>{formData.title.length}/200 caracteres no título</span>
              )}
            </div>

            <div className="mt-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Link2 className="h-4 w-4" />
                    <span>Vincular a uma devocional</span>
                  </div>
                  {selectedDevotional && (
                    <Badge variant="outline" className="gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span className="text-xs font-medium">
                        {selectedDevotional.titulo}
                      </span>
                    </Badge>
                  )}
                </div>
                <Select
                  value={formData.devocional_id ?? "none"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      devocional_id: value === "none" ? null : value,
                    }))
                  }
                  disabled={actionLoading || devocionaisLoading}
                >
                  <SelectTrigger className="w-full md:w-[320px]">
                    <SelectValue
                      placeholder={
                        devocionaisLoading
                          ? "Carregando devocionais..."
                          : "Sem devocional vinculada"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem devocional vinculada</SelectItem>
                    {devocionais.length > 0 ? (
                      devocionais.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id}>
                          {dev.titulo}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        Nenhuma devocional disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {!devocionaisLoading && devocionais.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Você ainda não possui devocionais geradas. Gere uma devocional para
                    vincular suas anotações.
                  </p>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Palette className="h-4 w-4" />
                      <span>Cor do texto</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{currentTextColor}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {TEXT_COLOR_OPTIONS.map((option) => {
                      const normalized = normalizeColor(option.value)
                      const isActive = normalized === currentTextColor
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              text_color: normalized,
                            }))
                          }
                          className={cn(
                            "h-9 w-9 rounded-full border-2 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2",
                            isActive ? "border-accent" : "border-transparent"
                          )}
                          style={{ backgroundColor: option.value }}
                          aria-label={`Cor ${option.label}`}
                          title={option.label}
                          disabled={actionLoading}
                        />
                      )
                    })}
                    <input
                      type="color"
                      value={currentTextColor}
                      onChange={(event) => {
                        const value = normalizeColor(event.target.value)
                        setFormData((prev) => ({
                          ...prev,
                          text_color: value,
                        }))
                      }}
                      className="h-9 w-9 cursor-pointer rounded-md border border-border bg-transparent p-1"
                      aria-label="Selecionar cor personalizada para o texto"
                      disabled={actionLoading}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <PaintBucket className="h-4 w-4" />
                      <span>Cor de fundo</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{currentBackground}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {BACKGROUND_COLOR_OPTIONS.map((option) => {
                      const normalized = normalizeColor(option.value)
                      const isActive = normalized === currentBackground
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              background_color: normalized,
                            }))
                          }
                          className={cn(
                            "h-9 w-9 rounded-md border-2 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2",
                            isActive ? "border-accent" : "border-transparent"
                          )}
                          style={{ backgroundColor: option.value }}
                          aria-label={`Fundo ${option.label}`}
                          title={option.label}
                          disabled={actionLoading}
                        />
                      )
                    })}
                    <input
                      type="color"
                      value={currentBackground}
                      onChange={(event) => {
                        const value = normalizeColor(event.target.value)
                        setFormData((prev) => ({
                          ...prev,
                          background_color: value,
                        }))
                      }}
                      className="h-9 w-9 cursor-pointer rounded-md border border-border bg-transparent p-1"
                      aria-label="Selecionar cor personalizada para o fundo"
                      disabled={actionLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Type className="h-4 w-4" />
                    <span>Estilo da fonte</span>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={formData.font_style}
                    onValueChange={(value) => {
                      if (!value) return
                      setFormData((prev) => ({
                        ...prev,
                        font_style: value as DiaryFontStyle,
                      }))
                    }}
                    variant="outline"
                  >
                    {FONT_STYLE_OPTIONS.map((option) => (
                      <ToggleGroupItem
                        key={option.value}
                        value={option.value}
                        className="flex h-12 w-[90px] flex-col items-center justify-center gap-1"
                        disabled={actionLoading}
                      >
                        <span
                          className="text-base"
                          style={{ fontFamily: FONT_STYLE_FAMILIES[option.value] }}
                        >
                          Aa
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {option.label}
                        </span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlignmentIcon className="h-4 w-4" />
                    <span>Alinhamento do texto</span>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={formData.text_alignment}
                    onValueChange={(value) => {
                      if (!value) return
                      setFormData((prev) => ({
                        ...prev,
                        text_alignment: value as DiaryTextAlignment,
                      }))
                    }}
                    variant="outline"
                  >
                    {TEXT_ALIGNMENT_OPTIONS.map((option) => (
                      <ToggleGroupItem
                        key={option.value}
                        value={option.value}
                        aria-label={option.label}
                        title={option.label}
                        className="flex h-10 w-14 items-center justify-center"
                        disabled={actionLoading}
                      >
                        <option.icon className="h-4 w-4" />
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-dashed border-border/60 bg-muted/5 p-3 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Palette className="h-3 w-3" />
                    <span style={{ color: currentTextColor }}>Texto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PaintBucket className="h-3 w-3" />
                    <span
                      className="inline-flex h-3 w-6 rounded-sm border"
                      style={{ backgroundColor: currentBackground }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Type className="h-3 w-3" />
                    <span>{FONT_STYLE_LABELS[formData.font_style]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlignmentIcon className="h-3 w-3" />
                    <span>{TEXT_ALIGNMENT_LABELS[formData.text_alignment]}</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetPersonalization}
                  disabled={personalizationIsDefault || actionLoading}
                >
                  Restaurar personalização
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
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
    const entryTextColor = selectedEntry.text_color
      ? normalizeColor(selectedEntry.text_color)
      : DEFAULT_TEXT_COLOR
    const entryBackground = selectedEntry.background_color
      ? normalizeColor(selectedEntry.background_color)
      : DEFAULT_BACKGROUND_COLOR
    const entryFontStyle = selectedEntry.font_style || DEFAULT_FONT_STYLE
    const entryAlignment = selectedEntry.text_alignment || DEFAULT_TEXT_ALIGNMENT
    const entryDevotional = selectedEntry.devocional_id
      ? devotionalMap.get(selectedEntry.devocional_id)
      : null
    const entryHasCustomBackground = !isDefaultBackground(entryBackground)
    const alignmentConfig =
      TEXT_ALIGNMENT_OPTIONS.find((item) => item.value === entryAlignment) ||
      TEXT_ALIGNMENT_OPTIONS[0]
    const AlignmentIcon = alignmentConfig.icon

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

        <Card
          className={cn(
            "border-border shadow-lg transition-colors",
            entryHasCustomBackground ? undefined : "bg-card"
          )}
          style={entryHasCustomBackground ? { backgroundColor: entryBackground } : undefined}
        >
          <CardHeader className="pb-4 space-y-4">
            {selectedEntry.title && (
              <h3
                className="text-lg font-semibold text-foreground"
                style={{
                  color: entryTextColor,
                  fontFamily: FONT_STYLE_FAMILIES[entryFontStyle],
                }}
              >
                {selectedEntry.title}
              </h3>
            )}
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatFullDate(selectedEntry.created_at)}</span>
              {selectedEntry.updated_at !== selectedEntry.created_at && (
                <span className="text-xs">• Editada</span>
              )}
            </div>
            {entryDevotional && (
              <Badge variant="outline" className="gap-1 w-fit text-xs">
                <BookOpen className="h-3 w-3" />
                <span className="font-medium">{entryDevotional.titulo}</span>
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <p
              className={cn(
                "leading-relaxed whitespace-pre-wrap",
                TEXT_ALIGNMENT_CLASSES[entryAlignment]
              )}
              style={{
                color: entryTextColor,
                fontFamily: FONT_STYLE_FAMILIES[entryFontStyle],
              }}
            >
              {selectedEntry.content}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                <Palette className="h-3 w-3" style={{ color: entryTextColor }} />
                Texto
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2 px-2 py-1">
                <PaintBucket className="h-3 w-3" />
                <span
                  className="inline-flex h-3 w-6 rounded-sm border"
                  style={{ backgroundColor: entryBackground }}
                />
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                <Type className="h-3 w-3" />
                {FONT_STYLE_LABELS[entryFontStyle]}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                <AlignmentIcon className="h-3 w-3" />
                {TEXT_ALIGNMENT_LABELS[entryAlignment]}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Criar nova entrada
  if (viewMode === "new") {
    return renderEntryForm("new")
  }

  // Editar entrada
  if (viewMode === "edit" && selectedEntry) {
    return renderEntryForm("edit")
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
            {entries.map((entry, index) => {
              const entryTextColor = entry.text_color
                ? normalizeColor(entry.text_color)
                : DEFAULT_TEXT_COLOR
              const entryBackground = entry.background_color
                ? normalizeColor(entry.background_color)
                : DEFAULT_BACKGROUND_COLOR
              const entryFontStyle = entry.font_style || DEFAULT_FONT_STYLE
              const entryAlignment = entry.text_alignment || DEFAULT_TEXT_ALIGNMENT
              const entryDevotional = entry.devocional_id
                ? devotionalMap.get(entry.devocional_id)
                : null
              const entryHasCustomBackground = !isDefaultBackground(entryBackground)
              const alignmentConfig =
                TEXT_ALIGNMENT_OPTIONS.find((item) => item.value === entryAlignment) ||
                TEXT_ALIGNMENT_OPTIONS[0]
              const AlignmentIcon = alignmentConfig.icon

              return (
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
                    className={cn(
                      "border-border cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg group",
                      entryHasCustomBackground ? undefined : "bg-card hover:bg-secondary/20"
                    )}
                    style={entryHasCustomBackground ? { backgroundColor: entryBackground } : undefined}
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
                            <h3
                              className="font-medium mb-1 truncate"
                              style={{
                                color: entryTextColor,
                                fontFamily: FONT_STYLE_FAMILIES[entryFontStyle],
                              }}
                            >
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
                    <CardContent className="pt-0 space-y-3">
                      <motion.p
                        className={cn(
                          "leading-relaxed",
                          TEXT_ALIGNMENT_CLASSES[entryAlignment]
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
                        style={{
                          color: entryTextColor,
                          fontFamily: FONT_STYLE_FAMILIES[entryFontStyle],
                        }}
                      >
                        {getPreview(entry.content)}
                      </motion.p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Palette className="h-3 w-3" />
                          <span
                            className="inline-flex h-3 w-3 rounded-full border"
                            style={{ backgroundColor: entryTextColor }}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <PaintBucket className="h-3 w-3" />
                          <span
                            className="inline-flex h-3 w-6 rounded-sm border"
                            style={{ backgroundColor: entryBackground }}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Type className="h-3 w-3" />
                          <span>{FONT_STYLE_LABELS[entryFontStyle]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlignmentIcon className="h-3 w-3" />
                          <span>{TEXT_ALIGNMENT_LABELS[entryAlignment]}</span>
                        </div>
                        {entryDevotional && (
                          <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5">
                            <BookOpen className="h-3 w-3" />
                            {entryDevotional.titulo}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
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