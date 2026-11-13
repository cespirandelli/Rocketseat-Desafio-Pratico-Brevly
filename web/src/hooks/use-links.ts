import { useInfiniteQuery } from '@tanstack/react-query'
import { listLinks } from '@/http/list-links'

export const LINKS_QUERY_KEY = ['links']

export function useLinks() {
  return useInfiniteQuery({
    queryKey: LINKS_QUERY_KEY,
    queryFn: ({ pageParam }) => listLinks({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    select: data => data.pages.flatMap(page => page.links),
  })
}
