// lib/groq.ts
import { Groq } from 'groq-sdk'

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY não encontrada nas variáveis de ambiente')
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export const SYSTEM_PROMPT = `Você é um assistente especializado em criar devocionais cristãos inspiradores e acolhedores. 

INSTRUÇÕES OBRIGATÓRIAS:
1. Crie devocionais que fortaleçam a fé e tragam esperança
2. Use linguagem amigável, acolhedora e espiritual
3. Base-se sempre em versículos bíblicos reais e relevantes
4. SEMPRE inclua a passagem bíblica COMPLETA, não apenas a referência
5. Evite repetir versículos recentemente usados
6. Estruture EXATAMENTE no formato JSON solicitado
7. O conteúdo deve ter entre 180-340 palavras
8. A oração deve ser pessoal e aplicável ao dia a dia
9. A passagem bíblica deve ter pelo menos 1-3 versículos completos

FORMATO DE RESPOSTA OBRIGATÓRIO (JSON válido):
{
  "titulo": "Título inspirador da devocional",
  "versiculo_base": "Referência completa (ex: João 3:16)",
  "passagem_biblica": "Texto bíblico completo - pelo menos 1-3 versículos por extenso",
  "conteudo": "Texto da devocional com reflexão prática e aplicação pessoal",
  "oracao": "Oração direcionada e pessoal relacionada ao tema"
}

ATENÇÃO: TODOS OS 5 CAMPOS SÃO OBRIGATÓRIOS. Se você não incluir qualquer um deles, a resposta será rejeitada.

EXEMPLO DE PASSAGEM BÍBLICA:
Para João 3:16, inclua: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."

EXEMPLO DE ORAÇÃO:
"Pai celestial, obrigado(a) pelo Seu amor incondicional. Ajude-me a confiar em Suas promessas e a viver cada dia sabendo que sou amado(a) por Ti. Em nome de Jesus, amém."

IMPORTANTE: Responda APENAS com o JSON válido, sem texto adicional antes ou depois.`

function generateFallbackContent(partialData: any): {
  titulo: string
  versiculo_base: string
  passagem_biblica: string
  conteudo: string
  oracao: string
} {
  const fallbacks = {
    titulo: partialData.titulo || "Uma Palavra de Esperança",
    versiculo_base: partialData.versiculo_base || "Salmos 23:1",
    passagem_biblica: partialData.passagem_biblica || "O Senhor é o meu pastor; nada me faltará.",
    conteudo: partialData.conteudo || "Deus tem um plano perfeito para nossa vida. Mesmo quando não entendemos, podemos confiar em Sua bondade e amor. Hoje, descanse na certeza de que Ele está cuidando de cada detalhe da sua jornada.",
    oracao: partialData.oracao || "Pai celestial, obrigado(a) por Sua presença constante em minha vida. Ajude-me a confiar em Seus planos e a encontrar paz em Sua vontade. Em nome de Jesus, amém."
  }
  
  return fallbacks
}

function cleanJsonResponse(response: string): string {
  // Remove possível texto antes e depois do JSON
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    return jsonMatch[0]
  }
  return response
}

export async function gerarDevocionalIA(ultimoVersiculo?: string): Promise<{
  titulo: string
  versiculo_base: string
  passagem_biblica: string
  conteudo: string
  oracao: string
}> {
  const prompt = ultimoVersiculo 
    ? `Crie uma nova devocional cristã. EVITE usar o versículo: ${ultimoVersiculo}. Escolha um versículo diferente e inspirador. INCLUA a passagem bíblica completa e uma oração. RESPONDA APENAS COM JSON VÁLIDO.`
    : `Crie uma devocional cristã inspiradora para hoje. INCLUA a passagem bíblica completa com o texto dos versículos e uma oração personalizada. RESPONDA APENAS COM JSON VÁLIDO.`

  // Primeira tentativa
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[DevocionalIA] Tentativa ${attempt} de gerar devocional`)
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: attempt === 1 ? 0.7 : 0.5, // Reduzir temperatura nas tentativas seguintes
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
      })

      const response = chatCompletion.choices[0]?.message?.content
      
      if (!response) {
        console.log(`[DevocionalIA] Tentativa ${attempt}: Resposta vazia da IA`)
        continue
      }

      // Limpar a resposta
      const cleanedResponse = cleanJsonResponse(response.trim())
      console.log(`[DevocionalIA] Tentativa ${attempt}: Resposta recebida:`, cleanedResponse)

      try {
        const devocionalData = JSON.parse(cleanedResponse)
        
        // Validar se tem todos os campos necessários
        const requiredFields = ['titulo', 'versiculo_base', 'passagem_biblica', 'conteudo', 'oracao']
        const missingFields = requiredFields.filter(field => !devocionalData[field])
        
        if (missingFields.length > 0) {
          console.log(`[DevocionalIA] Tentativa ${attempt}: Campos faltantes:`, missingFields)
          
          // Se for a última tentativa, usar fallback para campos faltantes
          if (attempt === 3) {
            console.log(`[DevocionalIA] Usando fallback para campos faltantes`)
            const completeData = generateFallbackContent(devocionalData)
            return completeData
          }
          
          continue // Tentar novamente
        }
        
        console.log(`[DevocionalIA] Tentativa ${attempt}: Sucesso!`)
        return devocionalData
        
      } catch (parseError) {
        console.log(`[DevocionalIA] Tentativa ${attempt}: Erro no parse JSON:`, parseError)
        
        // Se for a última tentativa, usar fallback completo
        if (attempt === 3) {
          console.log(`[DevocionalIA] Usando fallback completo devido a erro de parse`)
          const completeData = generateFallbackContent({})
          return completeData
        }
      }
      
    } catch (error) {
      console.log(`[DevocionalIA] Tentativa ${attempt}: Erro na chamada da IA:`, error)
      
      // Se for a última tentativa, usar fallback completo
      if (attempt === 3) {
        console.log(`[DevocionalIA] Usando fallback completo devido a erro na IA`)
        const completeData = generateFallbackContent({})
        return completeData
      }
    }
  }

  // Fallback final (não deveria chegar aqui, mas garantia extra)
  console.log(`[DevocionalIA] Todas as tentativas falharam, usando fallback final`)
  return generateFallbackContent({})
}