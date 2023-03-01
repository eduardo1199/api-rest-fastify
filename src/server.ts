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
