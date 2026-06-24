import { SignJWT, jwtVerify } from 'jose'

function getSecret() {
  const s = process.env.NEXTAUTH_SECRET
  if (!s) throw new Error('NEXTAUTH_SECRET tidak diset')
  return new TextEncoder().encode(s)
}

export async function generateVerificationToken(userId: string): Promise<string> {
  return new SignJWT({ userId, type: 'email_verification' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(getSecret())
}

export async function generatePasswordResetToken(
  userId: string,
  passwordHash: string
): Promise<string> {
  return new SignJWT({ userId, type: 'password_reset', ph: passwordHash.slice(-8) })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .setIssuedAt()
    .sign(getSecret())
}

type TokenPayload = {
  userId: string
  type: 'email_verification' | 'password_reset'
  ph?: string
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}
