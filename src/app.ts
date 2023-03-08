import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactions'
import { Log } from './hooks/log-hook'
import { z } from 'zod'
import { StatusCodeErrors } from './errors/status-code.errors'

export const app = fastify({
  logger: true,
})

app.addHook('preHandler', Log)
app.addHook('onError', (request, reply, error) => {
  if (error instanceof z.ZodError) {
    const errorMessage = error.issues.map((issue) => {
      return {
        message: `${issue.path[0]}: ${issue.message}`,
      }
    })

    return reply
      .status(StatusCodeErrors.BAD_REQUEST)
      .send(JSON.stringify(errorMessage))
  } else {
    return reply.status(StatusCodeErrors.INTERNAL_SERVER_ERROR).send(error)
  }
})

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
