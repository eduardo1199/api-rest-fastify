import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify({
  logger: true,
})

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

/* process.on('uncaughtException', (error) => {
  console.log(error.message)
  process.exit(1)
}) */

/* fastify.setErrorHandler(function (error, request, reply) {
  if (error instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
    // Log error
    this.log.error(error)
    // Send error response
    reply.status(500).send({ ok: false })
  } else {
    // fastify will use parent error handler to handle this
    reply.send(error)
  }
}) */

app.listen(
  {
    port: env.PORT,
  },
  (error) => {
    if (error) {
      app.log.error(error.message)
    } else {
      console.log('server is listening on port 3333')
    }
  },
)
