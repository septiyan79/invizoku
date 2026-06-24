import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generatePasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/mail'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = z.object({ email: z.string().email() }).safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 })
  }

  // Selalu return success untuk mencegah email enumeration
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (user) {
    const token = await generatePasswordResetToken(user.id, user.password)
    await sendPasswordResetEmail(user.email, user.name, token)
  }

  return NextResponse.json({
    message: 'Jika email terdaftar, link reset password akan dikirim.',
  })
}
