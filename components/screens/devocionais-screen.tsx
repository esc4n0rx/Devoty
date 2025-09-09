"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, CheckCircle, Heart, ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useState } from "react"

const devocionais = [
  {
    id: 1,
    title: "Confie no Senhor de todo o seu coração",
    verse: "Provérbios 3:5-6",
    date: "Hoje",
    duration: "5 min",
    completed: false,
    preview: "A confiança é um dos pilares mais importantes da vida cristã...",
    favorited: false,
  },
  {
    id: 2,
    title: "O amor de Deus nunca falha",
    verse: "1 Coríntios 13:8",
    date: "Ontem",
    duration: "4 min",
    completed: true,
    preview: "O amor de Deus é eterno e incondicional, nunca nos abandona...",
    favorited: true,
  },
  {
    id: 3,
    title: "Paz que excede todo entendimento",
    verse: "Filipenses 4:7",
    date: "2 dias atrás",
    duration: "6 min",
    completed: true,
    preview: "A paz de Deus guarda nossos corações e mentes em Cristo...",
    favorited: false,
  },
  {
    id: 4,
    title: "Força na fraqueza",
    verse: "2 Coríntios 12:9",
    date: "3 dias atrás",
    duration: "5 min",
    completed: true,
    preview: "Quando somos fracos, então é que somos fortes no Senhor...",
    favorited: true,
  },
  {
    id: 5,
    title: "Esperança que não decepciona",
    verse: "Romanos 5:5",
    date: "4 dias atrás",
    duration: "4 min",
    completed: false,
    preview: "Nossa esperança está firmada no amor de Deus derramado...",
    favorited: false,
  },
  {
    id: 6,
    title: "Alegria do Senhor é nossa força",
    verse: "Neemias 8:10",
    date: "5 dias atrás",
    duration: "6 min",
    completed: true,
    preview: "A alegria que vem do Senhor nos fortalece para cada dia...",
    favorited: false,
  },
]

export function DevocionaisScreen() {
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState<number[]>([2, 4])
  const [selectedDevocional, setSelectedDevocional] = useState<number | null>(null)

  const filteredDevocionais = devocionais.filter(
    (dev) =>
      dev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.verse.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  if (selectedDevocional) {
    const devocional = devocionais.find((d) => d.id === selectedDevocional)
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDevocional(null)}
            className="p-2 hover:bg-accent/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Devocional</h1>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground mb-2">{devocional?.title}</CardTitle>
              <p className="text-accent font-medium">{devocional?.verse}</p>
              <p className="text-sm text-muted-foreground">{devocional?.date}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-foreground leading-relaxed text-center italic">{devocional?.preview}</p>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground">Conteúdo completo do devocional seria carregado aqui...</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <motion.div
        className="text-center space-y-2"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-xl font-bold text-foreground">Seus Devocionais</h2>
        <p className="text-muted-foreground">Sua jornada espiritual diária</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar devocionais..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-secondary/50 border-border"
        />
      </motion.div>

      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {filteredDevocionais.map((devocional, index) => (
          <motion.div
            key={devocional.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`bg-card border-border cursor-pointer hover:bg-secondary/20 transition-all duration-300 shadow-md hover:shadow-lg ${
                devocional.completed ? "opacity-75" : ""
              }`}
              onClick={() => setSelectedDevocional(devocional.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-foreground mb-1">{devocional.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">{devocional.verse}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{devocional.preview}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(devocional.id)
                      }}
                      className="p-1 hover:bg-accent/10 rounded-full transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          favorites.includes(devocional.id) ? "text-red-500 fill-red-500" : "text-muted-foreground"
                        }`}
                      />
                    </motion.button>
                    {devocional.completed && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                      >
                        <CheckCircle className="h-5 w-5 text-accent" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.05 }}>
                    <Calendar className="h-3 w-3" />
                    {devocional.date}
                  </motion.div>
                  <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.05 }}>
                    <Clock className="h-3 w-3" />
                    {devocional.duration}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
