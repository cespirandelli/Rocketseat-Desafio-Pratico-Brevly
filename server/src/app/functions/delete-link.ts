import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { LinkNotFoundError } from './errors/link-not-found'

const deleteLinkInput = z.object({
  id: z.string(),
})

type DeleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(
  input: DeleteLinkInput
): Promise<Either<LinkNotFoundError, null>> {
  const { id } = deleteLinkInput.parse(input)

  const deletedLinks = await db
    .delete(schema.links)
    .where(eq(schema.links.id, id))
    .returning({ id: schema.links.id })

  if (deletedLinks.length === 0) {
    return makeLeft(new LinkNotFoundError())
  }

  return makeRight(null)
}
