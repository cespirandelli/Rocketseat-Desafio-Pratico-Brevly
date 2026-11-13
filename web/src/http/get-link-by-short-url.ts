import { api } from '@/lib/api'
import type { Link } from './types'

export async function getLinkByShortUrl(shortUrl: string) {
  const response = await api.get<{ link: Link }>(
    `/links/${encodeURIComponent(shortUrl)}`
  )

  return response.data.link
}
