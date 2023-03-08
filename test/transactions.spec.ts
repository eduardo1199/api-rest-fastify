import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready() // espere que os plugins carregem na aplicação
  })

  afterAll(async () => {
    await app.close() // fechar aplicação após terminar todos os testes
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'create new transaction',
      amount: 5000,
      type: 'credit',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to list all transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'create new transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    expect(listTransactions.body.transactions).toEqual([
      expect.objectContaining({
        title: 'create new transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'create new transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    const transactionId = listTransactions.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'create new transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get summary transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'create new transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit Transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    expect(summaryResponse.body.summary).toEqual({ amount: 3000 })
  })
})
