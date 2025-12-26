// Run the following command to generate a new secret:
// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface AuthPayload extends JwtPayload {
  id: string
  role: 'admin' | 'user'
}

export interface AuthRequest extends Request {
  user?: AuthPayload
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload

    req.user = {
      id: decoded.id,
      role: decoded.role
    }

    next()
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' })
  }
}
