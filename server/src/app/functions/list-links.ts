import { desc, lt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'

const listLinksInput = z.object({
  cursor: z.string().optional(),
  pageSize: z.number().int().min(1).max(100).default(20),
})

type ListLinksInput = z.input<typeof listLinksInput>

type ListLinksOutput = {
  links: (typeof schema.links.$inferSelect)[]
  nextCursor: string | null
}

export async function listLinks(
  input: ListLinksInput
): Promise<Either<never, ListLinksOutput>> {
  const { cursor, pageSize } = listLinksInput.parse(input)

  const rows = await db
    .select()
    .from(schema.links)
    .where(cursor ? lt(schema.links.id, cursor) : undefined)
    .orderBy(desc(schema.links.id))
    .limit(pageSize + 1)

  const hasNextPage = rows.length > pageSize
  const links = hasNextPage ? rows.slice(0, pageSize) : rows
  const nextCursor = hasNextPage ? links[links.length - 1].id : null

  return makeRight({ links, nextCursor })
}
