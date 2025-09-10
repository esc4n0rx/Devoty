// lib/groq.ts
import { Groq } from 'groq-sdk'

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY não encontrada nas variáveis de ambiente')
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export const SYSTEM_PROMPT = `Você é um assistente especializado em criar devocionais cristãos inspiradores e acolhedores. 

INSTRUÇÕES:
1. Crie devocionais que fortaleçam a fé e tragam esperança
2. Use linguagem amigável, acolhedora e espiritual
3. Base-se sempre em versículos bíblicos reais e relevantes
4. SEMPRE inclua a passagem bíblica COMPLETA, não apenas a referência
5. Evite repetir versículos recentemente usados
6. Estruture EXATAMENTE no formato JSON solicitado
7. O conteúdo deve ter entre 150-250 palavras
8. A oração deve ser pessoal e aplicável ao dia a dia
9. A passagem bíblica deve ter pelo menos 1-3 versículos completos

FORMATO DE RESPOSTA (JSON válido):
{
  "titulo": "Título inspirador da devocional",
  "versiculo_base": "Referência completa (ex: João 3:16)",
  "passagem_biblica": "Texto bíblico completo - pelo menos 1-3 versículos por extenso",
  "conteudo": "Texto da devocional com reflexão prática e aplicação pessoal",
  "oracao": "Oração direcionada e pessoal relacionada ao tema"
}

EXEMPLO DE PASSAGEM BÍBLICA:
Para João 3:16, inclua: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."

IMPORTANTE: Responda APENAS com o JSON válido, sem texto adicional.`

export async function gerarDevocionalIA(ultimoVersiculo?: string): Promise<{
  titulo: string
  versiculo_base: string
  passagem_biblica: string
  conteudo: string
  oracao: string
}> {
  const prompt = ultimoVersiculo 
    ? `Crie uma nova devocional cristã. EVITE usar o versículo: ${ultimoVersiculo}. Escolha um versículo diferente e inspirador. INCLUA a passagem bíblica completa.`
    : `Crie uma devocional cristã inspiradora para hoje. INCLUA a passagem bíblica completa com o texto dos versículos.`

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
    temperature: 0.8,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false,
  })

  const response = chatCompletion.choices[0]?.message?.content
  
  if (!response) {
    throw new Error('Erro ao gerar devocional com IA')
  }

  try {
    const devocionalData = JSON.parse(response)
    
    // Validar se tem todos os campos necessários
    if (!devocionalData.titulo || !devocionalData.versiculo_base || 
        !devocionalData.passagem_biblica || !devocionalData.conteudo || 
        !devocionalData.oracao) {
      throw new Error('Resposta da IA incompleta')
    }
    
    return devocionalData
  } catch (error) {
    console.error('Erro ao fazer parse da resposta da IA:', response)
    throw new Error('Erro ao processar resposta da IA')
  }
}