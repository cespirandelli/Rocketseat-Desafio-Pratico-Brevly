import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '@/env'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportLinksRoute } from './routes/export-links'
import { getLinkByShortUrlRoute } from './routes/get-link-by-short-url'
import { incrementLinkAccessCountRoute } from './routes/increment-link-access-count'
import { listLinksRoute } from './routes/list-links'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation,
    })
  }

  if (env.NODE_ENV !== 'test') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly API',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.get('/health', async () => ({ status: 'ok' }))

app.register(createLinkRoute)
app.register(listLinksRoute)
app.register(getLinkByShortUrlRoute)
app.register(deleteLinkRoute)
app.register(incrementLinkAccessCountRoute)
app.register(exportLinksRoute)
