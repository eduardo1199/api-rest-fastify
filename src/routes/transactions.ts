import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExist } from '../middlewares/check-session-id-exist'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExist] },
    async (request, response) => {
      const sessionId = request.cookies.sessionId

      const transactions = await knex('transactions')
        .where({ session_id: sessionId })
        .select()

      return {
        transactions,
      }
    },
  )

  app.get('/:id', { preHandler: [checkSessionIdExist] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const sessionId = request.cookies.sessionId

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions')
      .where({
        id,
        session_id: sessionId,
      })
      .first()

    return { transaction }
  })

  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = crypto.randomUUID()

      response.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return response.status(201).send()
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExist] },
    async (request) => {
      const sessionId = request.cookies.sessionId

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )
}
