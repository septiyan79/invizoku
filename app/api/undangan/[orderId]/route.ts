import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ orderId: string }>
}

export async function GET(_req: Request, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await params

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id },
    include: {
      invitation: { select: { content: true, published_at: true } },
      theme: { select: { name: true, component_key: true, event_categories: true } },
    },
  })

  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan.' }, { status: 404 })

  return NextResponse.json({
    orderId: order.id,
    package: order.package,
    slug: order.slug,
    status: order.status,
    expires_at: order.expires_at,
    theme: order.theme,
    content: order.invitation?.content ?? null,
    published_at: order.invitation?.published_at ?? null,
  })
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await params

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id, status: 'active' },
    include: {
      invitation: true,
      theme: { select: { component_key: true } },
    },
  })

  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan.' }, { status: 404 })
  if (!order.invitation) return NextResponse.json({ error: 'Data undangan belum tersedia.' }, { status: 404 })

  const body = await req.json()
  const { content, publish } = body as { content?: Record<string, unknown>; publish?: boolean }

  const existing = order.invitation.content as Record<string, unknown>
  const merged = content ? { ...existing, ...content } : existing

  await prisma.invitation.update({
    where: { order_id: orderId },
    data: {
      content: merged as object,
      updated_at: new Date(),
      ...(publish && !order.invitation.published_at ? { published_at: new Date() } : {}),
    },
  })

  revalidatePath(`/undangan/${order.slug}`)

  return NextResponse.json({ ok: true })
}
