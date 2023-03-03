import { FastifyRequest } from 'fastify'

export async function Log(request: FastifyRequest) {
  console.log(`LOG: method: [${request.method}] url: ${request.url}`)
}
