import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async (request, response) => {
  const tables = await knex('sqlite_schema').select('*')

  return tables
})

app
  .listen({
    port: 3333,
  })
  .then((response) => {
    console.log('HTTP server listening on port 3333')
  })
