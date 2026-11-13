import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getLinkByShortUrl } from '@/app/functions/get-link-by-short-url'
import { isRight, unwrapEither } from '@/infra/shared/either'
import { linkResponseSchema } from './schemas/link-response'

export const getLinkByShortUrlRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links/:shortUrl',
    {
      schema: {
        summary: 'Get the original URL from a short URL',
        tags: ['links'],
        params: z.object({
          shortUrl: z.string(),
        }),
        response: {
          200: z.object({ link: linkResponseSchema }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.params

      const result = await getLinkByShortUrl({ shortUrl })

      if (isRight(result)) {
        return reply.status(200).send(unwrapEither(result))
      }

      const error = unwrapEither(result)

      return reply.status(404).send({ message: error.message })
    }
  )
}
