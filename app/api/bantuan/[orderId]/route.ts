import { NextResponse } from 'next/server'
import { AssistStatus, TicketStatus } from '@prisma/client'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendWhatsApp } from '@/lib/fonnte'

const MAX_REVISIONS: Record<string, number> = { pro: 1, studio: 3 }

interface RouteContext { params: Promise<{ orderId: string }> }

export async function GET(_req: Request, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await params
  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id },
    select: {
      package: true,
      assist_status: true,
      revision_count: true,
      assist_tickets: {
        orderBy: { created_at: 'desc' },
        take: 1,
        select: { id: true, notes: true, revision_note: true, status: true },
      },
    },
  })

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    assist_status: order.assist_status,
    package: order.package,
    revision_count: order.revision_count,
    max_revisions: MAX_REVISIONS[order.package] ?? 0,
    ticket: order.assist_tickets[0] ?? null,
  })
}

export async function POST(req: Request, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await params
  const { notes } = (await req.json()) as { notes?: string }

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id, status: 'active' },
    include: {
      user: { select: { name: true } },
      theme: { select: { name: true } },
    },
  })

  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
  if (!['pro', 'studio'].includes(order.package)) {
    return NextResponse.json({ error: 'Fitur ini hanya untuk paket Pro dan Studio' }, { status: 403 })
  }
  if (order.assist_status !== 'idle') {
    return NextResponse.json({ error: 'Permintaan sudah pernah dikirim' }, { status: 400 })
  }

  await prisma.assistTicket.create({ data: { order_id: orderId, notes: notes?.trim() || null } })
  await prisma.order.update({
    where: { id: orderId },
    data: { assist_status: 'waiting_admin' as AssistStatus },
  })

  const adminWa = process.env.ADMIN_WA_NUMBER
  if (adminWa) {
    void sendWhatsApp(
      adminWa,
      `📋 Permintaan terima beres baru!\n\nUser: ${order.user.name ?? 'User'}\nTema: ${order.theme.name}\nPaket: ${order.package.toUpperCase()}\n\nCatatan:\n${notes?.trim() || '(tidak ada catatan)'}\n\nLihat: invizoku.com/admin/order/${orderId}`
    )
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await params
  const { action, revision_note } = (await req.json()) as {
    action: 'accept' | 'revision'
    revision_note?: string
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id, status: 'active' },
    include: {
      user: { select: { name: true } },
      assist_tickets: { orderBy: { created_at: 'desc' }, take: 1 },
    },
  })

  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
  if (order.assist_status !== 'waiting_review') {
    return NextResponse.json({ error: 'Aksi ini tidak tersedia sekarang' }, { status: 400 })
  }

  const ticket = order.assist_tickets[0] ?? null

  if (action === 'accept') {
    await prisma.order.update({ where: { id: orderId }, data: { assist_status: 'done' as AssistStatus } })
    if (ticket) {
      await prisma.assistTicket.update({
        where: { id: ticket.id },
        data: { status: 'closed' as TicketStatus },
      })
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'revision') {
    const maxRevisions = MAX_REVISIONS[order.package] ?? 0
    if (order.revision_count >= maxRevisions) {
      return NextResponse.json({ error: 'Jatah revisi sudah habis' }, { status: 400 })
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { assist_status: 'in_progress' as AssistStatus, revision_count: { increment: 1 } },
    })
    if (ticket) {
      await prisma.assistTicket.update({
        where: { id: ticket.id },
        data: {
          revision_note: revision_note?.trim() || null,
          status: 'in_progress' as TicketStatus,
        },
      })
    }

    const adminWa = process.env.ADMIN_WA_NUMBER
    if (adminWa) {
      void sendWhatsApp(
        adminWa,
        `🔄 Permintaan revisi!\n\nUser: ${order.user.name ?? 'User'}\nRevisi ke-${order.revision_count + 1}\n\nCatatan:\n${revision_note?.trim() || '(tidak ada catatan)'}\n\nLihat: invizoku.com/admin/order/${orderId}`
      )
    }

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 })
}
