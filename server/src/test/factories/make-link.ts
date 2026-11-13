import { randomUUID } from 'node:crypto'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const result = await db
    .insert(schema.links)
    .values({
      originalUrl: faker.internet.url(),
      shortUrl: `${faker.lorem.slug(2)}-${randomUUID().slice(0, 8)}`,
      ...overrides,
    })
    .returning()

  return result[0]
}
