import { env } from '@/env'

export function getShortUrlHref(shortUrl: string) {
  return new URL(shortUrl, env.VITE_FRONTEND_URL).toString()
}

export function getShortUrlLabel(shortUrl: string) {
  return `brev.ly/${shortUrl}`
}
