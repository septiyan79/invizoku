import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { verifyToken } from '@/lib/tokens'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Password minimal 8 karakter').max(72),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const payload = await verifyToken(parsed.data.token)
  if (!payload || payload.type !== 'password_reset') {
    return NextResponse.json(
      { error: 'Token tidak valid atau sudah kadaluarsa' },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) {
    return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 })
  }

  if (user.password.slice(-8) !== payload.ph) {
    return NextResponse.json({ error: 'Token sudah tidak berlaku' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })

  return NextResponse.json({ message: 'Password berhasil direset. Silakan login.' })
}
