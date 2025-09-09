"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Calendar, Edit3, ArrowLeft, Save } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const entries = [
  {
    id: 1,
    date: "Hoje",
    preview: "Hoje senti uma paz especial durante a oração matinal...",
    fullDate: "9 de Janeiro, 2025",
    content:
      "Hoje senti uma paz especial durante a oração matinal. Deus me mostrou através de Salmos 23 que Ele é meu pastor e nada me faltará. Refleti sobre como tenho me preocupado com coisas pequenas quando deveria confiar mais em Sua providência.",
  },
  {
    id: 2,
    date: "Ontem",
    preview: "Reflexão sobre Provérbios 3:5 - confiar em Deus...",
    fullDate: "8 de Janeiro, 2025",
    content:
      "Reflexão sobre Provérbios 3:5 - confiar em Deus de todo o coração. Hoje aprendi que não preciso entender todos os planos de Deus, apenas confiar. Orei pela minha família e senti uma gratidão imensa por todas as bênçãos recebidas.",
  },
  {
    id: 3,
    date: "2 dias atrás",
    preview: "Leitura de Mateus 6:26 sobre não se preocupar...",
    fullDate: "7 de Janeiro, 2025",
    content:
      "Leitura de Mateus 6:26 sobre não se preocupar. Jesus nos lembra que somos mais valiosos que os pássaros do céu. Preciso aplicar isso na minha vida diária e confiar mais na providência divina.",
  },
  {
    id: 4,
    date: "3 dias atrás",
    preview: "Momento de adoração especial durante o culto...",
    fullDate: "6 de Janeiro, 2025",
    content:
      "Momento de adoração especial durante o culto. Senti a presença de Deus de forma muito real. O pastor falou sobre perdão e isso tocou meu coração profundamente.",
  },
]

export function DiarioScreen() {
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<(typeof entries)[0] | null>(null)
  const [newEntryTitle, setNewEntryTitle] = useState("")
  const [newEntryContent, setNewEntryContent] = useState("")

  const handleSaveEntry = () => {
    console.log("Nova entrada salva:", { title: newEntryTitle, content: newEntryContent })
    setNewEntryTitle("")
    setNewEntryContent("")
    setShowNewEntry(false)
  }

  const handleViewEntry = (entry: (typeof entries)[0]) => {
    setSelectedEntry(entry)
  }

  if (selectedEntry) {
    return (
      <motion.div
        className="p-6 space-y-6"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedEntry(null)} className="hover:bg-secondary/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>{selectedEntry.fullDate}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedEntry.content}</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (showNewEntry) {
    return (
      <motion.div
        className="p-6 space-y-6"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setShowNewEntry(false)} className="hover:bg-secondary/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={handleSaveEntry}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={!newEntryContent.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>

        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <Input
              placeholder="Título da entrada (opcional)"
              value={newEntryTitle}
              onChange={(e) => setNewEntryTitle(e.target.value)}
              className="text-lg font-semibold border-none p-0 focus-visible:ring-0 placeholder:text-muted-foreground"
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
              value={newEntryContent}
              onChange={(e) => setNewEntryContent(e.target.value)}
              className="min-h-[300px] border-none p-0 focus-visible:ring-0 resize-none text-base leading-relaxed"
            />
          </CardContent>
        </Card>
      </motion.div>
    )
  }

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
          <p className="text-muted-foreground">Registre sua jornada</p>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", bounce: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setShowNewEntry(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova entrada
          </Button>
        </motion.div>
      </motion.div>

      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{entry.fullDate}</span>
                  </div>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Edit3 className="h-4 w-4 text-accent" />
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
                  {entry.preview}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
