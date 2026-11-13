import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/infra/http/app'
import { makeLink } from '@/test/factories/make-link'

describe('links routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 201 when creating a link', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/links',
      payload: {
        originalUrl: 'https://www.rocketseat.com.br',
        shortUrl: `rocket-${randomUUID().slice(0, 8)}`,
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json().link).toEqual(
      expect.objectContaining({ accessCount: 0 })
    )
  })

  it('should return 400 when the short url is malformed', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/links',
      payload: {
        originalUrl: 'https://www.rocketseat.com.br',
        shortUrl: 'url/invalida?',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 409 when the short url already exists', async () => {
    const link = await makeLink()

    const response = await app.inject({
      method: 'POST',
      url: '/links',
      payload: {
        originalUrl: 'https://www.rocketseat.com.br',
        shortUrl: link.shortUrl,
      },
    })

    expect(response.statusCode).toBe(409)
  })

  it('should return 204 when deleting a link', async () => {
    const link = await makeLink()

    const response = await app.inject({
      method: 'DELETE',
      url: `/links/${link.id}`,
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 404 when the short url does not exist', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/links/${randomUUID()}`,
    })

    expect(response.statusCode).toBe(404)
  })

  it('should increment the access count of a link', async () => {
    const link = await makeLink()

    const response = await app.inject({
      method: 'PATCH',
      url: `/links/${link.id}/access`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ accessCount: 1 })
  })
})
