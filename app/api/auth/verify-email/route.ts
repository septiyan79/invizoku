import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyToken } from '@/lib/tokens'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = z.object({ token: z.string() }).safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 })
  }

  const payload = await verifyToken(parsed.data.token)
  if (!payload || payload.type !== 'email_verification') {
    return NextResponse.json(
      { error: 'Token tidak valid atau sudah kadaluarsa' },
      { status: 400 }
    )
  }

  await prisma.user.update({
    where: { id: payload.userId },
    data: { email_verified: true },
  })

  return NextResponse.json({ message: 'Email berhasil diverifikasi' })
}
