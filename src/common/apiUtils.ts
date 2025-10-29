import { Request } from 'express'

export const isBrowserRequest = (req: Request): boolean => {
  return req.headers.accept?.includes('text/html') ?? false
}
