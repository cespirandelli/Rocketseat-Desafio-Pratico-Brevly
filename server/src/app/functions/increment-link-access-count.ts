import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { LinkNotFoundError } from './errors/link-not-found'

const incrementLinkAccessCountInput = z.object({
  id: z.string(),
})

type IncrementLinkAccessCountInput = z.input<
  typeof incrementLinkAccessCountInput
>

type IncrementLinkAccessCountOutput = {
  accessCount: number
}

export async function incrementLinkAccessCount(
  input: IncrementLinkAccessCountInput
): Promise<Either<LinkNotFoundError, IncrementLinkAccessCountOutput>> {
  const { id } = incrementLinkAccessCountInput.parse(input)

  const [link] = await db
    .update(schema.links)
    .set({ accessCount: sql`${schema.links.accessCount} + 1` })
    .where(eq(schema.links.id, id))
    .returning({ accessCount: schema.links.accessCount })

  if (!link) {
    return makeLeft(new LinkNotFoundError())
  }

  return makeRight({ accessCount: link.accessCount })
}
