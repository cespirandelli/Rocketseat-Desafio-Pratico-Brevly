import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { incrementLinkAccessCount } from '@/app/functions/increment-link-access-count'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const incrementLinkAccessCountRoute: FastifyPluginAsyncZod =
  async server => {
    server.patch(
      '/links/:id/access',
      {
        schema: {
          summary: 'Increment the access count of a link',
          tags: ['links'],
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({ accessCount: z.number() }),
            404: z.object({ message: z.string() }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params

        const result = await incrementLinkAccessCount({ id })

        if (isRight(result)) {
          return reply.status(200).send(unwrapEither(result))
        }

        const error = unwrapEither(result)

        return reply.status(404).send({ message: error.message })
      }
    )
  }
