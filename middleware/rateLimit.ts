import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

interface RateLimitConfig {
  intervalInSeconds: number
  maxRequests: number
}

const RATE_LIMIT_CONFIGS: { [key: string]: RateLimitConfig } = {
  post: { intervalInSeconds: 60, maxRequests: 3 }, // 1 dakikada en fazla 3 post
  music: { intervalInSeconds: 120, maxRequests: 2 }, // 2 dakikada en fazla 2 müzik
  auth: { intervalInSeconds: 300, maxRequests: 5 }, // 5 dakikada en fazla 5 auth isteği
  default: { intervalInSeconds: 60, maxRequests: 10 } // varsayılan limit
}

export async function rateLimit(req: NextRequest, type: keyof typeof RATE_LIMIT_CONFIGS = 'default') {
  try {
    const token = await getToken({ req })
    const ip = req.headers.get('x-forwarded-for') || 'anonymous'
    const identifier = token?.email || ip

    const config = RATE_LIMIT_CONFIGS[type]
    const key = `rate-limit:${type}:${identifier}`

    // Redis'ten mevcut istek sayısını al
    const currentRequests = await redis.get<number>(key) || 0

    if (currentRequests >= config.maxRequests) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.' },
        { status: 429 }
      )
    }

    // İstek sayısını artır ve süreyi ayarla
    if (currentRequests === 0) {
      await redis.setex(key, config.intervalInSeconds, 1)
    } else {
      await redis.incr(key)
    }

    return null // Rate limit aşılmadı
  } catch (error) {
    console.error('Rate limit hatası:', error)
    return null // Redis hatası durumunda isteğe izin ver
  }
} 