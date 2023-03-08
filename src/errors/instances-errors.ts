import { ZodIssue } from 'zod'
import * as z from 'zod'

class ZodError extends Error {
  issues: ZodIssue[] = []
}

export const myError = new ZodError()
export type ErrorInstanceZod = typeof z.ZodError
