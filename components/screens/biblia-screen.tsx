"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookOpen, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function BibliaScreen() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className="p-6 space-y-6">
      <motion.div
        className="text-center space-y-2"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-xl font-bold text-foreground"
          animate={{
            textShadow: [
              "0 0 0px rgba(255,255,255,0)",
              "0 0 10px rgba(255,255,255,0.3)",
              "0 0 0px rgba(255,255,255,0)",
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          Bíblia Sagrada
        </motion.h2>
        <p className="text-muted-foreground">Explore a Palavra de Deus</p>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
          <motion.div animate={{ rotate: searchValue ? [0, 360] : 0 }} transition={{ duration: 1, ease: "easeInOut" }}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </motion.div>
          <Input
            placeholder="Pesquisar passagem..."
            className="pl-10 h-12 transition-all duration-300 focus:shadow-lg"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300">
            <Search className="h-4 w-4 mr-2" />
            Pesquisar
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      >
        <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <BookOpen className="h-5 w-5" />
                </motion.div>
                Leitura Sugerida
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Sparkles className="h-4 w-4 text-accent" />
                </motion.div>
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="font-semibold text-foreground mb-2">Salmo 23</h3>
              <motion.p
                className="text-foreground leading-relaxed text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                "O Senhor é o meu pastor; nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas
                tranquilas. Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome..."
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full bg-transparent hover:bg-accent/10 transition-all duration-300"
              >
                Ler capítulo completo
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
