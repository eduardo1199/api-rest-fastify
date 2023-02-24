import fastify from 'fastify'
import { knex } from './database'

import crypto from 'node:crypto'

const app = fastify()

app.get('/hello', async (request, response) => {
  const transactions = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Transação de teste',
      amount: 1000,
    })
    .returning('*')

  return transactions
})

app
  .listen({
    port: 3333,
  })
  .then((response) => {
    console.log('HTTP server listening on port 3333')
  })
