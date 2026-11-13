import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { LinkNotFoundError } from './errors/link-not-found'
import { getLinkByShortUrl } from './get-link-by-short-url'

describe('get link by short url', () => {
  it('should be able to get the original url from a short url', async () => {
    const link = await makeLink({ originalUrl: 'https://github.com' })

    const sut = await getLinkByShortUrl({ shortUrl: link.shortUrl })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      link: expect.objectContaining({
        id: link.id,
        originalUrl: 'https://github.com',
      }),
    })
  })

  it('should return an error when the short url does not exist', async () => {
    const sut = await getLinkByShortUrl({ shortUrl: randomUUID() })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFoundError)
  })
})
