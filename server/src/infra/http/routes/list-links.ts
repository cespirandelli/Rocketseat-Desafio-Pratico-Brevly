import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { listLinks } from '@/app/functions/list-links'
import { unwrapEither } from '@/infra/shared/either'
import { linkResponseSchema } from './schemas/link-response'

export const listLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'List links',
        tags: ['links'],
        querystring: z.object({
          cursor: z.string().optional(),
          pageSize: z.coerce.number().int().min(1).max(100).default(20),
        }),
        response: {
          200: z.object({
            links: z.array(linkResponseSchema),
            nextCursor: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { cursor, pageSize } = request.query

      const result = await listLinks({ cursor, pageSize })

      return reply.status(200).send(unwrapEither(result))
    }
  )
}
