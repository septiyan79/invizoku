import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ orderId: string }>
}

async function getOwnedActiveOrder(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, user_id: userId, status: 'active' },
  })
}

export async function GET(_req: Request, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await params
  const order = await getOwnedActiveOrder(orderId, session.user.id)
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan.' }, { status: 404 })
  if (order.package === 'trial') {
    return NextResponse.json(
      { error: 'Fitur ini tidak tersedia untuk paket trial.' },
      { status: 403 },
    )
  }

  const guests = await prisma.guest.findMany({
    where: { order_id: orderId },
    orderBy: { created_at: 'desc' },
  })

  return NextResponse.json({ guests })
}

const addSchema = z.object({
  names: z.array(z.string().trim().min(1).max(100)).min(1).max(100),
})

export async function POST(req: Request, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await params
  const order = await getOwnedActiveOrder(orderId, session.user.id)
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan.' }, { status: 404 })
  if (order.package === 'trial') {
    return NextResponse.json(
      { error: 'Fitur ini tidak tersedia untuk paket trial.' },
      { status: 403 },
    )
  }

  const body = await req.json()
  const parsed = addSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Data tidak valid.' }, { status: 400 })

  const { names } = parsed.data

  const guests = await prisma.$transaction(
    names.map((name) =>
      prisma.guest.create({
        data: { order_id: orderId, name, token: randomBytes(12).toString('hex') },
      }),
    ),
  )

  return NextResponse.json({ guests }, { status: 201 })
}
