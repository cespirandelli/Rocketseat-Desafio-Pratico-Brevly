import { api } from '@/lib/api'
import type { Link } from './types'

type ListLinksParams = {
  cursor?: string
  pageSize?: number
}

export type ListLinksResponse = {
  links: Link[]
  nextCursor: string | null
}

export async function listLinks({ cursor, pageSize = 20 }: ListLinksParams) {
  const response = await api.get<ListLinksResponse>('/links', {
    params: { cursor, pageSize },
  })

  return response.data
}
