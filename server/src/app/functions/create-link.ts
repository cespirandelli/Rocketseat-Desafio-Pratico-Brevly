import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { originalUrlSchema, shortUrlSchema } from '@/app/validations/link'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { ShortUrlAlreadyExistsError } from './errors/short-url-already-exists'

const createLinkInput = z.object({
  originalUrl: originalUrlSchema,
  shortUrl: shortUrlSchema,
})

type CreateLinkInput = z.input<typeof createLinkInput>

type CreateLinkOutput = {
  link: typeof schema.links.$inferSelect
}

const UNIQUE_VIOLATION_CODE = '23505'

export async function createLink(
  input: CreateLinkInput
): Promise<Either<ShortUrlAlreadyExistsError, CreateLinkOutput>> {
  const { originalUrl, shortUrl } = createLinkInput.parse(input)

  const [linkWithSameShortUrl] = await db
    .select({ id: schema.links.id })
    .from(schema.links)
    .where(eq(schema.links.shortUrl, shortUrl))
    .limit(1)

  if (linkWithSameShortUrl) {
    return makeLeft(new ShortUrlAlreadyExistsError())
  }

  try {
    const [link] = await db
      .insert(schema.links)
      .values({ originalUrl, shortUrl })
      .returning()

    return makeRight({ link })
  } catch (error) {
    const cause = (error as { cause?: { code?: string } }).cause
    if (cause?.code === UNIQUE_VIOLATION_CODE) {
      return makeLeft(new ShortUrlAlreadyExistsError())
    }

    throw error
  }
}
