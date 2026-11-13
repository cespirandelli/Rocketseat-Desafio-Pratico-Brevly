import { eq } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'
import { describe, expect, it } from 'vitest'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/infra/shared/either'
import { makeLink } from '@/test/factories/make-link'
import { deleteLink } from './delete-link'
import { LinkNotFoundError } from './errors/link-not-found'

describe('delete link', () => {
  it('should be able to delete a link', async () => {
    const link = await makeLink()

    const sut = await deleteLink({ id: link.id })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, link.id))

    expect(result).toHaveLength(0)
  })

  it('should return an error when the link does not exist', async () => {
    const sut = await deleteLink({ id: uuidv7() })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(LinkNotFoundError)
  })
})
