// lib/bible-cache.ts
interface CacheEntry<T> {
  data: T
  timestamp: number
  size: number
}

class BibleCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly MAX_SIZE = 50 * 1024 * 1024 // 50MB
  private readonly TTL = 30 * 60 * 1000 // 30 minutos
  private currentSize = 0

  set<T>(key: string, data: T): void {
    const serialized = JSON.stringify(data)
    const size = new Blob([serialized]).size

    // Limpar cache se necessário
    this.evictIfNeeded(size)

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      size
    }

    // Remover entrada anterior se existir
    if (this.cache.has(key)) {
      const oldEntry = this.cache.get(key)!
      this.currentSize -= oldEntry.size
    }

    this.cache.set(key, entry)
    this.currentSize += size
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    // Verificar TTL
    if (Date.now() - entry.timestamp > this.TTL) {
      this.delete(key)
      return null
    }

    return entry.data as T
  }

  private evictIfNeeded(newSize: number): void {
    if (this.currentSize + newSize <= this.MAX_SIZE) return

    // Ordenar por timestamp (mais antigo primeiro)
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.timestamp - b.timestamp
    )

    for (const [key] of entries) {
      this.delete(key)
      if (this.currentSize + newSize <= this.MAX_SIZE) break
    }
  }

  private delete(key: string): void {
    const entry = this.cache.get(key)
    if (entry) {
      this.currentSize -= entry.size
      this.cache.delete(key)
    }
  }

  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }
}

export const bibleCache = new BibleCache()