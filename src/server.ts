import fastify from 'fastify'

const app = fastify()

app.get('/hello', (request, response) => {
  return 'Hello word'
})

app
  .listen({
    port: 3333,
  })
  .then((response) => {
    console.log('HTTP server listening on port 3333')
  })
