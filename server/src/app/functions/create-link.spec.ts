import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { createLink } from './create-link'
import { ShortUrlAlreadyExistsError } from './errors/short-url-already-exists'

describe('create link', () => {
  it('should be able to create a link', async () => {
    const shortUrl = `meu-link-${randomUUID().slice(0, 8)}`

    const sut = await createLink({
      originalUrl: 'https://www.rocketseat.com.br',
      shortUrl,
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortUrl, shortUrl))

    expect(result).toHaveLength(1)
    expect(result[0].accessCount).toBe(0)
  })

  it('should not be able to create a link with an existing short url', async () => {
    const link = await makeLink()

    const sut = await createLink({
      originalUrl: 'https://www.google.com',
      shortUrl: link.shortUrl,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(ShortUrlAlreadyExistsError)
  })

  it('should not be able to create a link with a malformed short url', async () => {
    await expect(
      createLink({
        originalUrl: 'https://www.google.com',
        shortUrl: 'link com espaço!',
      })
    ).rejects.toThrow()
  })

  it('should not be able to create a link with an invalid original url', async () => {
    await expect(
      createLink({
        originalUrl: 'not-a-url',
        shortUrl: `valid-${randomUUID().slice(0, 8)}`,
      })
    ).rejects.toThrow()
  })
})
