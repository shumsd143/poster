import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface JWTPayload {
  email: string
}

export async function encryptPassword(password: string): Promise<string> {
  const saltRounds = 15
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

export async function matchPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function createAuthToken(email: string): string {
  const token = jwt.sign({ email } as JWTPayload, 'secret', {
    expiresIn: '30 days',
  })
  return token
}

export function verifyAuthToken(token: string): boolean {
  try {
    const decodedToken = jwt.verify(token, 'secret')
    return true
  } catch (error) {
    return false
  }
}

export function getEmailFromAuthToken(token: string): string {
  const decodedToken = jwt.decode(token) as JwtPayload
  return decodedToken.email
}
