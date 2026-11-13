import { uuidv7 } from 'uuidv7'
import { describe, expect, it } from 'vitest'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { LinkNotFoundError } from './errors/link-not-found'
import { incrementLinkAccessCount } from './increment-link-access-count'

describe('increment link access count', () => {
  it('should be able to increment the access count of a link', async () => {
    const link = await makeLink({ accessCount: 10 })

    const sut = await incrementLinkAccessCount({ id: link.id })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({ accessCount: 11 })
  })

  it('should not lose accesses made at the same time', async () => {
    const link = await makeLink()

    await Promise.all(
      Array.from({ length: 10 }, () =>
        incrementLinkAccessCount({ id: link.id })
      )
    )

    const sut = await incrementLinkAccessCount({ id: link.id })

    expect(unwrapEither(sut)).toEqual({ accessCount: 11 })
  })

  it('should return an error when the link does not exist', async () => {
    const sut = await incrementLinkAccessCount({ id: uuidv7() })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFoundError)
  })
})
