"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Headphones, BookOpen, Heart, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function HojeScreen() {
  const [isLiked, setIsLiked] = useState(false)
  const [showDevocional, setShowDevocional] = useState(false)

  if (showDevocional) {
    return <DevocionalReader onBack={() => setShowDevocional(false)} />
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <motion.div
              className="text-center space-y-2 mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-foreground">Devocional de Hoje</h2>
              <p className="text-muted-foreground">Terça-feira, 9 de Janeiro</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CardTitle className="text-lg font-semibold text-foreground text-center">
                "Confie no Senhor de todo o seu coração"
              </CardTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">Provérbios 3:5-6</p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            <motion.p
              className="text-foreground leading-relaxed text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em
              todos os seus caminhos, e ele endireitará as suas veredas."
            </motion.p>

            <motion.div
              className="flex gap-3"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300">
                  <Headphones className="h-4 w-4 mr-2" />
                  Ouvir
                </Button>
              </motion.div>

              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full h-12 bg-transparent hover:bg-accent/10 transition-all duration-300"
                  onClick={() => setShowDevocional(true)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ler
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center pt-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring", bounce: 0.4 }}
            >
              <motion.button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-accent/10 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }} transition={{ duration: 0.3 }}>
                  <Heart
                    className={`h-5 w-5 transition-colors duration-300 ${
                      isLiked ? "text-red-500 fill-red-500" : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
                <span className="text-sm text-muted-foreground">{isLiked ? "Curtido" : "Curtir"}</span>
              </motion.button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        <Card className="bg-secondary/50 border-border shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <motion.h3
              className="font-semibold text-foreground mb-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Reflexão do Dia
            </motion.h3>
            <motion.p
              className="text-sm text-muted-foreground leading-relaxed"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Hoje, reflita sobre como você pode confiar mais em Deus em suas decisões diárias. Que áreas da sua vida
              você precisa entregar completamente a Ele?
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function DevocionalReader({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-6"
      >
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-accent/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Devocional de Hoje</h1>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              "Confie no Senhor de todo o seu coração"
            </CardTitle>
            <p className="text-accent font-medium">Provérbios 3:5-6</p>
            <p className="text-sm text-muted-foreground">Terça-feira, 9 de Janeiro</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-accent/10 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed text-center italic">
                "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor
                em todos os seus caminhos, e ele endireitará as suas veredas."
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Reflexão</h3>
              <p className="text-foreground leading-relaxed">
                A confiança é um dos pilares mais importantes da vida cristã. Quando Salomão nos ensina a confiar no
                Senhor de todo o seu coração, ele está nos chamando para uma entrega completa, não parcial.
              </p>
              <p className="text-foreground leading-relaxed">
                Muitas vezes, tentamos resolver nossos problemas com nossa própria sabedoria, esquecendo que Deus tem um
                plano perfeito para nossas vidas. Ele conhece o fim desde o princípio e sabe exatamente o que é melhor
                para nós.
              </p>
              <p className="text-foreground leading-relaxed">
                Hoje, escolha confiar. Nas decisões pequenas e grandes, reconheça a Deus e permita que Ele direcione
                seus passos. Sua sabedoria é infinitamente superior à nossa.
              </p>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Oração do Dia</h4>
              <p className="text-foreground leading-relaxed italic">
                "Senhor, hoje eu escolho confiar em Ti de todo o meu coração. Ajuda-me a não me apoiar em meu próprio
                entendimento, mas a buscar Tua vontade em todas as áreas da minha vida. Dirige meus passos e endireita
                minhas veredas. Em nome de Jesus, amém."
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
