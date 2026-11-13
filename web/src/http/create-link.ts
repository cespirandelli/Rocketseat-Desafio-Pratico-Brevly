import { api } from '@/lib/api'
import type { Link } from './types'

export type CreateLinkBody = {
  originalUrl: string
  shortUrl: string
}

export async function createLink(body: CreateLinkBody) {
  const response = await api.post<{ link: Link }>('/links', body)

  return response.data.link
}
