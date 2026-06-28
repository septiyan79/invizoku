import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  current_password: z.string().min(1, 'Password saat ini wajib diisi'),
  new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
})

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { current_password, new_password } = parsed.data

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })
  if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })

  const valid = await bcrypt.compare(current_password, user.password)
  if (!valid) {
    return NextResponse.json({ error: 'Password saat ini tidak sesuai' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(new_password, 12)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashed },
  })

  return NextResponse.json({ ok: true })
}
