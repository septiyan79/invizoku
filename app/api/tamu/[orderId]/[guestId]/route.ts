import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ orderId: string; guestId: string }>
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId, guestId } = await params

  const guest = await prisma.guest.findFirst({
    where: { id: guestId, order_id: orderId },
    include: { order: { select: { user_id: true } } },
  })

  if (!guest || guest.order.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Tamu tidak ditemukan.' }, { status: 404 })
  }

  await prisma.guest.delete({ where: { id: guestId } })

  return NextResponse.json({ ok: true })
}
