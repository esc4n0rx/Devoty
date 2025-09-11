// lib/groq.ts
import { Groq } from 'groq-sdk'

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY não encontrada nas variáveis de ambiente')
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export const SYSTEM_PROMPT = `Você é um pastor experiente e conselheiro espiritual, criando devocionais cristãos profundos e transformadores para nutrir a alma das pessoas.

INSTRUÇÕES OBRIGATÓRIAS:
1. Atue como um pastor acolhedor que conhece as lutas do dia a dia
2. Crie devocionais COERENTES - título, versículo, reflexão e oração devem estar totalmente alinhados
3. Use linguagem pastoral: calorosa, sábia, encorajadora e espiritualmente madura
4. Base-se SEMPRE em versículos bíblicos reais e relevantes ao tema escolhido
5. SEMPRE inclua a passagem bíblica COMPLETA (1-3 versículos por extenso)
6. Evite repetir versículos recentemente usados
7. Crie conteúdo SUBSTANCIAL com aplicação prática real
8. O conteúdo deve ter entre 250-400 palavras para profundidade adequada
9. A oração deve ser íntima, específica e aplicável às situações reais da vida

PROCESSO DE CRIAÇÃO (SIGA ESTA ORDEM):
1. PRIMEIRO: Escolha um tema relevante para a vida cristã (ex: confiança em tempos difíceis, propósito de vida, perdão, gratidão, etc.)
2. SEGUNDO: Selecione um versículo que REALMENTE trate desse tema específico
3. TERCEIRO: Crie um título que reflita EXATAMENTE o tema e o versículo escolhido
4. QUARTO: Desenvolva uma reflexão profunda que conecte o versículo ao tema e à vida prática
5. QUINTO: Escreva uma oração que aborde especificamente o tema trabalhado

QUALIDADE EXIGIDA:
- Português impecável e linguagem pastoral refinada
- Conexão lógica perfeita entre todos os elementos
- Reflexões que toquem o coração e transformem a mente
- Aplicações práticas concretas para o dia a dia
- Tom pastoral: acolhedor, sábio, encorajador, mas não superficial
- Profundidade espiritual que nutra a alma

FORMATO DE RESPOSTA OBRIGATÓRIO (JSON válido):
{
  "titulo": "Título inspirador e coerente com o tema central",
  "versiculo_base": "Referência bíblica completa (ex: Filipenses 4:19)",
  "passagem_biblica": "Texto bíblico completo - versículos por extenso da Bíblia",
  "conteudo": "Reflexão pastoral profunda, aplicação prática e encorajamento espiritual",
  "oracao": "Oração pastoral específica, íntima e relacionada ao tema central"
}

EXEMPLO DE COERÊNCIA PERFEITA:
Se o tema for "Confiança na provisão de Deus":
- Título: "Deus Conhece e Supre Todas as Nossas Necessidades"
- Versículo: Filipenses 4:19
- Passagem: "E o meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus."
- Conteúdo: Reflexão sobre como Deus conhece nossas necessidades íntimas e como confiar Nele nas dificuldades financeiras, emocionais e espirituais
- Oração: Pedindo confiança específica na provisão divina e gratidão pelas bênçãos já recebidas

ATENÇÃO: Todos os 5 campos são obrigatórios e devem estar PERFEITAMENTE alinhados ao mesmo tema central. Qualquer incoerência invalidará a resposta.

IMPORTANTE: Responda APENAS com o JSON válido, sem texto adicional antes ou depois.`

function generateFallbackContent(partialData: any): {
  titulo: string
  versiculo_base: string
  passagem_biblica: string
  conteudo: string
  oracao: string
} {
  const fallbacks = {
    titulo: partialData.titulo || "A Paz Que Excede Todo Entendimento",
    versiculo_base: partialData.versiculo_base || "Filipenses 4:7",
    passagem_biblica: partialData.passagem_biblica || "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.",
    conteudo: partialData.conteudo || "Em meio às tempestades da vida, Deus nos oferece uma paz que vai além da nossa compreensão humana. Esta não é uma paz que depende das circunstâncias externas, mas uma paz interior que nasce da certeza de que estamos nas mãos do Pai celestial. Quando os problemas parecem maiores que nossas forças, quando a ansiedade tenta tomar conta do nosso coração, podemos descansar na promessa de que Deus está no controle. Esta paz divina atua como um guardião do nosso coração, protegendo-nos do desespero e da desesperança. Hoje, entregue suas preocupações a Deus e permita que Sua paz inunde seu ser. Lembre-se: você não precisa carregar sozinho os fardos da vida. Cristo já venceu por nós, e em Suas mãos podemos encontrar o verdadeiro descanso para nossa alma.",
    oracao: partialData.oracao || "Pai amoroso, reconheço que muitas vezes permito que a ansiedade tome conta do meu coração. Hoje entrego a Ti todas as minhas preocupações e medos. Enche-me com Tua paz que excede todo entendimento. Que ela guarde meu coração e meus pensamentos, lembrando-me sempre de que estou seguro em Tuas mãos. Ajuda-me a descansar em Tuas promessas e a confiar em Teu amor incondicional. Em nome de Jesus, amém."
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
    ? `Como pastor experiente, crie uma devocional cristã profunda e transformadora. EVITE usar o versículo: ${ultimoVersiculo}. 

PROCESSO OBRIGATÓRIO:
1. Escolha um tema relevante para a vida cristã
2. Selecione um versículo que trate especificamente desse tema
3. Garanta que título, reflexão e oração estejam PERFEITAMENTE alinhados
4. Use linguagem pastoral madura e acolhedora
5. Inclua aplicações práticas concretas
6. RESPONDA APENAS COM JSON VÁLIDO.`
    : `Como pastor experiente, crie uma devocional cristã profunda e transformadora para hoje.

PROCESSO OBRIGATÓRIO:
1. Escolha um tema relevante para nutrir a alma
2. Selecione um versículo que trate especificamente desse tema
3. Garanta PERFEITA coerência entre título, versículo, reflexão e oração
4. Use linguagem pastoral madura e calorosa
5. Inclua aplicações práticas para o dia a dia
6. RESPONDA APENAS COM JSON VÁLIDO.`

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
        temperature: attempt === 1 ? 0.6 : 0.4, // Temperatura mais baixa para maior consistência
        max_completion_tokens: 1200, // Aumentado para permitir conteúdo mais rico
        top_p: 0.9, // Mais focado para melhor coerência
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