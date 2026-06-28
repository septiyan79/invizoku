import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const patchSchema = z.object({
  name: z.string().min(1, 'Nama tidak boleh kosong').max(100).optional(),
  phone_wa: z
    .string()
    .regex(/^(08|628)\d{8,11}$/, 'Format nomor WA tidak valid (contoh: 08123456789)')
    .optional(),
  notif_rsvp: z.boolean().optional(),
  notif_ucapan: z.boolean().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone_wa: true, notif_rsvp: true, notif_ucapan: true },
  })

  if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })

  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: 'Tidak ada yang diubah' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: { name: true, email: true, phone_wa: true, notif_rsvp: true, notif_ucapan: true },
  })

  return NextResponse.json(user)
}
