// lib/utils/timezone.ts

/**
 * Utilitários para trabalhar com timezone brasileiro (América/São_Paulo)
 */

const BRAZIL_TIMEZONE = 'America/Sao_Paulo'

/**
 * Obtém a data atual no timezone brasileiro
 */
export function getBrazilianDate(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: BRAZIL_TIMEZONE }))
}

/**
 * Obtém o início do dia (00:00:00) no timezone brasileiro
 */
export function getBrazilianStartOfDay(date?: Date): Date {
  const baseDate = date || getBrazilianDate()
  const startOfDay = new Date(baseDate)
  startOfDay.setHours(0, 0, 0, 0)
  return startOfDay
}

/**
 * Obtém o final do dia (23:59:59) no timezone brasileiro
 */
export function getBrazilianEndOfDay(date?: Date): Date {
  const baseDate = date || getBrazilianDate()
  const endOfDay = new Date(baseDate)
  endOfDay.setHours(23, 59, 59, 999)
  return endOfDay
}

/**
 * Obtém a meia-noite do próximo dia no timezone brasileiro
 */
export function getBrazilianNextMidnight(): Date {
  const brazilianDate = getBrazilianDate()
  const nextDay = new Date(brazilianDate)
  nextDay.setDate(nextDay.getDate() + 1)
  return getBrazilianStartOfDay(nextDay)
}

/**
 * Verifica se uma data é hoje considerando o timezone brasileiro
 */
export function isToday(dateToCheck: string | Date): boolean {
  const checkDate = typeof dateToCheck === 'string' ? new Date(dateToCheck) : dateToCheck
  const today = getBrazilianDate()
  
  return checkDate.getFullYear() === today.getFullYear() &&
         checkDate.getMonth() === today.getMonth() &&
         checkDate.getDate() === today.getDate()
}

/**
 * Obtém o string de data no formato ISO para busca no banco (início do dia brasileiro)
 */
export function getBrazilianDateForDB(): string {
  return getBrazilianStartOfDay().toISOString()
}

/**
 * Obtém o string de data no formato YYYY-MM-DD para o timezone brasileiro
 */
export function getBrazilianDateString(): string {
  const brazilianDate = getBrazilianDate()
  return brazilianDate.toISOString().split('T')[0]
}