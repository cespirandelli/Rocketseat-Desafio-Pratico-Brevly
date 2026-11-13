import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { LinkNotFoundError } from './errors/link-not-found'

const getLinkByShortUrlInput = z.object({
  shortUrl: z.string(),
})

type GetLinkByShortUrlInput = z.input<typeof getLinkByShortUrlInput>

type GetLinkByShortUrlOutput = {
  link: typeof schema.links.$inferSelect
}

export async function getLinkByShortUrl(
  input: GetLinkByShortUrlInput
): Promise<Either<LinkNotFoundError, GetLinkByShortUrlOutput>> {
  const { shortUrl } = getLinkByShortUrlInput.parse(input)

  const [link] = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))
    .limit(1)

  if (!link) {
    return makeLeft(new LinkNotFoundError())
  }

  return makeRight({ link })
}
