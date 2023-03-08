import { app } from './app'
import { env } from './env'

/* app.setErrorHandler(function (error, request, reply) {
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
}) */

app.listen(
  {
    port: env.PORT,
  },
  (error) => {
    if (!error) {
      console.log('server is listening on port 3333')
    }
  },
)
