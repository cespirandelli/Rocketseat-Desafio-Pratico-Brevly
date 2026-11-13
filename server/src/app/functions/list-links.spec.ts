import { describe, expect, it } from 'vitest'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { listLinks } from './list-links'

describe('list links', () => {
  it('should be able to list the links, newest first', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()

    const sut = await listLinks({ pageSize: 3 })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
      expect.objectContaining({ id: link1.id }),
    ])
  })

  it('should be able to paginate the links using a cursor', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()

    const firstPage = unwrapEither(await listLinks({ pageSize: 2 }))

    expect(firstPage.links).toEqual([
      expect.objectContaining({ id: link3.id }),
      expect.objectContaining({ id: link2.id }),
    ])
    expect(firstPage.nextCursor).toBe(link2.id)

    const secondPage = unwrapEither(
      await listLinks({ pageSize: 1, cursor: firstPage.nextCursor ?? '' })
    )

    expect(secondPage.links).toEqual([
      expect.objectContaining({ id: link1.id }),
    ])
  })
})
