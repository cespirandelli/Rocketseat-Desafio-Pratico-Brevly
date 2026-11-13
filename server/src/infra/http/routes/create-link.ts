import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createLink } from '@/app/functions/create-link'
import { originalUrlSchema, shortUrlSchema } from '@/app/validations/link'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { linkResponseSchema } from './schemas/link-response'

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/links',
    {
      schema: {
        summary: 'Create a short link',
        tags: ['links'],
        body: z.object({
          originalUrl: originalUrlSchema,
          shortUrl: shortUrlSchema,
        }),
        response: {
          201: z.object({ link: linkResponseSchema }),
          409: z.object({ message: z.string() }).describe('Short URL in use'),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      const result = await createLink({ originalUrl, shortUrl })

      if (isRight(result)) {
        return reply.status(201).send(unwrapEither(result))
      }

      const error = unwrapEither(result)

      return reply.status(409).send({ message: error.message })
    }
  )
}
